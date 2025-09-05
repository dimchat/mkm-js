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

//! require 'protocol/identifier.js'

//! require 'broadcast.js'


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
mkm.mkm.Identifier = function (identifier, name, address, terminal) {
    ConstantString.call(this, identifier);
    this.__name = name;
    this.__address = address;
    this.__terminal = terminal;
};
var Identifier = mkm.mkm.Identifier;

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
        var address = this.__address;
        return address.getType();
    };

    // Override
    Identifier.prototype.isBroadcast = function () {
        var network = this.getType();
        return EntityType.isBroadcast(network);
    };

    // Override
    Identifier.prototype.isUser = function () {
        var network = this.getType();
        return EntityType.isUser(network);
    };

    // Override
    Identifier.prototype.isGroup = function () {
        var network = this.getType();
        return EntityType.isGroup(network);
    };

    //
    //  Factory
    //

    Identifier.create = function (name, address, terminal) {
        var string = Identifier.concat(name, address, terminal);
        return new Identifier(string, name, address, terminal);
    };

    /**
     *  Concat ID with components
     *
     * @param {String} name
     * @param {Address} address
     * @param {String} terminal
     * @return {string}
     */
    Identifier.concat = function (name, address, terminal) {
        var string = address.toString();
        if (name && name.length > 0) {
            string = name + '@' + string;
        }
        if (terminal && terminal.length > 0) {
            string = string + '/' + terminal;
        }
        return string;
    };

    /**
     *  ID for Broadcast
     *  ~~~~~~~~~~~~~~~~
     */
    ID.ANYONE   = Identifier.create("anyone", Address.ANYWHERE, null);
    ID.EVERYONE = Identifier.create("everyone", Address.EVERYWHERE, null);
    // DIM Founder
    ID.FOUNDER  = Identifier.create("moky", Address.ANYWHERE, null);
