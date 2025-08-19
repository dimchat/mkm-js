'use strict';
// license: https://mit-license.org
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

mk.type.Wrapper = {

    /**
     *  Remove first wrapper
     */
    fetchString: function (str) {
        if (Interface.conforms(str, Stringer)) {
            return str.toString();
        } else if (typeof str === 'string') {
            // assert(str instanceof String, 'string error: ' + str);
            return str;
        } else {
            // error
            return null;
        }
    },

    fetchMap: function (dict) {
        if (Interface.conforms(dict, Mapper)) {
            return dict.toMap();
        } else if (typeof dict === 'object') {
            // assert(dict instanceof {}, 'map error: ' + dict);
            return dict;
        } else {
            // error
            return null;
        }
    },

    /**
     *  Remove all wrappers (recursively)
     */
    unwrap: function (object) {
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
            return this.unwrapMap(object.toMap());
        } else if (!Arrays.isArray(object)) {
            // unwrap as a map
            return this.unwrapMap(object);
        } else if (object instanceof Array) {
            // unwrap as a list
            return this.unwrapList(object);
        } else {
            // base array?
            return object;
        }
    },

    unwrapMap: function (dict) {
        var result = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            // if (key instanceof Stringer) {
            //     key = key.toString();
            // }
            result[key] = this.unwrap(dict[key]);
        }
        return result;
    },

    unwrapList: function (array) {
        var result = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            result[i] = this.unwrap(array[i]);
        }
        return result;
    }
};
var Wrapper = mk.type.Wrapper;
