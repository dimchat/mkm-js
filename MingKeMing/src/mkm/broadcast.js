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
//! require 'identifier.js'

(function (ns) {
    'use strict';

    var ConstantString = ns.type.ConstantString;
    var NetworkType = ns.protocol.NetworkType;
    var Address = ns.protocol.Address;

    //
    //  Address for broadcast
    //
    var BroadcastAddress = function (string, network) {
        ConstantString.call(this, string);
        if (network instanceof NetworkType) {
            network = network.valueOf();
        }
        this.__network = network;
    };
    ns.Class(BroadcastAddress, ConstantString, [Address]);

    // Override
    BroadcastAddress.prototype.getNetwork = function () {
        return this.__network;
    };

    // Override
    BroadcastAddress.prototype.isBroadcast = function () {
        return true;
    };

    // Override
    BroadcastAddress.prototype.isUser = function () {
        return NetworkType.isUser(this.__network);
    };

    // Override
    BroadcastAddress.prototype.isGroup = function () {
        return NetworkType.isGroup(this.__network);
    };

    /**
     *  Address for broadcast
     */
    Address.ANYWHERE = new BroadcastAddress('anywhere', NetworkType.MAIN);
    Address.EVERYWHERE = new BroadcastAddress('everywhere', NetworkType.GROUP);

    //-------- namespace --------
    ns.mkm.BroadcastAddress = BroadcastAddress;

    ns.mkm.registers('BroadcastAddress')

})(MingKeMing);

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var IDFactory = ns.mkm.IDFactory;

    var factory = new IDFactory();
    ID.setFactory(factory);

    /**
     *  ID for broadcast
     */
    ID.ANYONE = factory.createID('anyone', Address.ANYWHERE, null);
    ID.EVERYONE = factory.createID('everyone', Address.EVERYWHERE, null);
    /**
     *  DIM Founder
     */
    ID.FOUNDER = factory.createID('moky', Address.ANYWHERE, null);

})(MingKeMing);
