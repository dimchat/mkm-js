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

//! require 'entity.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Stringer  = ns.type.Stringer;

    /**
     *  Address for MKM ID
     *  ~~~~~~~~~~~~~~~~~~
     *  This class is used to build address for ID
     *
     *      properties:
     *          network - address type
     *          number  - search number
     */
    var Address = Interface(null, [Stringer]);

    /**
     *  get address type
     *
     * @returns {uint} 0 ~ 255
     */
    Address.prototype.getType = function () {};

    /**
     *  Address for broadcast
     *  ~~~~~~~~~~~~~~~~~~~~~
     */
    Address.ANYWHERE   = null;  // 'anywhere'
    Address.EVERYWHERE = null;  // 'everywhere'

    //
    //  Factory methods
    //

    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory;
    };

    /**
     *  Generate address with meta & network
     *
     * @param {Meta} meta - meta info
     * @param {uint} network - address.type
     * @return {Address}
     */
    Address.generate = function (meta, network) {
        var gf = general_factory();
        return gf.generateAddress(meta, network);
    };

    /**
     *  Create address with string
     *
     * @param {string} address - address string
     * @return {Address}
     */
    Address.create = function (address) {
        var gf = general_factory();
        return gf.createAddress(address);
    };

    /**
     *  Parse string object to address
     *
     * @param {*} address - address string
     * @return {Address}
     */
    Address.parse = function (address) {
        var gf = general_factory();
        return gf.parseAddress(address);
    };

    /**
     *  Register address factory
     *
     * @param {AddressFactory} factory
     */
    Address.setFactory = function (factory) {
        var gf = general_factory();
        gf.setAddressFactory(factory);
    };
    Address.getFactory = function () {
        var gf = general_factory();
        return gf.getAddressFactory();
    };

    /**
     *  Address Factory
     *  ~~~~~~~~~~~~~~~
     */
    var AddressFactory = Interface(null, null);

    /**
     *  Generate address with meta & type
     *
     * @param {Meta} meta    - meta info
     * @param {uint} network - address type
     * @return {Address}
     */
    AddressFactory.prototype.generateAddress = function (meta, network) {};

    /**
     *  Create address from string
     *
     * @param {string} address - address string
     * @return {Address}
     */
    AddressFactory.prototype.createAddress = function (address) {};

    /**
     *  Parse string object to address
     *
     * @param {string} address - address string
     * @return {Address}
     */
    AddressFactory.prototype.parseAddress = function (address) {};

    Address.Factory = AddressFactory;

    //-------- namespace --------
    ns.protocol.Address = Address;
    // ns.protocol.AddressFactory = AddressFactory;

})(MingKeMing);
