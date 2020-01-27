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

!function (ns) {

    var Address = ns.Address;

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
    var ID = function (name, address, terminal) {
        var string;
        if (name instanceof ID) {
            // new ID(id)
            string = name.toString();
            address = name.address;
            terminal = name.terminal;
            name = name.name;
        } else if (!address) {
            // new ID('name@address')
            string = name;
            // split ID string
            var pair = string.split('/');
            // terminal
            if (pair.length === 1) {
                // no terminal
                terminal = null;
            } else {
                // got terminal
                terminal = pair[1];
            }
            // name @ address
            pair = pair[0].split('@');
            if (pair.length === 1) {
                // got address without name
                name = null;
                address = Address.getInstance(pair[0]);
            } else {
                name = pair[0];
                address = Address.getInstance(pair[1]);
            }
        } else {
            address = Address.getInstance(address);
            string = address.toString();
            if (name && name.length > 0) {
                string = name + '@' + string;
            }
            if (terminal && terminal.length > 0) {
                string = string + '/' + terminal;
            }
        }
        ns.type.String.call(this, string);
        this.name = name;
        this.address = address;
        this.terminal = terminal;
    };
    ID.inherits(ns.type.String);

    ID.prototype.equals = function (other) {
        if (!other) {
            return false;
        } else if (ns.type.String.prototype.equals.call(this, other)) {
            return true;
        } else if (other instanceof ID) {
            // check address
            if (!this.address.equals(other.address)) {
                return false;
            }
            // check name
            if (!this.name) {
                return !other.name;
            } else {
                return this.name === other.name;
            }
        }
        // comparing without terminal
        var pair = other.split('/');
        if (!this.terminal) {
            return pair[0] === this.value;
        } else {
            return pair[0] === this.value.split('/')[0];
        }
    };

    /**
     *  Get Network ID
     *
     * @returns {NetworkType}
     */
    ID.prototype.getType = function () {
        return this.address.getNetwork();
    };

    /**
     *  Get Search Number
     *
     * @returns {number}
     */
    ID.prototype.getNumber = function () {
        return this.address.getCode();
    };

    /**
     *  Get whether ID string is valid
     *
     * @returns {boolean}
     */
    ID.prototype.isValid = function () {
        return this.getNumber() > 0;
    };

    ID.prototype.isBroadcast = function () {
        return this.address.isBroadcast();
    };

    /**
     *  ID for broadcast
     */
    ID.ANYONE = new ID('anyone', Address.ANYWHERE);
    ID.EVERYONE = new ID('everyone', Address.EVERYWHERE);

    //-------- runtime --------

    /**
     *  Create/get instance of ID
     *
     * @param string
     * @returns {null|ID}
     */
    ID.getInstance = function (string) {
        if (!string) {
            return null;
        } else if (string instanceof ID) {
            return string;
        }
        return new ID(string);
    };

    //-------- namespace --------
    ns.ID = ID;

}(DIMP);
