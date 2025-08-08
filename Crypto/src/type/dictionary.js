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
//! require 'object.js'
//! require 'converter.js'
//! require 'copier.js'

/**
 *  Map Interface
 */
mk.type.Mapper = Interface(null, [IObject]);
var Mapper = mk.type.Mapper;

Mapper.prototype = {

    /**
     *  Get inner map
     *
     * @return {{}} built-in map
     */
    toMap: function () {},

    /**
     *  Clone inner map
     *
     * @param {boolean} deepCopy
     * @return {{}} copied built-in map
     */
    copyMap: function (deepCopy) {},

    isEmpty: function () {},

    /**
     *  Get length of inner map
     *
     * @return {number}
     */
    getLength: function () {},

    /**
     *  Get all keys in map
     *
     * @return {string[]}
     */
    allKeys: function() {},

    /**
     *  Get value for key
     *
     * @param {string} key
     * @return {*}
     */
    getValue: function (key) {},

    /**
     *  Set value for key
     *
     * @param {string} key
     * @param {*} value
     */
    setValue: function (key, value) {},

    /**
     *  Remove value for key
     *
     * @param {string} key
     * @return {*} removed value
     */
    removeValue: function (key) {},

    /**
     *  Get string value for key
     *
     * @param {string} key
     * @param {String} defaultValue
     * @return {String}
     */
    getString: function (key, defaultValue) {},

    /**
     *  Get boolean value for key
     *
     * @param {string} key
     * @param {boolean} defaultValue
     * @return {boolean}
     */
    getBoolean: function (key, defaultValue) {},

    /**
     *  Get int number value for key
     *
     * @param {string} key
     * @param {Number} defaultValue
     * @return {Number}
     */
    getInt: function (key, defaultValue) {},

    /**
     *  Get float number value for key
     *
     * @param {string} key
     * @param {Number} defaultValue
     * @return {Number}
     */
    getFloat: function (key, defaultValue) {},

    /**
     *  Get date time for key
     *
     * @param {string} key
     * @param {Date} defaultValue
     * @return {Date}
     */
    getDateTime: function (key, defaultValue) {},

    /**
     *  Set date time for key
     *
     * @param {string} key
     * @param {Date} time
     */
    setDateTime: function (key, time) {},

    /**
     *  Set string value for key
     *
     * @param {string} key
     * @param {mk.type.Stringer} stringer
     */
    setString: function (key, stringer) {},

    /**
     *  Set dictionary value for key
     *
     * @param {string} key
     * @param {mk.type.Mapper} mapper
     */
    setMap: function (key, mapper) {}

};

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

Class(Dictionary, BaseObject, [Mapper], {

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
        var keys = Object.keys(this.__dictionary);
        return keys.length === 0;
    },

    // Override
    getLength: function() {
        var keys = Object.keys(this.__dictionary);
        return keys.length;
    },

    // Override
    allKeys: function() {
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
