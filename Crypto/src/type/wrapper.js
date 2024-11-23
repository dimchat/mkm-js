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

//! require 'class.js'
//! require 'object.js'
//! require 'enum.js'
//! require 'string.js'
//! require 'arrays.js'
//! require 'dictionary.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var Enum = ns.type.Enum;
    var Stringer = ns.type.Stringer;
    var Arrays = ns.type.Arrays;
    var Mapper = ns.type.Mapper;

    /**
     *  Get inner String
     *  ~~~~~~~~~~~~~~~~
     *  Remove first wrapper
     *
     * @param {Stringer|String} str
     * @return {String}
     */
    var fetch_string = function (str) {
        if (Interface.conforms(str, Stringer)) {
            return str.toString();
        } else {
            // assert(str instanceof String, 'string error: ' + str);
            return str;
        }
    };

    /**
     *  Get inner Map
     *  ~~~~~~~~~~~~~
     *  Remove first wrapper
     *
     * @param {*} dict
     * @return {{}}
     */
    var fetch_map = function (dict) {
        if (Interface.conforms(dict, Mapper)) {
            return dict.toMap();
        } else {
            // assert(dict instanceof {}, 'map error: ' + dict);
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
        if (IObject.isNull(object)) {
            // empty
            return null;
        } else if (IObject.isBaseType(object)) {
            // return as base type
            return object;
        } else if (Enum.isEnum(object)) {
            // get enum value
            return object.getValue();
        } else if (Interface.conforms(object, Stringer)) {
            // get inner string
            return object.toString();
        } else if (Interface.conforms(object, Mapper)) {
            // unwrap inner map
            return unwrap_map(object.toMap());
        } else if (!Arrays.isArray(object)) {
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
        var result = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            // if (key instanceof Stringer) {
            //     key = key.toString();
            // }
            result[key] = unwrap(dict[key]);
        }
        return result;
    };

    var unwrap_list = function (array) {
        var result = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            result[i] = unwrap(array[i]);
        }
        return result;
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

})(MONKEY);
