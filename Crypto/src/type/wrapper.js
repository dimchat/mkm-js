;
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

//! require 'string.js'
//! require 'enum.js'
//! require 'data.js'
//! require 'arrays.js'
//! require 'dictionary.js'

(function (ns) {
    'use strict';

    var obj = ns.type.Object;
    var str = ns.type.String;
    var map = ns.type.Map;
    var Enum = ns.type.Enum;
    var Data = ns.type.Data;
    var Arrays = ns.type.Arrays;

    /**
     *  Unwrap keys, values circularly
     *
     * @param {{}} dict
     * @return {{}}
     */
    var map_unwrap = function (dict) {
        var result = {};
        var keys = Object.keys(dict);
        var key;
        for (var i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key instanceof str) {
                key = key.toString();
            }
            result[key] = unwrap(dict[key], true);
        }
        return result;
    };

    /**
     *  Unwrap items circularly
     *
     * @param {[]} array
     * @return {[]}
     */
    var list_unwrap = function (array) {
        var result = [];
        var item;
        for (var i = 0; i < array.length; ++i) {
            item = array[i];
            if (item) {
                item = unwrap(item, true);
                if (item) {
                    result[i] = item;
                }
            }
        }
        return result;
    };

    /**
     *  Remove Wrapper if exists
     *
     * @param {*} object
     * @param {boolean} circularly
     * @return {*}
     */
    var unwrap = function (object, circularly) {
        if (obj.isNull(object)) {
            return null;
        } else if (obj.isBaseType(object)) {
            return object;
        }
        // check for string
        if (object instanceof str) {
            return object.toString();
        }
        // check for enum
        if (object instanceof Enum) {
            return object.valueOf();
        }
        // check for Data
        if (object instanceof Data) {
            return object.getBytes();
        }
        // unwrap container
        if (circularly) {
            if (Arrays.isArray(object)) {
                if (object instanceof Array) {
                    return list_unwrap(object);
                }
            } else {
                if (ns.Interface.conforms(object, map)) {
                    object = object.getMap();
                }
                return map_unwrap(object);
            }
        } else if (ns.Interface.conforms(object, map)) {
            object = object.getMap();
        }
        return object;
    };

    //
    //  Wrapper
    //
    var wrapper = function () {
    };
    ns.Interface(wrapper, null);

    wrapper.unwrap = unwrap;

    //-------- namespace --------
    ns.type.Wrapper = wrapper;

    ns.type.register('Wrapper');

})(DIMP);
