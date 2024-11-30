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

    var Class      = ns.type.Class;
    var IObject    = ns.type.Object;
    var BaseObject = ns.type.BaseObject;

    var is_enum = function (obj) {
        return obj instanceof BaseEnum;
    };

    var get_int = function (obj) {
        if (obj instanceof BaseEnum) {
            return obj.getValue();
        } else if (IObject.isNumber(obj)) {
            return obj;
        }
        return obj.valueOf();
    };

    // searching exists elements for alias
    var get_alias = function (enumeration, value) {
        var keys = Object.keys(enumeration);
        var e;
        for (var k in keys) {
            e = enumeration[k];
            if (e instanceof BaseEnum && e.equals(value)) {
                return e.__alias;
            }
        }
        return null;
    };

    /**
     *  Create Enum with value & alias
     *
     * @param {int} value
     * @param {String} alias
     */
    var BaseEnum = function (value, alias) {
        BaseObject.call(this);
        if (!alias) {
            alias = get_alias(this, value);
        }
        this.__value = value;
        this.__alias = alias;
    };
    Class(BaseEnum, BaseObject, null, null);

    // Override
    BaseEnum.prototype.equals = function (other) {
        if (other instanceof BaseEnum) {
            if (this === other) {
                return true;
            }
            other = other.valueOf();
        }
        return this.__value === other;
    };

    // Override
    BaseEnum.prototype.toString = function () {
        return '<' + this.getName() + ': ' + this.getValue() + '>';
    };

    // Override
    BaseEnum.prototype.valueOf = function () {
        return this.__value;
    };

    BaseEnum.prototype.getValue = function () {
        return this.__value;
    };

    BaseEnum.prototype.getName = function () {
        return this.__alias;
    };

    var enum_class = function (type) {
        var Enum = function (value, alias) {
            BaseEnum.call(this, value, alias);
        };
        Class(Enum, BaseEnum, null, {
            // Override
            toString: function () {
                var clazz = Enum.__type;
                if (!clazz) {
                    clazz = this.getClassName();
                }
                return '<' + clazz + ' ' + this.getName() +
                    ': ' + this.getValue() + '>';
            }
        });
        Enum.__type = type;
        return Enum;
    };

    /**
     *  Define Enum with elements names & values
     *
     * @param {String|Function|*} enumeration - enum name/constructor
     * @param {{}} elements                   - enum elements
     * @return {Class} enum class
     */
    var enumify = function(enumeration, elements) {
        if (IObject.isString(enumeration)) {
            enumeration = enum_class(enumeration);
        } else if (!enumeration) {
            enumeration = enum_class(null);
        } else {
            Class(enumeration, BaseEnum, null, null);
        }
        // create enum elements
        var keys = Object.keys(elements);
        var alias, value;
        for (var i = 0; i < keys.length; ++i) {
            alias = keys[i];
            value = elements[alias];
            if (value instanceof BaseEnum) {
                value = value.getValue();
            } else if (typeof value !== 'number') {
                throw new TypeError('Enum value must be a number!');
            }
            enumeration[alias] = new enumeration(value, alias);
        }
        return enumeration;
    };
    enumify.isEnum = is_enum;
    enumify.getInt = get_int;

    //-------- namespace --------
    ns.type.Enum = enumify;

})(MONKEY);
