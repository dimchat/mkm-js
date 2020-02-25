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

//! require 'protocol.js'

!function (ns) {
    'use strict';

    var NetworkType = ns.protocol.NetworkType;

    /**
     *  Address for MKM ID
     *  ~~~~~~~~~~~~~~~~~~
     *  This class is used to build address for ID
     *
     *      properties:
     *          network - address type
     *          number  - search number
     */
    var Address = function (string) {
        ns.type.String.call(this, string);
    };
    ns.Class(Address, ns.type.String);

    /**
     *  get address type
     *
     * @returns {NetworkType}
     */
    Address.prototype.getNetwork = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  get search number
     *
     * @returns {Number}
     */
    Address.prototype.getCode = function () {
        console.assert(false, 'implement me!');
        return 0;
    };

    Address.prototype.isBroadcast = function () {
        var network = this.getNetwork();
        if (Address.EVERYWHERE.getNetwork().equals(network)) {
            return this.equals(Address.EVERYWHERE);
        }
        if (Address.ANYWHERE.getNetwork().equals(network)) {
            return this.equals(Address.ANYWHERE);
        }
        return false;
    };

    //-------- runtime --------
    var address_classes = [];

    /**
     *  Add extended Address class to process new format
     *
     * @param clazz {Class} - extended Address class
     */
    Address.register = function (clazz) {
        address_classes.push(clazz);
    };

    /**
     *  Create/get instance of Address
     *
     * @param string {String} - address string/object
     * @returns {Address}
     */
    Address.getInstance = function (string) {
        if (!string) {
            return null;
        } else if (string instanceof Address) {
            return string;
        }
        // address for broadcast
        if (Address.ANYWHERE.equalsIgnoreCase(string)) {
            // noinspection JSValidateTypes
            return Address.ANYWHERE;
        }
        if (Address.EVERYWHERE.equalsIgnoreCase(string)) {
            // noinspection JSValidateTypes
            return Address.EVERYWHERE;
        }
        // try each subclass to parse address
        var clazz;
        for (var i = address_classes.length - 1; i >= 0; --i) {
            clazz = address_classes[i];
            try {
                var addr = new clazz(string);
                if (addr) {
                    return addr;
                }
            } catch (e) {
            }
        }
        throw TypeError('unrecognized address: ' + string);
    };

    //
    //  Address for broadcast
    //
    var ConstantAddress = function (string, network, number) {
        Address.call(this, string);
        this.network = network;
        this.number = number;
    };
    ns.Class(ConstantAddress, Address);

    ConstantAddress.prototype.getNetwork = function () {
        return this.network;
    };

    ConstantAddress.prototype.getCode = function () {
        return this.number;
    };

    /**
     *  Address for broadcast
     */
    Address.ANYWHERE = new ConstantAddress('anywhere',
        ns.protocol.NetworkType.Main, 9527);
    Address.EVERYWHERE = new ConstantAddress('everywhere',
        ns.protocol.NetworkType.Group, 9527);

    //-------- namespace --------
    ns.Address = Address;

    ns.register('Address')

}(MingKeMing);
