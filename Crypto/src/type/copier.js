;
// license: https://mit-license.org
//
//  MONKEY: Memory Object aNd KEYs
//
//                               Written in 2022 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2022 Albert Moky
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
     *  Shallow Copy
     *
     * @param {*} object
     */
    var copy = function (object) {
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
            // copy inner map
            return copy_map(object.toMap());
        } else if (!Arrays.isArray(object)) {
            // unwrap as a map
            return copy_map(object);
        } else if (object instanceof Array) {
            // unwrap as a list
            return copy_list(object);
        } else {
            // base array?
            return object;
        }
    };

    var copy_map = function (dict) {
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = dict[key];
        }
        return clone;
    };

    var copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(array[i]);
        }
        return clone;
    };

    /**
     *  Shallow Copy
     *
     * @param {*} object
     */
    var deep_copy = function (object) {
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
            // copy inner map
            return deep_copy_map(object.toMap());
        } else if (!Arrays.isArray(object)) {
            // unwrap as a map
            return deep_copy_map(object);
        } else if (object instanceof Array) {
            // unwrap as a list
            return deep_copy_list(object);
        } else {
            // base array?
            return object;
        }
    };

    var deep_copy_map = function (dict) {
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = deep_copy(dict[key]);
        }
        return clone;
    };

    var deep_copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(deep_copy(array[i]));
        }
        return clone;
    };

    //-------- namespace --------
    ns.type.Copier = {
        // shallow copy
        copy: copy,
        copyMap: copy_map,
        copyList: copy_list,

        // deep copy
        deepCopy: deep_copy,
        deepCopyMap: deep_copy_map,
        deepCopyList: deep_copy_list
    };

})(MONKEY);
