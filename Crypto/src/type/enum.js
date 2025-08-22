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
 *  searching exists elements for alias
 */
var get_enum_alias = function (enumeration, value) {
    var alias = null;
    Mapper.forEach(enumeration, function (n, e) {
        if (e instanceof BaseEnum && e.equals(value)) {
            alias = e.__alias;
            return true;
        }
        return false;
    });
    return alias;
};

/**
 *  Create Enum with value & alias
 *
 * @param {int} value
 * @param {String} alias
 */
mk.type.BaseEnum = function (value, alias) {
    BaseObject.call(this);
    if (!alias) {
        alias = get_enum_alias(this, value);
    }
    this.__value = value;
    this.__alias = alias;
};
var BaseEnum = mk.type.BaseEnum;

Class(BaseEnum, BaseObject, null, {
    // Override
    equals: function (other) {
        if (other instanceof BaseEnum) {
            if (this === other) {
                return true;
            }
            other = other.valueOf();
        }
        return this.__value === other;
    },

    // Override
    toString: function () {
        return '<' + this.getName() + ': ' + this.getValue() + '>';
    },

    // Override
    valueOf: function () {
        return this.__value;
    },

    getValue: function () {
        return this.__value;
    },

    getName: function () {
        return this.__alias;
    }
});

var enum_class = function (type) {
    var NamedEnum = function (value, alias) {
        BaseEnum.call(this, value, alias);
    };
    Class(NamedEnum, BaseEnum, null, {
        // Override
        toString: function () {
            var clazz = NamedEnum.__type;
            if (!clazz) {
                clazz = this.getClassName();
            }
            return '<' + clazz + ' ' + this.getName() +
                ': ' + this.getValue() + '>';
        }
    });
    NamedEnum.__type = type;
    return NamedEnum;
};

/**
 *  Define Enum with elements names & values
 *
 * @param {String|Class} enumeration - enum name/constructor
 * @param {{}} elements              - enum elements
 * @return {Class} enum class
 */
mk.type.Enum = function(enumeration, elements) {
    if (IObject.isString(enumeration)) {
        // enum with name
        enumeration = enum_class(enumeration);
    } else if (!enumeration) {
        // enum without name
        enumeration = enum_class(null);
    } else {
        // customized enum
        Class(enumeration, BaseEnum, null, null);
    }
    // create enum elements
    Mapper.forEach(elements, function (alias, value) {
        if (value instanceof BaseEnum) {
            value = value.getValue();
        } else if (typeof value !== 'number') {
            throw new TypeError('Enum value must be a number!');
        }
        enumeration[alias] = new enumeration(value, alias);
        return false;
    });
    return enumeration;
};
var Enum = mk.type.Enum;

Enum.isEnum = function (obj) {
    return obj instanceof BaseEnum;
};

Enum.getInt = function (obj) {
    if (obj instanceof BaseEnum) {
        return obj.getValue();
    } else if (IObject.isNumber(obj)) {
        return obj;
    }
    return obj.valueOf();
};
