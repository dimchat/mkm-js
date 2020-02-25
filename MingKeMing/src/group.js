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

!function (ns) {
    'use strict';

    var Entity = ns.Entity;

    var Group = function (identifier) {
        Entity.call(this, identifier);
        this.founder = null;
    };
    ns.Class(Group, Entity, null);

    /**
     *  Get founder of this group
     *
     * @returns {ID}
     */
    Group.prototype.getFounder = function () {
        if (!this.founder) {
            this.founder = this.delegate.getFounder(this.identifier);
        }
        return this.founder;
    };

    /**
     *  Get owner of this group
     *
     * @returns {ID}
     */
    Group.prototype.getOwner = function () {
        return this.delegate.getOwner(this.identifier);
    };

    /**
     *  Get members in this group
     *
     * @returns {ID[]}
     */
    Group.prototype.getMembers = function () {
        return this.delegate.getMembers(this.identifier);
    };

    //-------- namespace --------
    ns.Group = Group;

    ns.register('Group');

}(MingKeMing);
