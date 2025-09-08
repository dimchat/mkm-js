'use strict';
// license: https://mit-license.org
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


    /**
     *  Set Interface
     */
    mk.type.Set = Interface(null, [IObject]);
    var Set = mk.type.Set;

    Set.prototype = {

        isEmpty: function () {},

        /**
         *  Get length of the set
         *
         * @return {int}
         */
        getLength: function () {},

        /**
         *  Check whether [element] is in the set
         *
         * @param element
         * @return {boolean} false on not found
         */
        contains: function (element) {},

        /**
         *  Adds [element] to the set
         *
         * @param element
         * @return {boolean} false on duplicated
         */
        add: function (element) {},

        /**
         *  Removes [element] from the set
         *
         * @param element
         * @return {boolean} false on not found
         */
        remove: function (element) {},

        /**
         *  Remove all elements from the set
         */
        clear: function () {},

        /**
         *  Create a new Array with all elements
         *
         * @return {*[]} a copy of inner array
         */
        toArray: function () {}
    };

    /**
     *  Create Hash Set
     *  ~~~~~~~~~~~~~~~
     */
    mk.type.HashSet = function () {
        BaseObject.call(this);
        this.__array = [];
    };
    var HashSet = mk.type.HashSet;

    Class(HashSet, BaseObject, [Set]);

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
