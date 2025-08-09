'use strict';
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
    mkm.protocol.ID = Interface(null, [Stringer]);
    var ID = mkm.protocol.ID;

    /**
     *  Get ID.name
     *
     * @returns {String}
     */
    ID.prototype.getName = function () {};
    /**
     *  Get ID.address
     *
     * @returns {Address}
     */
    ID.prototype.getAddress = function () {};
    /**
     *  Get ID.terminal
     *
     * @returns {String}
     */
    ID.prototype.getTerminal = function () {};

    /**
     *  Get ID.type
     *
     * @returns {uint} 0 ~ 255
     */
    ID.prototype.getType = function () {};

    ID.prototype.isBroadcast = function () {};
    ID.prototype.isUser      = function () {};
    ID.prototype.isGroup     = function () {};

    /**
     *  ID for Broadcast
     *  ~~~~~~~~~~~~~~~~
     */
    ID.ANYONE   = null;  // 'anyone@anywhere'
    ID.EVERYONE = null;  // 'everyone@everywhere'
    // DIM Founder
    ID.FOUNDER  = null;  // 'moky@anywhere'

    //
    //  Conveniences
    //

    /**
     *  Convert Strings to IDs
     *
     * @param {String[]} array
     * @returns {ID[]}
     */
    ID.convert = function (array) {
        var members = [];
        var did;
        for (var i = 0; i < array.length; ++i) {
            did = ID.parse(array[i]);
            if (did) {
                members.push(did);
            }
        }
        return members;
    };

    /**
     *  Convert IDs to Strings
     *
     * @param {ID[]} identifiers - ID list
     * @return {String[]}
     */
    ID.revert = function (identifiers) {
        var array = [];
        var did;
        for (var i = 0; i < identifiers.length; ++i) {
            did = identifiers[i];
            if (Interface.conforms(did, Stringer)) {
                array.push(did.toString());
            } else if (IObject.isString(did)) {
                array.push(did);
            }
        }
        return array;
    };

    //
    //  Factory methods
    //

    /**
     *  Generate ID
     *
     * @param {Meta} meta       - meta info
     * @param {uint} network    - ID.type
     * @param {String} terminal - ID.terminal
     * @return {ID}
     */
    ID.generate = function (meta, network, terminal) {
        var helper = AccountExtensions.getIdentifierHelper();
        return helper.generateIdentifier(meta, network, terminal);
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
        var helper = AccountExtensions.getIdentifierHelper();
        return helper.createIdentifier(name, address, terminal);
    };

    /**
     *  Parse string object to ID
     *
     * @param {*} identifier - ID string
     * @return {ID}
     */
    ID.parse = function (identifier) {
        var helper = AccountExtensions.getIdentifierHelper();
        return helper.parseIdentifier(identifier);
    };

    /**
     *  Register ID factory
     *
     * @param {IDFactory} factory
     */
    ID.setFactory = function (factory) {
        var helper = AccountExtensions.getIdentifierHelper();
        helper.setIdentifierFactory(factory);
    };
    ID.getFactory = function () {
        var helper = AccountExtensions.getIdentifierHelper();
        return helper.getIdentifierFactory();
    };

    /**
     *  ID Factory
     *  ~~~~~~~~~~
     */
    ID.Factory = Interface(null, null);
    var IDFactory = ID.Factory;

    /**
     *  Generate ID
     *
     * @param {Meta} meta       - meta info
     * @param {uint} network    - ID.type
     * @param {String} terminal - ID.terminal
     * @return {ID}
     */
    IDFactory.prototype.generateIdentifier = function (meta, network, terminal) {};

    /**
     *  Create ID
     *
     * @param {String} name     - ID.name
     * @param {Address} address - ID.address
     * @param {String} terminal - ID.terminal
     * @return {ID}
     */
    IDFactory.prototype.createIdentifier = function (name, address, terminal) {};

    /**
     *  Parse string object to ID
     *
     * @param {string} identifier - ID string
     * @return {ID}
     */
    IDFactory.prototype.parseIdentifier = function (identifier) {};
