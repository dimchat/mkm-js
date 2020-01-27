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

//! require 'identifier.js'
//! require 'meta.js'
//! require 'profile.js'

!function (ns) {

    var Delegate = function () {
    };

    /**
     *  Get meta for entity ID
     *
     * @param identifier
     * @returns {Meta}
     */
    Delegate.prototype.getMeta = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get profile for entity ID
     *
     * @param identifier
     * @returns {Profile}
     */
    Delegate.prototype.getProfile = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Entity (User/Group)
     *  ~~~~~~~~~~~~~~~~~~~
     *  Base class of User and Group, ...
     *
     *  properties:
     *      identifier - entity ID
     *      type       - entity type
     *      number     - search number
     *      meta       - meta for generate ID
     *      profile    - entity profile
     *      name       - nickname
     */
    var Entity = function (identifier) {
        this.identifier = identifier;
        this.delegate = null;
    };

    Entity.prototype.equals = function (other) {
        if (this === other) {
            return true;
        } else if (other instanceof Entity) {
            // check with ID
            return this.identifier.equals(other.identifier);
        } else {
            // null or unknown object
            return false;
        }
    };

    Entity.prototype.toString = function () {
        var clazz = Object.getPrototypeOf(this).constructor;
        return '<' + clazz.name
            + '|' + this.getType()
            + ' ' + this.identifier
            + ' (' + this.getNumber() + ')'
            + ' "' + this.getName() + '">';
    };

    /**
     *  Get entity type
     *
     * @returns {NetworkType}
     */
    Entity.prototype.getType = function () {
        return this.identifier.getType();
    };

    /**
     *  Get Search Number
     *
     * @returns {number}
     */
    Entity.prototype.getNumber = function () {
        return this.identifier.getNumber();
    };

    Entity.prototype.getName = function () {
        // get from profile
        var profile = this.getProfile();
        if (profile) {
            var name = profile.getName();
            if (name) {
                return name;
            }
        }
        // get ID.name
        return this.identifier.name;
    };

    Entity.prototype.getMeta = function () {
        return this.delegate.getMeta(this.identifier);
    };

    Entity.prototype.getProfile = function () {
        return this.delegate.getProfile(this.identifier);
    };

    //-------- namespace --------
    ns.EntityDataSource = Delegate;
    ns.Entity = Entity;

}(DIMP);
