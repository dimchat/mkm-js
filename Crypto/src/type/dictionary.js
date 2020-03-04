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
         * @param {[]} array
         * @param {*} item
         * @returns {[]}
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
         *
         * @param {Uint8Array|[]|{}} array1
         * @param {Uint8Array|[]|{}} array2
         * @returns {boolean}
         */
        equals: function (array1, array2) {
            if (array1 === array2) {
                // same object
                return true;
            }
            if (array1.length !== array2.length) {
                return false;
            }
            var v1, v2;
            for (var k in array1) {
                if (!array1.hasOwnProperty(k)) {
                    continue;
                }
                v1 = array1[k];
                v2 = array2[k];
                if (typeof v1['equals'] === 'function') {
                    if (!v1.equals(v2)) {
                        return false;
                    }
                } else if (typeof v2['equals'] === 'function') {
                    if (!v2.equals(v1)) {
                        return false;
                    }
                } else if (v1 !== v2) {
                    return false;
                }
            }
            return true;
        }
    };

    //
    //  Dictionary
    //

    /**
     *  Create dictionary with values or JSON string
     *
     * @param {{}|map|String} entries
     */
    var map = function (entries) {
        if (!entries) {
            entries = {};
        } else if (entries instanceof map) {
            entries = entries.getMap(false);
        } else if (entries instanceof ns.type.String) {
            entries = ns.format.JSON.decode(entries.toString());
        } else if (typeof entries === 'string') {
            entries = ns.format.JSON.decode(entries);
        }
        ns.type.Object.call(this);
        this.dictionary = entries;
    };
    ns.Class(map, ns.type.Object, null);

    /**
     *  Check whether all entities equal
     *
     * @param {map|{}} other - another map
     * @returns {boolean}
     */
    map.prototype.equals = function (other) {
        if (!other) {
            return !this.dictionary;
        // } else if (ns.type.Object.prototype.equals.call(this, other)) {
        //     return true;
        } else if (other instanceof map) {
            return arrays.equals(this.dictionary, other.getMap(false));
        } else {
            return arrays.equals(this.dictionary, other);
        }
    };

    map.prototype.valueOf = function () {
        return this.dictionary;
    };

    map.prototype.toString = function () {
        return this.dictionary.toString();
    };

    map.prototype.toLocaleString = function () {
        return this.dictionary.toLocaleString();
    };

    map.prototype.toJSON = function () {
        return this.dictionary;
    };

    /**
     *  Get inner dictionary
     *
     * @param {boolean} copy - clone when true
     * @returns {{}}
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
     * @returns {String[]}
     */
    map.prototype.allKeys = function() {
        return Object.keys(this.dictionary);
    };

    /**
     *  Get value for key
     *
     * @param {String} key
     * @returns {*}
     */
    map.prototype.getValue = function (key) {
        return this.dictionary[key];
    };

    /**
     *  Set value for key
     *
     * @param {String} key
     * @param {Object} value
     */
    map.prototype.setValue = function (key, value) {
        if (value) {
            this.dictionary[key] = value;
        } else if (this.dictionary.hasOwnProperty(key)) {
            delete this.dictionary[key];
        }
    };

    /**
     *  Create a map with entities from another object or JSON string
     *
     * @param {{}|map|String} dict
     * @returns {map}
     */
    map.from = function (dict) {
        return new map(dict);
    };

    //-------- namespace --------
    ns.type.Dictionary = map;
    ns.type.Arrays = arrays;

    ns.type.register('Dictionary');
    ns.type.register('Arrays');

}(DIMP);
