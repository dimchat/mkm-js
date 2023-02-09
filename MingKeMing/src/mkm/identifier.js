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

//! require 'protocol/identifier.js'

//! require 'broadcast.js'

(function (ns) {
    'use strict';

    var Class          = ns.type.Class;
    var ConstantString = ns.type.ConstantString;

    var ID      = ns.protocol.ID;
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
    var Identifier = function (identifier, name, address, terminal) {
        ConstantString.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal;
    };
    Class(Identifier, ConstantString, [ID]);

    // Override
    Identifier.prototype.getName = function () {
        return this.__name;
    };

    // Override
    Identifier.prototype.getAddress = function () {
        return this.__address;
    };

    // Override
    Identifier.prototype.getTerminal = function () {
        return this.__terminal;
    };

    // Override
    Identifier.prototype.getType = function () {
        return this.getAddress().getType();
    };

    // Override
    Identifier.prototype.isBroadcast = function () {
        return this.getAddress().isBroadcast();
    };

    // Override
    Identifier.prototype.isUser = function () {
        return this.getAddress().isUser();
    };

    // Override
    Identifier.prototype.isGroup = function () {
        return this.getAddress().isGroup();
    };

    /**
     *  ID for broadcast
     */
    ID.ANYONE = new Identifier("anyone@anywhere", "anyone", Address.ANYWHERE, null);
    ID.EVERYONE = new Identifier("everyone@everywhere", "everyone", Address.EVERYWHERE, null);
    /**
     *  DIM Founder
     */
    ID.FOUNDER = new Identifier("moky@anywhere", "moky", Address.ANYWHERE, null);

    //-------- namespace --------
    ns.mkm.Identifier = Identifier;

})(MingKeMing);
