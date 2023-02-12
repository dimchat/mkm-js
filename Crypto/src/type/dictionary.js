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

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;

    var arrays_equals = function (a1, a2) {
        return ns.type.Arrays.equals(a1, a2);
    };

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
    Mapper.prototype.toMap = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Clone inner map
     *
     * @param {boolean} deepCopy
     * @return {{}} copied built-in map
     */
    Mapper.prototype.copyMap = function (deepCopy) {
        throw new Error('NotImplemented');
    };

    /**
     *  Get all keys in map
     *
     * @return {string[]}
     */
    Mapper.prototype.allKeys = function() {
        throw new Error('NotImplemented');
    };

    /**
     *  Get value for key
     *
     * @param {string} key
     * @return {*}
     */
    Mapper.prototype.getValue = function (key) {
        throw new Error('NotImplemented');
    };

    /**
     *  Set value for key
     *
     * @param {string} key
     * @param {*} value
     */
    Mapper.prototype.setValue = function (key, value) {
        throw new Error('NotImplemented');
    };

    /**
     *  Remove value for key
     *
     * @param {string} key
     * @return {*} removed value
     */
    Mapper.prototype.removeValue = function (key) {
        throw new Error('NotImplemented');
    };

    /**
     *  Get string value for key
     *
     * @param {string} key
     * @return {string}
     */
    Mapper.prototype.getString = function (key) {
        throw new Error('NotImplemented');
    };

    /**
     *  Get boolean value for key
     *
     * @param {string} key
     * @return {boolean}
     */
    Mapper.prototype.getBoolean = function (key) {
        throw new Error('NotImplemented');
    };

    /**
     *  Get number value for key
     *
     * @param {string} key
     * @return {number}
     */
    Mapper.prototype.getNumber = function (key) {
        throw new Error('NotImplemented');
    };

    /**
     *  Get date time for key
     *
     * @param {string} key
     * @return {Date}
     */
    Mapper.prototype.getTime = function (key) {
        throw new Error('NotImplemented');
    };

    /**
     *  Set date time for key
     *
     * @param {string} key
     * @param {Date} time
     */
    Mapper.prototype.setTime = function (key, time) {
        throw new Error('NotImplemented');
    };

    /**
     *  Set string value for key
     *
     * @param {string} key
     * @param {Stringer} stringer
     */
    Mapper.prototype.setString = function (key, stringer) {
        throw new Error('NotImplemented');
    };

    /**
     *  Set dictionary value for key
     *
     * @param {string} key
     * @param {Mapper} mapper
     */
    Mapper.prototype.setMap = function (key, mapper) {
        throw new Error('NotImplemented');
    };

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
        if (this === other) {
            return true;
        } else if (!other) {
            return !this.__dictionary;
        } else if (Interface.conforms(other, Mapper)) {
            return arrays_equals(this.__dictionary, other.toMap());
        } else {
            return arrays_equals(this.__dictionary, other);
        }
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
    Dictionary.prototype.getString = function (key) {
        return this.__dictionary[key];
    };

    // Override
    Dictionary.prototype.getBoolean = function (key) {
        var value = this.__dictionary[key];
        return value === null ? 0 : value.valueOf();
    };

    // Override
    Dictionary.prototype.getNumber = function (key) {
        var value = this.__dictionary[key];
        return value === null ? 0 : value.valueOf();
    };

    // Override
    Dictionary.prototype.getTime = function (key) {
        var seconds = this.getNumber(key);
        if (seconds <= 0) {
            return null;
        }
        var millis = seconds * 1000;
        return new Date(millis);
    };

    // Override
    Dictionary.prototype.setTime = function (key, time) {
        if (time instanceof Date) {
            time = time.getTime() / 1000.0;
        }
        this.setValue(key, time);
    };

    // Override
    Dictionary.prototype.setString = function (key, string) {
        if (string/* instanceof Stringer*/) {
            string = string.toString();
        }
        this.setValue(key, string)
    };

    // Override
    Dictionary.prototype.setMap = function (key, map) {
        if (map/* instanceof Mapper*/) {
            map = map.toMap();
        }
        this.setValue(key, map)
    };

    //-------- namespace --------
    ns.type.Mapper = Mapper;
    ns.type.Dictionary = Dictionary;

})(MONKEY);
