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

    var Interface = ns.type.Interface;
    var Stringer  = ns.type.Stringer;

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
    var ID = Interface(null, [Stringer]);

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
     * @param {String[]} list
     * @returns {ID[]}
     */
    ID.convert = function (list) {
        var gf = general_factory();
        return gf.convertIdentifiers(list);
    };

    /**
     *  Convert IDs to Strings
     *
     * @param {ID[]} list
     * @return {String[]}
     */
    ID.revert = function (list) {
        var gf = general_factory();
        return gf.revertIdentifiers(list);
    };

    //
    //  Factory methods
    //

    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory;
    };

    /**
     *  Generate ID
     *
     * @param {Meta} meta       - meta info
     * @param {uint} network    - ID.type
     * @param {String} terminal - ID.terminal
     * @return {ID}
     */
    ID.generate = function (meta, network, terminal) {
        var gf = general_factory();
        return gf.generateIdentifier(meta, network, terminal);
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
        var gf = general_factory();
        return gf.createIdentifier(name, address, terminal);
    };

    /**
     *  Parse string object to ID
     *
     * @param {*} identifier - ID string
     * @return {ID}
     */
    ID.parse = function (identifier) {
        var gf = general_factory();
        return gf.parseIdentifier(identifier);
    };

    /**
     *  Register ID factory
     *
     * @param {IDFactory} factory
     */
    ID.setFactory = function (factory) {
        var gf = general_factory();
        gf.setIdentifierFactory(factory);
    };
    ID.getFactory = function () {
        var gf = general_factory();
        return gf.getIdentifierFactory();
    };

    /**
     *  ID Factory
     *  ~~~~~~~~~~
     */
    var IDFactory = Interface(null, null);

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

    ID.Factory = IDFactory;

    //-------- namespace --------
    ns.protocol.ID = ID;
    // ns.protocol.IDFactory = IDFactory;

})(MingKeMing);
