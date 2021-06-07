;
// license: https://mit-license.org
//
//  MONKEY: Memory Object aNd KEYs
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

//! require 'arrays.js'

(function (ns) {
    'use strict';

    var map = function () {
    };
    ns.Interface(map, null);

    /**
     *  Get inner map
     *
     * @return {Map} built-in map
     */
    map.prototype.getMap = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Clone inner map
     *
     * @return {Map} copied built-in map
     */
    map.prototype.copyMap = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    map.copyMap = function (dictionary) {
        if (ns.Interface.conforms(dictionary, map)) {
            dictionary = dictionary.getMap();
        }
        var json = ns.format.JSON.encode(dictionary);
        return ns.format.JSON.decode(json);
    };

    /**
     *  Check whether all entities equal
     *
     * @param {map|{}} other - another map
     * @return {boolean}
     */
    map.prototype.equals = function (other) {
        console.assert(false, 'implement me!');
        return false;
    };

    /**
     *  Get all keys in dictionary
     *
     * @return {String[]}
     */
    map.prototype.allKeys = function() {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get value for key
     *
     * @param {String} key
     * @return {*}
     */
    map.prototype.getValue = function (key) {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Set value for key
     *
     * @param {String} key
     * @param {Object} value
     */
    map.prototype.setValue = function (key, value) {
        console.assert(false, 'implement me!');
    };

    //-------- namespace --------
    ns.type.Map = map;

    ns.type.register('Map');

})(MONKEY);

(function (ns) {
    'use strict';

    var Arrays = ns.type.Arrays;
    var map = ns.type.Map;

    //
    //  Dictionary
    //

    /**
     *  Create dictionary with values or JSON string
     *
     * @param {{}|map} dictionary
     */
    var dict = function (dictionary) {
        if (!dictionary) {
            dictionary = {};
        } else if (ns.Interface.conforms(dictionary, map)) {
            dictionary = dictionary.getMap();
        }
        ns.type.Object.call(this);
        this.__dictionary = dictionary;
    };
    ns.Class(dict, ns.type.Object, [map]);

    dict.prototype.getMap = function () {
        return this.__dictionary;
    };
    dict.prototype.copyMap = function () {
        return map.copyMap(this.__dictionary);
    };

    dict.prototype.valueOf = function () {
        return this.__dictionary;
    };

    dict.prototype.equals = function (other) {
        if (!other) {
            return !this.__dictionary;
        } else if (ns.Interface.conforms(other, map)) {
            return Arrays.equals(this.__dictionary, other.getMap());
        } else {
            return Arrays.equals(this.__dictionary, other);
        }
    };

    dict.prototype.allKeys = function() {
        return Object.keys(this.__dictionary);
    };

    dict.prototype.getValue = function (key) {
        return this.__dictionary[key];
    };

    dict.prototype.setValue = function (key, value) {
        if (value) {
            this.__dictionary[key] = value;
        } else if (this.__dictionary.hasOwnProperty(key)) {
            delete this.__dictionary[key];
        }
    };

    //-------- namespace --------
    ns.type.Dictionary = dict;

    ns.type.register('Dictionary');

})(MONKEY);
