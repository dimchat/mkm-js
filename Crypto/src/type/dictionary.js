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

//! require 'class.js'
//! require 'object.js'
//! require 'converter.js'
//! require 'copier.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var Converter = ns.type.Converter;

    var copy_map = function (map, deep) {
        if (deep) {
            return ns.type.Copier.deepCopyMap(map);
        } else {
            return ns.type.Copier.copyMap(map);
        }
    };

    var json_encode = function (dict) {
        return ns.format.JSON.encode(dict);
    };

    //
    //  Map Interface
    //
    var Mapper = Interface(null, [IObject]);

    /**
     *  Get inner map
     *
     * @return {{}} built-in map
     */
    Mapper.prototype.toMap = function () {};

    /**
     *  Clone inner map
     *
     * @param {boolean} deepCopy
     * @return {{}} copied built-in map
     */
    Mapper.prototype.copyMap = function (deepCopy) {};

    Mapper.prototype.isEmpty = function () {};

    /**
     *  Get length of inner map
     *
     * @return {number}
     */
    Mapper.prototype.getLength = function () {};

    /**
     *  Get all keys in map
     *
     * @return {string[]}
     */
    Mapper.prototype.allKeys = function() {};

    /**
     *  Get value for key
     *
     * @param {string} key
     * @return {*}
     */
    Mapper.prototype.getValue = function (key) {};

    /**
     *  Set value for key
     *
     * @param {string} key
     * @param {*} value
     */
    Mapper.prototype.setValue = function (key, value) {};

    /**
     *  Remove value for key
     *
     * @param {string} key
     * @return {*} removed value
     */
    Mapper.prototype.removeValue = function (key) {};

    /**
     *  Get string value for key
     *
     * @param {string} key
     * @param {String} defaultValue
     * @return {String}
     */
    Mapper.prototype.getString = function (key, defaultValue) {};

    /**
     *  Get boolean value for key
     *
     * @param {string} key
     * @param {boolean} defaultValue
     * @return {boolean}
     */
    Mapper.prototype.getBoolean = function (key, defaultValue) {};

    /**
     *  Get int number value for key
     *
     * @param {string} key
     * @param {Number} defaultValue
     * @return {Number}
     */
    Mapper.prototype.getInt = function (key, defaultValue) {};

    /**
     *  Get float number value for key
     *
     * @param {string} key
     * @param {Number} defaultValue
     * @return {Number}
     */
    Mapper.prototype.getFloat = function (key, defaultValue) {};

    /**
     *  Get date time for key
     *
     * @param {string} key
     * @param {Date} defaultValue
     * @return {Date}
     */
    Mapper.prototype.getDateTime = function (key, defaultValue) {};

    /**
     *  Set date time for key
     *
     * @param {string} key
     * @param {Date} time
     */
    Mapper.prototype.setDateTime = function (key, time) {};

    /**
     *  Set string value for key
     *
     * @param {string} key
     * @param {Stringer} stringer
     */
    Mapper.prototype.setString = function (key, stringer) {};

    /**
     *  Set dictionary value for key
     *
     * @param {string} key
     * @param {Mapper} mapper
     */
    Mapper.prototype.setMap = function (key, mapper) {};

    /**
     *  Create dictionary with values or JSON string
     *
     * @param {Mapper|{}} dict
     */
    var Dictionary = function (dict) {
        BaseObject.call(this);
        if (!dict) {
            dict = {};
        } else if (Interface.conforms(dict, Mapper)) {
            dict = dict.toMap();
        }
        this.__dictionary = dict;
    };
    Class(Dictionary, BaseObject, [Mapper], null);

    // Override
    Dictionary.prototype.equals = function (other) {
        if (Interface.conforms(other, Mapper)) {
            if (this === other) {
                return true;
            }
            other = other.valueOf();
        }
        return ns.type.Arrays.equals(this.__dictionary, other);
    };

    // Override
    Dictionary.prototype.valueOf = function () {
        return this.__dictionary;
    };

    // Override
    Dictionary.prototype.toString = function () {
        return json_encode(this.__dictionary);
    };

    //-------- Mapper

    // Override
    Dictionary.prototype.toMap = function () {
        return this.__dictionary;
    };

    // Override
    Dictionary.prototype.copyMap = function (deepCopy) {
        return copy_map(this.__dictionary, deepCopy);
    };

    // Override
    Dictionary.prototype.isEmpty = function () {
        var keys = Object.keys(this.__dictionary);
        return keys.length === 0;
    };

    // Override
    Dictionary.prototype.getLength = function() {
        var keys = Object.keys(this.__dictionary);
        return keys.length;
    };

    // Override
    Dictionary.prototype.allKeys = function() {
        return Object.keys(this.__dictionary);
    };

    // Override
    Dictionary.prototype.getValue = function (key) {
        return this.__dictionary[key];
    };

    // Override
    Dictionary.prototype.setValue = function (key, value) {
        if (value) {
            this.__dictionary[key] = value;
        } else if (this.__dictionary.hasOwnProperty(key)) {
            delete this.__dictionary[key];
        }
    };

    // Override
    Dictionary.prototype.removeValue = function (key) {
        var value;
        if (this.__dictionary.hasOwnProperty(key)) {
            value = this.__dictionary[key];
            delete this.__dictionary[key];
        } else {
            value = null;
        }
        return value;
    };

    // Override
    Dictionary.prototype.getString = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getString(value, defaultValue);
    };

    // Override
    Dictionary.prototype.getBoolean = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getBoolean(value, defaultValue);
    };

    // Override
    Dictionary.prototype.getInt = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getInt(value, defaultValue);
    };

    // Override
    Dictionary.prototype.getFloat = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getFloat(value, defaultValue);
    };

    // Override
    Dictionary.prototype.getDateTime = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getDateTime(value, defaultValue);
    };

    // Override
    Dictionary.prototype.setDateTime = function (key, time) {
        if (!time) {
            this.removeValue(key);
        } else if (time instanceof Date) {
            time = time.getTime() / 1000.0;
            this.__dictionary[key] = time;
        } else {
            time = Converter.getFloat(time, 0);
            this.__dictionary[key] = time;
        }
    };

    // Override
    Dictionary.prototype.setString = function (key, string) {
        if (!string) {
            this.removeValue(key);
        } else {
            this.__dictionary[key] = string.toString();
        }
    };

    // Override
    Dictionary.prototype.setMap = function (key, map) {
        if (!map) {
            this.removeValue(key);
        } else {
            this.__dictionary[key] = map.toMap();
        }
    };

    //-------- namespace --------
    ns.type.Mapper = Mapper;
    ns.type.Dictionary = Dictionary;

})(MONKEY);
