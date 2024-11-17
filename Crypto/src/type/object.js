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

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;

    var is_null = function (object) {
        if (typeof object === 'undefined') {
            return true;
        } else {
            return object === null;
        }
    };

    var is_string = function (object) {
        return typeof object === 'string';
    };
    var is_number = function (object) {
        return typeof object === 'number';
    };
    var is_boolean = function (object) {
        return typeof object === 'boolean';
    };
    var is_function = function (object) {
        return typeof object === 'function';
    };

    var is_base_type = function (object) {
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

    //
    //  Object Interface
    //
    var IObject = Interface(null, null);

    IObject.prototype.toString = function () {};

    IObject.prototype.valueOf = function () {};

    IObject.prototype.isEmpty = function () {};

    /**
     *  Check whether objects equal
     *
     * @param {Object} other - another object
     * @return {boolean}
     */
    IObject.prototype.equals = function (other) {};

    IObject.isNull = is_null;

    IObject.isString = is_string;
    IObject.isNumber = is_number;
    IObject.isBoolean = is_boolean;
    IObject.isFunction = is_function;

    IObject.isBaseType = is_base_type;

    //
    //  Base class for Object
    //
    var BaseObject = function () {
        Object.call(this);
    };
    Class(BaseObject, Object, [IObject], null);

    // Override
    BaseObject.prototype.equals = function (other) {
        return this === other;
    };

    //-------- namespace --------
    ns.type.Object = IObject;
    ns.type.BaseObject = BaseObject;

})(MONKEY);
