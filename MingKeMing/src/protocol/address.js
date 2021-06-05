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

    /**
     *  Address for MKM ID
     *  ~~~~~~~~~~~~~~~~~~
     *  This class is used to build address for ID
     *
     *      properties:
     *          network - address type
     *          number  - search number
     */
    var Address = function () {
    };
    ns.Interface(Address, null);

    /**
     *  get address type
     *
     * @returns {int} 0 ~ 255
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
     *  Address for broadcast
     */
    Address.ANYWHERE = null;    // 'anywhere'
    Address.EVERYWHERE = null;  // 'everywhere'

    //-------- namespace --------
    ns.protocol.Address = Address;

    ns.protocol.register('Address');

})(MingKeMing);

(function (ns) {
    'use strict';

    var str = ns.type.String;
    var Address = ns.protocol.Address;

    /**
     *  Address Factory
     *  ~~~~~~~~~~~~~~~
     */
    var AddressFactory = function () {
    };
    ns.Interface(AddressFactory, null);

    // noinspection JSUnusedLocalSymbols
    AddressFactory.prototype.parseAddress = function (address) {
        console.assert(false, 'implement me!');
        return null;
    };

    Address.Factory = AddressFactory;

    var s_factory = null;

    Address.getFactory = function () {
        return s_factory;
    };
    Address.setFactory = function (factory) {
        s_factory = factory;
    };

    /**
     *  Parse string object to address
     *
     * @param {String} address - address string
     * @return {Address}
     */
    Address.parse = function (address) {
        if (!address) {
            return null;
        } else if (ns.Interface.conforms(address, Address)) {
            return address;
        } else if (address instanceof str) {
            address = address.toString();
        }
        return Address.getFactory().parseAddress(address);
    };

})(MingKeMing);
