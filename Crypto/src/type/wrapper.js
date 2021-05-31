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
//! require 'dictionary.js'

!function (ns) {
    'use strict';

    const str = ns.type.String;
    const Enum = ns.type.Enum;
    const Data = ns.type.Data;
    const Arrays = ns.type.Arrays;
    const Dictionary = ns.type.Dictionary;

    /**
     *  Unwrap keys, values circularly
     *
     * @param {{}} dict
     * @returns {{}}
     */
    const map_unwrap = function (dict) {
        const result = {};
        const keys = Object.keys(dict);
        let name;
        for (let k in keys) {
            if (k instanceof str) {
                name = k.valueOf();
            } else {
                name = k;
            }
            result[name] = unwrap(dict[k], true);
        }
        return result;
    }

    /**
     *  Unwrap items circularly
     *
     * @param {[]} array
     * @returns {[]}
     */
    const list_unwrap = function (array) {
        const result = [];
        for (let item in array) {
            result.push(unwrap(item, true));
        }
        return result;
    }

    /**
     *  Remove Wrapper if exists
     *
     * @param {*} object
     * @param {boolean} circularly
     * @returns {*}
     */
    const unwrap = function (object, circularly) {
        if (!object) {
            return object;
        }
        // check for string
        if (object instanceof str) {
            return object.valueOf();
        } else if (object instanceof String) {
            return object;
        }
        // check for enum/Number
        if (object instanceof Enum) {
            return object.valueOf();
        } else if (object instanceof Number) {
            return object;
        }
        // check for Data/Array
        if (object instanceof Data) {
            return object.getBytes();
        } else if (Arrays.isArray(object)) {
            return object;
        }
        // remove top wrapper
        if (!circularly) {
            if (object instanceof Dictionary) {
                return object.getMap(false);
            }
            return object;
        }
        // remove wrapper circularly
        if (object instanceof Array) {
            return list_unwrap(object);
        }
        if (object instanceof Dictionary) {
            object = object.getMap(false);
        }
        return map_unwrap(object);
    }

    //
    //  Wrapper
    //
    const wrapper = function () {
    };
    ns.Class(wrapper, Object, null);

    wrapper.unwrap = unwrap;

    //-------- namespace --------
    ns.type.Wrapper = wrapper;

    ns.type.register('Wrapper');

}(DIMP);
