'use strict';
// license: https://mit-license.org
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2024 Albert Moky
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
 *  Data Converter
 */
mk.type.DataConverter = Interface(null, null);
var DataConverter = mk.type.DataConverter;

DataConverter.prototype = {

    getString: function (value, defaultValue) {},

    // assume value can be a config string:
    //     'true', 'false', 'yes', 'no', 'on', 'off', '1', '0', ...
    getBoolean: function (value, defaultValue) {},

    getInt: function (value, defaultValue) {},
    getFloat: function (value, defaultValue) {},

    // assume value can be a timestamp (seconds from 1970-01-01 00:00:00)
    getDateTime: function (value, defaultValue) {}
};

/**
 *  Default Data Converter
 */
mk.type.BaseConverter = function () {
    BaseObject.call(this);
};
var BaseConverter = mk.type.BaseConverter;

Class(BaseConverter, BaseObject, [DataConverter], {

    // Override
    getDateTime: function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (value instanceof Date) {
            // exactly
            return value;
        }
        var seconds = this.getFloat(value, 0);
        var millis = seconds * 1000;
        return new Date(millis);
    },

    // Override
    getFloat: function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (IObject.isNumber(value)) {
            // exactly
            return value;
        } else if (IObject.isBoolean(value)) {
            return value ? 1.0 : 0.0;
        }
        var text = this.getStr(value);
        return parseFloat(text);
    },

    // Override
    getInt: function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (IObject.isNumber(value)) {
            // exactly
            return value;
        } else if (IObject.isBoolean(value)) {
            return value ? 1 : 0;
        }
        var text = this.getStr(value);
        return parseInt(text);
    },

    // Override
    getBoolean: function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (IObject.isBoolean(value)) {
            // exactly
            return value;
        } else if (IObject.isNumber(value)) {
            return value > 0 || value < 0;
        }
        var text = this.getStr(value);
        text = text.trim();
        var size = text.length;
        if (size === 0) {
            return false;
        } else if (size > Converter.MAX_BOOLEAN_LEN) {
            throw new TypeError('Boolean value error: "' + value + '"');
        } else {
            text = text.toLowerCase();
        }
        var state = Converter.BOOLEAN_STATES[text];
        if (IObject.isNull(state)) {
            throw new TypeError('Boolean value error: "' + value + '"');
        }
        return state;
    },

    // Override
    getString: function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (IObject.isString(value)) {
            // exactly
            return value;
        } else {
            return value.toString();
        }
    },

    // private
    getStr: function (value) {
        if (IObject.isString(value)) {
            return  value;
        } else {
            return value.toString();
        }
    }
});

/**
 *  Data Convert Interface
 */
mk.type.Converter = {

    getString: function (value, defaultValue) {
        return this.converter.getString(value, defaultValue);
    },
    getBoolean: function (value, defaultValue) {
        return this.converter.getBoolean(value, defaultValue);
    },

    getInt: function (value, defaultValue) {
        return this.converter.getInt(value, defaultValue);
    },
    getFloat: function (value, defaultValue) {
        return this.converter.getFloat(value, defaultValue);
    },

    getDateTime: function (value, defaultValue) {
        return this.converter.getDateTime(value, defaultValue);
    },

    converter: new BaseConverter(),

    BOOLEAN_STATES: {
        '1': true, 'yes': true, 'true': true, 'on': true,

        '0': false, 'no': false, 'false': false, 'off': false,
        //'+0': false, '-0': false, '0.0': false, '+0.0': false, '-0.0': false,
        'null': false, 'none': false, 'undefined': false
    },
    MAX_BOOLEAN_LEN: 'undefined'.length
};
var Converter = mk.type.Converter;
