;
// license: https://mit-license.org
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

//! require 'class.js'
//! require 'parser.js'

!function (ns) {
    'use strict';

    //
    //  Array
    //
    var arrays = {
        /**
         *  Remove the item from array
         *
         * @param array
         * @param item
         * @returns {*[]}
         */
        remove: function (array, item) {
            var index = array.indexOf(item);
            if (index < 0) {
                return null;
            }
            return array.splice(index, 1);
        },

        /**
         *  Check whether the two arrays are equal
         * @param a1
         * @param a2
         * @returns {boolean}
         */
        equals: function (a1, a2) {
            if (a1 === a2) {
                // same object
                return true;
            }
            if (a1.length !== a2.length) {
                return false;
            }
            for (var k in a1) {
                // noinspection JSUnfilteredForInLoop
                if (a1[k] !== a2[k]) {
                    return false;
                }
            }
            return true;
        }
    };

    //
    //  Dictionary
    //
    var map = function (value) {
        if (!value) {
            value = {};
        } else if (value instanceof map) {
            value = value.dictionary;
        } else if (value instanceof ns.type.String) {
            value = ns.format.JSON.decode(value.toString());
        } else if (typeof value === 'string') {
            value = ns.format.JSON.decode(value);
        }
        ns.type.Object.call(this);
        this.dictionary = value;
    };
    ns.type.Class(map, ns.type.Object);

    map.prototype.equals = function (other) {
        if (!other) {
            return !this.dictionary;
        } else if (other instanceof map) {
            return arrays.equals(this.dictionary, other.dictionary);
        } else {
            return arrays.equals(this.dictionary, other);
        }
    };

    // noinspection JSUnusedGlobalSymbols
    map.prototype.valueOf = function () {
        return this.dictionary;
    };

    map.prototype.toString = function () {
        return this.dictionary.toString();
    };

    map.prototype.toLocaleString = function () {
        return this.dictionary.toLocaleString();
    };

    // noinspection JSUnusedGlobalSymbols
    map.prototype.toJSON = function () {
        return this.dictionary;
    };

    /**
     *  Get inner dictionary
     *
     * @param copy - clone when true
     * @returns {map}
     */
    map.prototype.getMap = function (copy) {
        if (copy) {
            var json = ns.format.JSON.encode(this.dictionary);
            return ns.format.JSON.decode(json);
        } else {
            return this.dictionary;
        }
    };

    /**
     *  Get all keys in dictionary
     *
     * @returns {string[]}
     */
    map.prototype.allKeys = function() {
        return Object.keys(this.dictionary);
    };

    /**
     *  Get value for key
     *
     * @param key
     * @returns {*}
     */
    map.prototype.getValue = function (key) {
        return this.dictionary[key];
    };

    /**
     *  Set value for key
     *
     * @param key
     * @param value
     */
    map.prototype.setValue = function (key, value) {
        if (value) {
            this.dictionary[key] = value;
        } else if (this.dictionary.hasOwnProperty(key)) {
            delete this.dictionary[key];
        }
    };

    //-------- namespace --------
    ns.type.Dictionary = map;
    ns.type.Arrays = arrays;

    ns.type.register('Dictionary');
    ns.type.register('Arrays');

}(DIMP);