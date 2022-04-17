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

//! require 'namespace.js'

(function (ns) {
    'use strict';

    var Stringer = ns.type.Stringer;

    /**
     *  Address for MKM ID
     *  ~~~~~~~~~~~~~~~~~~
     *  This class is used to build address for ID
     *
     *      properties:
     *          network - address type
     *          number  - search number
     */
    var Address = function () {};
    ns.Interface(Address, [Stringer]);

    // Address for broadcast
    Address.ANYWHERE = null;    // 'anywhere'
    Address.EVERYWHERE = null;  // 'everywhere'

    /**
     *  get address type
     *
     * @returns {uint} 0 ~ 255
     */
    Address.prototype.getNetwork = function () {
        console.assert(false, 'implement me!');
        return 0;
    };

    Address.prototype.isBroadcast = function () {
        console.assert(false, 'implement me!');
        return false;
    };
    Address.prototype.isUser = function () {
        console.assert(false, 'implement me!');
        return false;
    };
    Address.prototype.isGroup = function () {
        console.assert(false, 'implement me!');
        return false;
    };

    /**
     *  Address Factory
     *  ~~~~~~~~~~~~~~~
     */
    var AddressFactory = function () {};
    ns.Interface(AddressFactory, null);

    // noinspection JSUnusedLocalSymbols
    AddressFactory.prototype.generateAddress = function (meta, network) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    AddressFactory.prototype.createAddress = function (address) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    AddressFactory.prototype.parseAddress = function (address) {
        console.assert(false, 'implement me!');
        return null;
    };

    Address.Factory = AddressFactory;

    //
    //  Instances of Address.Factory
    //
    var s_factory = null;

    /**
     *  Register address factory
     *
     * @param {AddressFactory} factory
     */
    Address.setFactory = function (factory) {
        s_factory = factory;
    };
    Address.getFactory = function () {
        return s_factory;
    };

    /**
     *  Generate address with meta & network
     *
     * @param {Meta} meta - meta info
     * @param {uint} network - address.type
     * @return {Address}
     */
    Address.generate = function (meta, network) {
        var factory = Address.getFactory();
        return factory.generateAddress(meta, network);
    };

    /**
     *  Create address with string
     *
     * @param {String} address - address string
     * @return {Address}
     */
    Address.create = function (address) {
        var factory = Address.getFactory();
        return factory.createAddress(address);
    };

    /**
     *  Parse string object to address
     *
     * @param {*} address - address string
     * @return {Address}
     */
    Address.parse = function (address) {
        if (!address) {
            return null;
        } else if (ns.Interface.conforms(address, Address)) {
            return address;
        }
        address = ns.type.Wrapper.fetchString(address);
        var factory = Address.getFactory();
        return factory.parseAddress(address);
    };

    //-------- namespace --------
    ns.protocol.Address = Address;

    ns.protocol.registers('Address');

})(MingKeMing);
