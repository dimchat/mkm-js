;
// license: https://mit-license.org
//
//  MONKEY: Memory Object aNd KEYs
//
//                               Written in 2021 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2021 Albert Moky
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

//! require 'string.js'
//! require 'enum.js'
//! require 'arrays.js'
//! require 'dictionary.js'

(function (ns) {
    'use strict';

    var obj = ns.type.Object;
    var Stringer = ns.type.Stringer;
    var Mapper = ns.type.Mapper;
    // var Enum = ns.type.Enum;

    /**
     *  Get inner String
     *  ~~~~~~~~~~~~~~~~
     *  Remove first wrapper
     *
     * @param {Stringer|String} str
     * @return {String}
     */
    var fetch_string = function (str) {
        if (ns.Interface.conforms(str, Stringer)) {
            return str.toString();
        } else {
            // console.assert(str instanceof String, 'string error: ' + str);
            return str;
        }
    };

    /**
     *  Get inner Map
     *  ~~~~~~~~~~~~~
     *  Remove first wrapper
     *
     * @param {Mapper|{}} dict
     * @return {{}}
     */
    var fetch_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            return dict.toMap();
        } else {
            // console.assert(dict instanceof {}, 'map error: ' + dict);
            return dict;
        }
    };

    /**
     *  Unwrap recursively
     *  ~~~~~~~~~~~~~~~~~~
     *  Remove all wrappers
     *
     * @param {*} object
     * @return {*}
     */
    var unwrap = function (object) {
        if (obj.isNull(object)) {
            // empty
            return null;
        } else if (obj.isBaseType(object)) {
            // return as base type
            return object;
        // } else if (object instanceof Enum) {
        //     // get enum value
        //     return object.valueOf();
        } else if (ns.Interface.conforms(object, Stringer)) {
            // get inner string
            return object.toString();
        // } else if (ns.Interface.conforms(object, Mapper)) {
        //     // unwrap inner map
        //     return unwrap_map(object.toMap());
        } else if (!ns.type.Arrays.isArray(object)) {
            // unwrap as a map
            return unwrap_map(object);
        } else if (object instanceof Array) {
            // unwrap as a list
            return unwrap_list(object);
        } else {
            // base array?
            return object;
        }
    };

    var unwrap_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            dict = dict.toMap();
        }
        var allKeys = Object.keys(dict);
        var key;
        var naked, value;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            // if (key instanceof Stringer) {
            //     key = key.toString();
            // }
            value = dict[key];
            naked = unwrap(value);
            if (naked !== value) {
                dict[key] = naked;
            }
        }
        return dict;
    };

    var unwrap_list = function (array) {
        var naked, item;
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            item = array[i];
            naked = unwrap(item);
            if (naked !== item) {
                array[i] = naked;
            }
        }
        return array;
    };

    //-------- namespace --------
    ns.type.Wrapper = {
        // remove first wrapper
        fetchString: fetch_string,
        fetchMap: fetch_map,

        // remove all wrappers
        unwrap: unwrap,
        unwrapMap: unwrap_map,
        unwrapList: unwrap_list
    };

    ns.type.registers('Wrapper');

})(MONKEY);
