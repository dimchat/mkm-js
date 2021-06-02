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

//! require 'protocol/types.js'
//! require 'protocol/address.js'

(function (ns) {
    'use strict';

    var str = ns.type.String;
    var NetworkType = ns.protocol.NetworkType;
    var Address = ns.protocol.Address;

    //
    //  Address for broadcast
    //
    var BroadcastAddress = function (string, network) {
        str.call(this, string);
        if (network instanceof NetworkType) {
            network = network.valueOf();
        }
        this.network = network;
    };
    ns.Class(BroadcastAddress, str, [Address]);

    BroadcastAddress.prototype.getNetwork = function () {
        return this.network;
    };

    BroadcastAddress.prototype.isBroadcast = function () {
        return true;
    };
    BroadcastAddress.prototype.isUser = function () {
        return NetworkType.isUser(this.network);
    };
    BroadcastAddress.prototype.isGroup = function () {
        return NetworkType.isGroup(this.network);
    };

    /**
     *  Address for broadcast
     */
    Address.ANYWHERE = new BroadcastAddress('anywhere', NetworkType.MAIN);
    Address.EVERYWHERE = new BroadcastAddress('everywhere', NetworkType.GROUP);

    //-------- namespace --------
    ns.BroadcastAddress = BroadcastAddress;

    ns.register('BroadcastAddress')

})(MingKeMing);

(function (ns) {
    'use strict';

    var Address = ns.protocol.Address;

    var AddressFactory = function () {
        this.addresses = {};  // String -> Address
        // cache broadcast addresses
        this.addresses[Address.ANYWHERE.toString()] = Address.ANYWHERE;
        this.addresses[Address.EVERYWHERE.toString()] = Address.EVERYWHERE;
    };
    ns.Interface(AddressFactory, [Address.Factory])

    AddressFactory.prototype.parseAddress = function (string) {
        var address = this.addresses[string];
        if (!address) {
            address = this.createAddress(string);
            if (address) {
                this.addresses[string] = address;
            }
        }
        return address;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Create address from string
     *
     * @param {String} address - address string
     * @return {Address}
     */
    AddressFactory.prototype.createAddress = function (address) {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.AddressFactory = AddressFactory;

    ns.register('AddressFactory');

})(MingKeMing);

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var IDFactory = ns.IDFactory;

    var factory = new IDFactory();
    ID.setFactory(factory);

    /**
     *  ID for broadcast
     */
    ID.ANYONE = factory.createID('anyone', Address.ANYWHERE, null);
    ID.EVERYONE = factory.createID('everyone', Address.EVERYWHERE, null);

})(MingKeMing);
