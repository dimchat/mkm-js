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

//! require 'object.js'

(function (ns) {
    'use strict';

    var obj = ns.type.Object;

    //
    //  Enumeration
    //

    var get_alias = function (value) {
        // searching exists elements for alias
        var enumeration = this.constructor;
        var e;
        for (var k in enumeration) {
            if (!enumeration.hasOwnProperty(k)) {
                continue;
            }
            e = enumeration[k];
            if (e instanceof enumeration) {
                if (e.equals(value)) {
                    return e.__alias;
                }
            }
        }
        return null;
    };

    /**
     *  Create Enum with value & alias
     *
     * @param {Number|base_enum} value
     * @param {String} alias
     */
    var base_enum = function (value, alias) {
        obj.call(this);
        if (!alias) {
            if (value instanceof base_enum) {
                alias = value.__alias;
            } else {
                alias = get_alias.call(this, value);
            }
        }
        if (value instanceof base_enum) {
            value = value.__value;
        }
        this.__value = value;
        this.__alias = alias;
    };
    ns.Class(base_enum, obj, null);

    /**
     *  Check whether values equal
     *
     * @param {base_enum|Number} other
     * @return {boolean}
     */
    base_enum.prototype.equals = function (other) {
        if (!other) {
            return !this.__value;
        // } else if (obj.prototype.equals.call(this, other)) {
        //     return true;
        } else if (other instanceof base_enum) {
            return this.__value === other.valueOf();
        } else {
            return this.__value === other;
        }
    };

    base_enum.prototype.valueOf = function () {
        return this.__value;
    };

    base_enum.prototype.toString = function () {
        return '<' + this.__alias.toString()
            + ': ' + this.__value.toString() + '>';
    };

    /**
     *  Define Enum with elements names & values
     *
     * @param {*} enumeration - enum constructor
     * @param {{}} elements
     * @return {Class}
     */
    var enumify = function(enumeration, elements) {
        if (!enumeration) {
            enumeration = function (value, alias) {
                base_enum.call(this, value, alias);
            }
        }
        ns.Class(enumeration, base_enum, null);
        var e, v;
        for (var name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue;
            }
            v = elements[name];
            if (v instanceof base_enum) {
                v = v.__value;
            } else if (typeof v !== 'number') {
                throw new TypeError('Enum value must be a number!');
            }
            e = new enumeration(v, name);
            enumeration[name] = e;
        }
        return enumeration;
    };

    //-------- namespace --------
    ns.type.Enum = enumify;

    ns.type.registers('Enum');

})(MONKEY);
