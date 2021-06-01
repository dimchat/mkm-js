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

//! require 'string.js'
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
        this.name = name;
        this.address = address;
        this.terminal = terminal;
    };
    ns.Class(Identifier, str, [ID]);

    Identifier.prototype.getName = function () {
        return this.name;
    };
    Identifier.prototype.getAddress = function () {
        return this.address;
    };
    Identifier.prototype.getTerminal = function () {
        return this.terminal;
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
    ns.Identifier = Identifier;

    ns.register('Identifier');

})(MingKeMing);

(function (ns) {
    'use strict';

    var Address = ns.protocol.Address;
    var IDFactory = ns.protocol.IDFactory;
    var Identifier = ns.Identifier;

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

    var GeneralFactory = function () {
        this.identifiers = {};  // String -> ID
    };
    ns.Class(GeneralFactory, null, [IDFactory])

    GeneralFactory.prototype.createID = function (name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.identifiers[string];
        if (!id) {
            id = new Identifier(string, name, address, terminal);
            this.identifiers[string] = id;
        }
        return id;
    }

    GeneralFactory.prototype.parseID = function (identifier) {
        var id = this.identifiers[identifier];
        if (!id) {
            id = parse(identifier);
            if (id) {
                this.identifiers[identifier] = id;
            }
        }
        return id;
    };

    //-------- namespace --------
    ns.IDFactory = GeneralFactory;

    ns.register('IDFactory');

})(MingKeMing);
