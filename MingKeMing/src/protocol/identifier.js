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

//! require 'address.js'

(function (ns) {
    'use strict';

    var Address = ns.protocol.Address;

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
    var ID = function () {
    };
    ns.Interface(ID, null);

    /**
     *  Get ID.name
     *
     * @returns {String}
     */
    ID.prototype.getName = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Get ID.address
     *
     * @returns {Address}
     */
    ID.prototype.getAddress = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Get ID.terminal
     *
     * @returns {String}
     */
    ID.prototype.getTerminal = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get ID.type
     *
     * @returns {uint} 0 ~ 255
     */
    ID.prototype.getType = function () {
        console.assert(false, 'implement me!');
        return 0;
    };

    ID.prototype.isBroadcast = function () {
        console.assert(false, 'implement me!');
        return false;
    };
    ID.prototype.isUser = function () {
        console.assert(false, 'implement me!');
        return false;
    };
    ID.prototype.isGroup = function () {
        console.assert(false, 'implement me!');
        return false;
    };

    /**
     *  ID for broadcast
     */
    ID.ANYONE = null;    // 'anyone@anywhere'
    ID.EVERYONE = null;  // 'everyone@everywhere'
    /**
     *  DIM Founder
     */
    ID.FOUNDER = null;   // 'moky@anywhere'

    /**
     *  Convert Strings to IDs
     *
     * @param {String[]} members
     * @returns {ID[]}
     */
    ID.convert = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = ID.parse(members[i]);
            if (id) {
                array.push(id);
            }
        }
        return array;
    };

    /**
     *  Convert IDs to Strings
     *
     * @param {ID[]} members
     * @return {String[]}
     */
    ID.revert = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = members[i];
            if (typeof id === 'string') {
                array.push(id);
            } else {
                array.push(id.toString());
            }
        }
        return array;
    };

    //-------- namespace --------
    ns.protocol.ID = ID;

    ns.protocol.register('ID');

})(MingKeMing);

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;

    /**
     *  ID Factory
     *  ~~~~~~~~~~
     */
    var IDFactory = function () {
    };
    ns.Interface(IDFactory, null);

    // noinspection JSUnusedLocalSymbols
    IDFactory.prototype.createID = function (name, address, terminal) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    IDFactory.prototype.parseID = function (identifier) {
        console.assert(false, 'implement me!');
        return null;
    };

    ID.Factory = IDFactory;

    var s_factory;

    ID.getFactory = function () {
        return s_factory;
    };
    ID.setFactory = function (factory) {
        s_factory = factory;
    };

    /**
     *  Create ID
     *
     * @param {String} name     - ID.name
     * @param {Address} address - ID.address
     * @param {String} terminal - ID.terminal
     * @return {ID}
     */
    ID.create = function (name, address, terminal) {
        return ID.getFactory().create(name, address, terminal);
    };

    /**
     *  Parse string object to ID
     *
     * @param {String} identifier - ID string
     * @return {ID}
     */
    ID.parse = function (identifier) {
        if (!identifier) {
            return null;
        } else if (identifier instanceof ID) {
            return identifier;
        } else if (identifier instanceof ns.type.String) {
            identifier = identifier.toString();
        }
        return ID.getFactory().parseID(identifier);
    };

})(MingKeMing);
