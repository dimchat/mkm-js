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
