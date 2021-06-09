;
// license: https://mit-license.org
//
//  Ming-Ke-Ming : Decentralized User Identity Authentication
//
//                               Written in 2020 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2020 Albert Moky
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// =============================================================================
//

//! require 'protocol/identifier.js'

(function (ns) {
    'use strict';

    var str = ns.type.String;
    var ID = ns.protocol.ID;

    /**
     *  ID for entity (User/Group)
     *
     *      data format: "name@address[/terminal]"
     *
     *      fields:
     *          name     - entity name, the seed of fingerprint to build address
     *          address  - a string to identify an entity
     *          terminal - entity login resource(device), OPTIONAL
     */
    var Identifier = function (identifier, name, address, terminal) {
        str.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal;
    };
    ns.Class(Identifier, str, [ID]);

    Identifier.prototype.getName = function () {
        return this.__name;
    };
    Identifier.prototype.getAddress = function () {
        return this.__address;
    };
    Identifier.prototype.getTerminal = function () {
        return this.__terminal;
    };

    Identifier.prototype.getType = function () {
        return this.getAddress().getNetwork();
    };

    Identifier.prototype.isBroadcast = function () {
        return this.getAddress().isBroadcast();
    };
    Identifier.prototype.isUser = function () {
        return this.getAddress().isUser();
    };
    Identifier.prototype.isGroup = function () {
        return this.getAddress().isGroup();
    };

    //-------- namespace --------
    ns.mkm.Identifier = Identifier;

    ns.mkm.registers('Identifier');

})(MingKeMing);

(function (ns) {
    'use strict';

    var obj = ns.type.Object;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Identifier = ns.mkm.Identifier;

    /**
     *  Concat ID with components
     *
     * @param {String} name
     * @param {Address} address
     * @param {String} terminal
     * @return {String}
     */
    var concat = function (name, address, terminal) {
        var string = address.toString();
        if (name && name.length > 0) {
            string = name + '@' + string;
        }
        if (terminal && terminal.length > 0) {
            string = string + '/' + terminal;
        }
        return string;
    };

    /**
     *  Parse ID from string
     *
     * @param {String} string
     * @return {Identifier}
     */
    var parse = function (string) {
        var name, address, terminal;
        // split ID string for terminal
        var pair = string.split('/');
        if (pair.length === 1) {
            // no terminal
            terminal = null;
        } else {
            // got terminal
            terminal = pair[1];
        }
        // name @ address
        pair = pair[0].split('@');
        if (pair.length === 1) {
            // got address without name
            name = null;
            address = Address.parse(pair[0]);
        } else {
            name = pair[0];
            address = Address.parse(pair[1]);
        }
        return new Identifier(string, name, address, terminal);
    };

    var IDFactory = function () {
        obj.call(this);
        this.__identifiers = {};  // String -> ID
    };
    ns.Class(IDFactory, obj, [ID.Factory])

    IDFactory.prototype.createID = function (name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.__identifiers[string];
        if (!id) {
            id = new Identifier(string, name, address, terminal);
            this.__identifiers[string] = id;
        }
        return id;
    }

    IDFactory.prototype.parseID = function (identifier) {
        var id = this.__identifiers[identifier];
        if (!id) {
            id = parse(identifier);
            if (id) {
                this.__identifiers[identifier] = id;
            }
        }
        return id;
    };

    //-------- namespace --------
    ns.mkm.IDFactory = IDFactory;

    ns.mkm.registers('IDFactory');

})(MingKeMing);
