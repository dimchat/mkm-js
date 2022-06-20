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

//! require 'arrays.js'

(function (ns) {
    'use strict';

    //
    //  Map Interface
    //
    var Mapper = function () {};
    ns.Interface(Mapper, [ns.type.Object]);

    /**
     *  Get value for key
     *
     * @param {String} key
     * @return {*}
     */
    Mapper.prototype.getValue = function (key) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Set value for key
     *
     * @param {String} key
     * @param {*} value
     */
    Mapper.prototype.setValue = function (key, value) {
        ns.assert(false, 'implement me!');
    };

    /**
     *  Remove value for key
     *
     * @param {String} key
     * @return {*} removed value
     */
    Mapper.prototype.removeValue = function (key) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get all keys in map
     *
     * @return {String[]}
     */
    Mapper.prototype.allKeys = function() {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get inner map
     *
     * @return {{}} built-in map
     */
    Mapper.prototype.toMap = function () {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Clone inner map
     *
     * @param {boolean} deepCopy
     * @return {{}} copied built-in map
     */
    Mapper.prototype.copyMap = function (deepCopy) {
        ns.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.type.Mapper = Mapper;

    ns.type.registers('Mapper');

})(MONKEY);

(function (ns) {
    'use strict';

    var BaseObject = ns.type.BaseObject;
    var Mapper = ns.type.Mapper;

    /**
     *  Create dictionary with values or JSON string
     *
     * @param {Mapper|{}} dict
     */
    var Dictionary = function (dict) {
        BaseObject.call(this);
        if (!dict) {
            dict = {};
        } else if (ns.Interface.conforms(dict, Mapper)) {
            dict = dict.toMap();
        }
        this.__dictionary = dict;
    };
    ns.Class(Dictionary, BaseObject, [Mapper], null);

    // Override
    Dictionary.prototype.equals = function (other) {
        if (BaseObject.prototype.equals.call(this, other)) {
            return true;
        } else if (!other) {
            return !this.__dictionary;
        } else if (ns.Interface.conforms(other, Mapper)) {
            return ns.type.Arrays.equals(this.__dictionary, other.toMap());
        } else {
            return ns.type.Arrays.equals(this.__dictionary, other);
        }
    };

    // Override
    Dictionary.prototype.valueOf = function () {
        return this.__dictionary;
    };

    //-------- Mapper

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
    Dictionary.prototype.allKeys = function() {
        return Object.keys(this.__dictionary);
    };

    // Override
    Dictionary.prototype.toMap = function () {
        return this.__dictionary;
    };

    // Override
    Dictionary.prototype.copyMap = function (deepCopy) {
        if (deepCopy) {
            return ns.type.Copier.deepCopyMap(this.__dictionary);
        } else {
            return ns.type.Copier.copyMap(this.__dictionary);
        }
    };

    //-------- namespace --------
    ns.type.Dictionary = Dictionary;

    ns.type.registers('Dictionary');

})(MONKEY);
