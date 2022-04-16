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

    var base = ns.type.BaseObject;

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
                Enum.call(this, value, alias);
            }
        }
        ns.Class(enumeration, Enum, null);
        var e, v;
        for (var name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue;
            }
            v = elements[name];
            if (v instanceof Enum) {
                v = v.__value;
            } else if (typeof v !== 'number') {
                throw new TypeError('Enum value must be a number!');
            }
            e = new enumeration(v, name);
            enumeration[name] = e;
        }
        return enumeration;
    };

    // searching exists elements for alias
    var get_alias = function (enumeration, value) {
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
     * @param {Number|Enum} value
     * @param {String} alias
     */
    var Enum = function (value, alias) {
        base.call(this);
        if (!alias) {
            if (value instanceof Enum) {
                alias = value.__alias;
            } else {
                alias = get_alias(this.constructor, value);
            }
        }
        if (value instanceof Enum) {
            value = value.__value;
        }
        this.__value = value;
        this.__alias = alias;
    };
    ns.Class(Enum, base, null);

    // Override
    Enum.prototype.equals = function (other) {
        if (!other) {
            return !this.__value;
        // } else if (base.prototype.equals.call(this, other)) {
        //     return true;
        } else if (other instanceof Enum) {
            return this.__value === other.valueOf();
        } else {
            return this.__value === other;
        }
    };

    // Override
    Enum.prototype.valueOf = function () {
        return this.__value;
    };

    Enum.prototype.toString = function () {
        return '<' + this.__alias.toString()
            + ': ' + this.__value.toString() + '>';
    };

    //-------- namespace --------
    ns.type.Enum = enumify;

    ns.type.registers('Enum');

})(MONKEY);
