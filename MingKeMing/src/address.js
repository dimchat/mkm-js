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
    ns.Class(Address, ns.type.String, null);

    /**
     *  get address type
     *
     * @returns {int} 0 ~ 255
     */
    Address.prototype.getNetwork = function () {
        console.assert(false, 'implement me!');
        return 0;
    };

    /**
     *  get search number
     *
     * @returns {int} 1 ~ 4294967295 (2^32-1)
     */
    Address.prototype.getCode = function () {
        console.assert(false, 'implement me!');
        return 0;
    };

    /**
     *  Is broadcast address?
     *
     * @returns {boolean}
     */
    Address.prototype.isBroadcast = function () {
        if (this.getCode() !== BROADCAST_CODE) {
            return false;
        }
        var network = this.getNetwork();
        if (network === NetworkType.Group.valueOf()) {
            // group address
            return this.equals(EVERYWHERE);
        }
        if (network === NetworkType.Main.valueOf()) {
            // user address
            return this.equals(ANYWHERE);
        }
        return false;
    };

    Address.prototype.isUser = function () {
        var network = this.getNetwork();
        return NetworkType.isUser(network);
    };
    Address.prototype.isGroup = function () {
        var network = this.getNetwork();
        return NetworkType.isGroup(network);
    };

    //-------- runtime --------
    var address_classes = [];

    /**
     *  Add extended Address class to process new format
     *
     * @param {Class} clazz - extended Address class
     */
    Address.register = function (clazz) {
        address_classes.push(clazz);
    };

    /**
     *  Create/get instance of Address
     *
     * @param {String} string - address string/object
     * @returns {Address}
     */
    Address.getInstance = function (string) {
        if (!string) {
            return null;
        } else if (string instanceof Address) {
            return string;
        }
        // address for broadcast
        if (ANYWHERE.equalsIgnoreCase(string)) {
            // noinspection JSValidateTypes
            return ANYWHERE;
        }
        if (EVERYWHERE.equalsIgnoreCase(string)) {
            // noinspection JSValidateTypes
            return EVERYWHERE;
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
        if (network instanceof NetworkType) {
            network = network.valueOf();
        }
        this.network = network;
        this.number = number;
    };
    ns.Class(ConstantAddress, Address, null);

    ConstantAddress.prototype.getNetwork = function () {
        return this.network;
    };

    ConstantAddress.prototype.getCode = function () {
        return this.number;
    };

    /**
     *  Address for broadcast
     */
    var BROADCAST_CODE = 9527;
    var ANYWHERE = new ConstantAddress('anywhere', NetworkType.Main, BROADCAST_CODE);
    var EVERYWHERE = new ConstantAddress('everywhere', NetworkType.Group, BROADCAST_CODE);
    Address.ANYWHERE = ANYWHERE;
    Address.EVERYWHERE = EVERYWHERE;

    //-------- namespace --------
    ns.Address = Address;

    ns.register('Address')

}(MingKeMing);
