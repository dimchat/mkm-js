'use strict';
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
//! require 'object.js'
//! require 'converter.js'
//! require 'copier.js'
//! require 'mapper.js'

/**
 *  Create dictionary with values or JSON string
 *
 * @param {mk.type.Mapper|{}} dict
 */
mk.type.Dictionary = function (dict) {
    BaseObject.call(this);
    if (!dict) {
        dict = {};
    } else if (Interface.conforms(dict, Mapper)) {
        dict = dict.toMap();
    }
    this.__dictionary = dict;
};
var Dictionary = mk.type.Dictionary;

Class(Dictionary, BaseObject, [Mapper]);

Mixin(Dictionary, {

    // Override
    equals: function (other) {
        if (Interface.conforms(other, Mapper)) {
            if (this === other) {
                return true;
            }
            other = other.valueOf();
        }
        return Arrays.equals(this.__dictionary, other);
    },

    // Override
    valueOf: function () {
        return this.__dictionary;
    },

    // Override
    toString: function () {
        return mk.format.JSON.encode(this.__dictionary);
    },

    //-------- Mapper

    // Override
    toMap: function () {
        return this.__dictionary;
    },

    // Override
    copyMap: function (deepCopy) {
        if (deepCopy) {
            return Copier.deepCopyMap(this.__dictionary);
        } else {
            return Copier.copyMap(this.__dictionary);
        }
    },

    // Override
    isEmpty: function () {
        // return Mapper.isEmpty(this.__dictionary);
        var keys = Object.keys(this.__dictionary);
        return keys.length === 0;
    },

    // Override
    getLength: function() {
        // return Mapper.count(this.__dictionary);
        var keys = Object.keys(this.__dictionary);
        return keys.length;
    },

    // Override
    allKeys: function() {
        // return Mapper.keys(this.__dictionary);
        return Object.keys(this.__dictionary);
    },

    // Override
    getValue: function (key) {
        return this.__dictionary[key];
    },

    // Override
    setValue: function (key, value) {
        if (value) {
            this.__dictionary[key] = value;
        } else if (this.__dictionary.hasOwnProperty(key)) {
            delete this.__dictionary[key];
        }
    },

    // Override
    removeValue: function (key) {
        var value;
        if (this.__dictionary.hasOwnProperty(key)) {
            value = this.__dictionary[key];
            delete this.__dictionary[key];
        } else {
            value = null;
        }
        return value;
    },

    // Override
    getString: function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getString(value, defaultValue);
    },

    // Override
    getBoolean: function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getBoolean(value, defaultValue);
    },

    // Override
    getInt: function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getInt(value, defaultValue);
    },

    // Override
    getFloat: function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getFloat(value, defaultValue);
    },

    // Override
    getDateTime: function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getDateTime(value, defaultValue);
    },

    // Override
    setDateTime: function (key, time) {
        if (!time) {
            this.removeValue(key);
        } else if (time instanceof Date) {
            time = time.getTime() / 1000.0;
            this.__dictionary[key] = time;
        } else {
            time = Converter.getFloat(time, 0);
            this.__dictionary[key] = time;
        }
    },

    // Override
    setString: function (key, string) {
        if (!string) {
            this.removeValue(key);
        } else {
            this.__dictionary[key] = string.toString();
        }
    },

    // Override
    setMap: function (key, map) {
        if (!map) {
            this.removeValue(key);
        } else {
            this.__dictionary[key] = map.toMap();
        }
    }

});
