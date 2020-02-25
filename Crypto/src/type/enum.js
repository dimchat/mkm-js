;
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

!function (ns) {
    'use strict';

    //
    //  Enumeration
    //

    /**
     *  Create Enum with value & alias
     *
     * @param value {Number|base_enum}
     * @param alias {String}
     */
    var base_enum = function (value, alias) {
        ns.type.Object.call(this);
        if (value instanceof base_enum) {
            this.value = value.valueOf();
        } else {
            this.value = value;
        }
        this.alias = alias;
    };
    ns.Class(base_enum, ns.type.Object, null);

    /**
     *  Check whether values equal
     *
     * @param other {base_enum|Number}
     * @returns {boolean}
     */
    base_enum.prototype.equals = function (other) {
        if (!other) {
            return !this.value;
        // } else if (ns.type.Object.prototype.equals.call(this, other)) {
        //     return true;
        } else if (other instanceof base_enum) {
            return this.value === other.valueOf();
        } else {
            return this.value === other;
        }
    };

    base_enum.prototype.valueOf = function () {
        return this.value;
    };

    base_enum.prototype.toString = function () {
        return '<' + this.alias.toString()
            + ': ' + this.value.toString() + '>';
    };

    base_enum.prototype.toLocaleString = function () {
        return '<' + this.alias.toLocaleString()
            + ': ' + this.value.toLocaleString() + '>';
    };

    base_enum.prototype.toJSON = function () {
        return this.value;
    };

    /**
     *  Define Enum with elements names & values
     *
     * @param elements {{}}
     * @returns {Class}
     */
    var create = function(elements) {
        // template for enumeration
        var enumeration = function (value, alias) {
            if (!alias) {
                alias = get_name(value, enumeration);
                if (!alias) {
                    throw RangeError('enum error: ' + value);
                }
            }
            base_enum.call(this, value, alias);
        };
        ns.Class(enumeration, base_enum, null);
        var e, v;
        for (var name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue;
            }
            v = elements[name];
            if (typeof v === 'function') {
                continue;
            }
            e = new enumeration(v, name);
            enumeration[name] = e;
        }
        return enumeration;
    };

    // get alias name from exist elements
    var get_name = function (value, enumeration) {
        if (value instanceof enumeration) {
            return value.alias;
        }
        // searching exists elements for alias
        var e;
        for (var k in enumeration) {
            // noinspection JSUnfilteredForInLoop
            e = enumeration[k];
            if (e instanceof enumeration) {
                if (e.equals(value)) {
                    return e.alias;
                }
            }
        }
        return null;
    };

    //-------- namespace --------
    ns.type.Enum = create;

    ns.type.register('Enum');

}(DIMP);
