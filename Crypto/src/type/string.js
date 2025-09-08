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
     *  String Interface
     */
    mk.type.Stringer = Interface(null, [IObject]);
    var Stringer = mk.type.Stringer;

    Stringer.prototype = {

        isEmpty: function () {},

        /**
         *  Get length of inner string
         *
         * @return {int}
         */
        getLength: function () {},

        /**
         *  Check whether strings equal
         *
         * @param {String|mk.type.Stringer} other - another string
         * @return {boolean}
         */
        equalsIgnoreCase: function (other) {}

    };

    /**
     *  Create String
     *
     * @param {String|mk.type.Stringer} str
     */
    mk.type.ConstantString = function (str) {
        BaseObject.call(this);
        if (!str) {
            str = '';
        } else if (Interface.conforms(str, Stringer)) {
            str = str.toString();
        }
        this.__string = str;
    };
    var ConstantString = mk.type.ConstantString;

    Class(ConstantString, BaseObject, [Stringer]);

    // Override
    ConstantString.prototype.equals = function (other) {
        if (Interface.conforms(other, Stringer)) {
            if (this === other) {
                return true;
            }
            other = other.valueOf();
        }
        return this.__string === other;
    };

    // Override
    ConstantString.prototype.valueOf = function () {
        return this.__string;
    };

    // Override
    ConstantString.prototype.toString = function () {
        return this.__string;
    };

    //-------- Stringer

    // Override
    ConstantString.prototype.isEmpty = function () {
        return this.__string.length === 0;
    };

    // Override
    ConstantString.prototype.getLength = function() {
        return this.__string.length;
    };

    // Override
    ConstantString.prototype.equalsIgnoreCase = function (other) {
        if (this === other) {
            return true;
        } else if (!other) {
            return !this.__string;
        } else if (Interface.conforms(other, Stringer)) {
            return equalsIgnoreCase(this.__string, other.toString());
        } else {
            // assert(other instanceof String, 'other string error');
            return equalsIgnoreCase(this.__string, other);
        }
    };

    var equalsIgnoreCase = function (str1, str2) {
        if (str1.length !== str2.length) {
            return false;
        }
        var low1 = str1.toLowerCase();
        var low2 = str2.toLowerCase();
        return low1 === low2;
    };
