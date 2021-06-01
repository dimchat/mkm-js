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

//! require 'arrays.js'

(function (ns) {
    'use strict';

    var Arrays = ns.type.Arrays;

    //
    //  Dictionary
    //

    /**
     *  Create dictionary with values or JSON string
     *
     * @param {{}|map|String|} entries
     */
    var map = function (entries) {
        if (!entries) {
            entries = {};
        } else if (entries instanceof map) {
            entries = entries.getMap();
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
     * @return {boolean}
     */
    map.prototype.equals = function (other) {
        if (!other) {
            return !this.dictionary;
        } else if (other instanceof map) {
            return Arrays.equals(this.dictionary, other.getMap());
        } else {
            return Arrays.equals(this.dictionary, other);
        }
    };

    map.prototype.valueOf = function () {
        return this.dictionary;
    };

    map.prototype.toString = function () {
        return this.dictionary.toString();
    };

    /**
     *  Get inner dictionary
     */
    map.prototype.getMap = function () {
        return this.dictionary;
    };
    map.prototype.copyMap = function () {
        var json = ns.format.JSON.encode(this.dictionary);
        return ns.format.JSON.decode(json);
    };

    /**
     *  Get all keys in dictionary
     *
     * @return {String[]}
     */
    map.prototype.allKeys = function() {
        return Object.keys(this.dictionary);
    };

    /**
     *  Get value for key
     *
     * @param {String} key
     * @return {*}
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
     * @return {map}
     */
    map.from = function (dict) {
        return new map(dict);
    };

    //-------- namespace --------
    ns.type.Dictionary = map;

    ns.type.register('Dictionary');

})(DIMP);
