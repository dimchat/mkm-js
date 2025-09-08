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


    /**
     *  Object Interface
     */
    mk.type.Object = Interface(null, null);
    var IObject = mk.type.Object;

    IObject.prototype = {

        getClassName: function () {},

        equals: function () {},

        valueOf: function () {},

        toString: function () {}

    };

    IObject.isNull = function (object) {
        if (typeof object === 'undefined') {
            return true;
        } else {
            return object === null;
        }
    };
    IObject.isString = function (object) {
        return typeof object === 'string';
    };
    IObject.isNumber = function (object) {
        return typeof object === 'number';
    };
    IObject.isBoolean = function (object) {
        return typeof object === 'boolean';
    };
    IObject.isFunction = function (object) {
        return typeof object === 'function';
    };

    IObject.isBaseType = function (object) {
        var t = typeof object;
        if (t === 'string' || t === 'number' || t === 'boolean' || t === 'function') {
            return true;
        }
        /*/
        if (object instanceof String) {
            return true;
        }
        if (object instanceof Number) {
            return true;
        }
        if (object instanceof Boolean) {
            return true;
        }
        /*/
        if (object instanceof Date) {
            return true;
        }
        if (object instanceof RegExp) {
            return true;
        }
        return object instanceof Error;
    };

    /**
     *  Base class for Object
     */
    mk.type.BaseObject = function () {
        Object.call(this);
    };
    var BaseObject = mk.type.BaseObject;

    Class(BaseObject, null, [IObject]);

    // Override
    BaseObject.prototype.getClassName = function () {
        return Object.getPrototypeOf(this).constructor.name;
    };

    // Override
    BaseObject.prototype.equals = function (other) {
        return this === other;
    };
