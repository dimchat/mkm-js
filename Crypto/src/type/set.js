;
// license: https://mit-license.org
//
//  MONKEY: Memory Object aNd KEYs
//
//                               Written in 2024 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2024 Albert Moky
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

//! require 'class.js'
//! require 'object.js'
//! require 'arrays.js'

(function (ns) {
    'use strict';

    var Interface  = ns.type.Interface;
    var Class      = ns.type.Class;
    var IObject    = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var Arrays     = ns.type.Arrays;

    //
    //  Set Interface
    //
    var Set = Interface(null, [IObject]);

    Set.prototype.isEmpty = function () {};

    /**
     *  Get length of the set
     *
     * @return {int}
     */
    Set.prototype.getLength = function () {};

    /**
     *  Check whether [element] is in the set
     *
     * @param element
     * @return {boolean} false on not found
     */
    Set.prototype.contains = function (element) {};

    /**
     *  Adds [element] to the set
     *
     * @param element
     * @return {boolean} false on duplicated
     */
    Set.prototype.add = function (element) {};

    /**
     *  Removes [element] from the set
     *
     * @param element
     * @return {boolean} false on not found
     */
    Set.prototype.remove = function (element) {};

    /**
     *  Remove all elements from the set
     */
    Set.prototype.clear = function () {};

    /**
     *  Create a new Array with all elements
     *
     * @return {*[]} a copy of inner array
     */
    Set.prototype.toArray = function () {};

    /**
     *  Create Hash Set
     *  ~~~~~~~~~~~~~~~
     */
    var HashSet = function () {
        BaseObject.call(this);
        this.__array = [];
    };
    Class(HashSet, BaseObject, [Set], null);

    // Override
    HashSet.prototype.equals = function (other) {
        if (Interface.conforms(other, Set)) {
            if (this === other) {
                return true;
            }
            other = other.valueOf();
        }
        return Arrays.equals(this.__array, other);
    };

    // Override
    HashSet.prototype.valueOf = function () {
        return this.__array;
    };

    // Override
    HashSet.prototype.toString = function () {
        return this.__array.toString();
    };

    //-------- Set

    // Override
    HashSet.prototype.isEmpty = function () {
        return this.__array.length === 0;
    };

    // Override
    HashSet.prototype.getLength = function() {
        return this.__array.length;
    };

    // Override
    HashSet.prototype.contains = function (item) {
        var pos = Arrays.find(this.__array, item);
        return pos >= 0;
    };

    // Override
    HashSet.prototype.add = function (item) {
        var pos = Arrays.find(this.__array, item);
        if (pos < 0) {
            this.__array.push(item);
            return true;
        } else {
            return false;
        }
    };

    // Override
    HashSet.prototype.remove = function (item) {
        return Arrays.remove(this.__array, item);
    };

    // Override
    HashSet.prototype.clear = function () {
        this.__array = [];
    };

    // Override
    HashSet.prototype.toArray = function () {
        return this.__array.slice();
    };

    //-------- namespace --------
    ns.type.Set = Set;
    ns.type.HashSet = HashSet;

})(MONKEY);
