;
// license: https://mit-license.org
//
//  MONKEY: Memory Object aNd KEYs
//
//                               Written in 2024 by Moky <albert.moky@gmail.com>
//
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

(function (ns) {
    'use strict';

    var IObject = ns.type.Object;

    var getString = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (value instanceof String) {
            // exactly
            return value;
        } else {
            return value.toString();
        }
    };

    // assume value can be a timestamp (seconds from 1970-01-01 00:00:00)
    var getDateTime = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (value instanceof Date) {
            // exactly
            return value;
        }
        var seconds = getFloat(value, 0);
        var millis = seconds * 1000;
        return new Date(millis);
    };

    var getInt = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (value instanceof Number) {
            // exactly
            return value;
        } else if (value instanceof Boolean) {
            return value ? 1 : 0;
        } else {
            var str = value instanceof String ? value : value.toString();
            return parseInt(str);
        }
    };
    var getFloat = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (value instanceof Number) {
            // exactly
            return value;
        } else if (value instanceof Boolean) {
            return value ? 1.0 : 0.0;
        } else {
            var str = value instanceof String ? value : value.toString();
            return parseFloat(str);
        }
    };

    // assume value can be a config string:
    //     'true', 'false', 'yes', 'no', 'on', 'off', '1', '0', ...
    var getBoolean = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            // empty
            return defaultValue;
        } else if (value instanceof Boolean) {
            // exactly
            return value;
        } else if (value instanceof Number) {
            return value > 0 || value < 0;
        }
        var text;
        if (value instanceof String) {
            text = value;
        } else {
            text = value.toString();
        }
        text = text.trim();
        var size = text.length;
        if (size === 0) {
            return false;
        } else if (size > ns.type.Converter.kMaxBoolLen) {
            return true;
        } else {
            text = text.toLowerCase();
        }
        var state = kBoolStates[text];
        return IObject.isNull(state) || state;
    };
    var kBoolStates = {
        '1': true, 'yes': true, 'true': true, 'on': true,

        '0': false, 'no': false, 'false': false, 'off': false,
        '+0': false, '-0': false, '+0.0': false, '-0.0': false,
        'none': false, 'null': false, 'undefined': false
    };
    var kMaxBoolLen = 'undefined'.length;

    //-------- namespace --------
    ns.type.Converter = {

        getString: getString,

        getDateTime: getDateTime,

        getInt: getInt,
        getFloat: getFloat,

        getBoolean: getBoolean,
        kBoolStates: kBoolStates,
        kMaxBoolLen: kMaxBoolLen
    };

})(MONKEY);
