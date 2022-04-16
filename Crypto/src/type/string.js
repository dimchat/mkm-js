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

    //
    //  String Interface
    //
    var Stringer = function () {};
    ns.Interface(Stringer, [ns.type.Object]);

    /**
     *  Check whether strings equal
     *
     * @param {String|Stringer} other - another string
     * @return {boolean}
     */
    Stringer.prototype.equalsIgnoreCase = function (other) {
        console.assert(false, 'implement me!');
        return false;
    };

    /**
     *  Get inner string
     *
     * @return {String}
     */
    Stringer.prototype.toString = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get length of inner string
     *
     * @return {number}
     */
    Stringer.prototype.getLength = function () {
        console.assert(false, 'implement me!');
        return 0;
    };

    //-------- namespace --------
    ns.type.Stringer = Stringer;

    ns.type.registers('Stringer');

})(MONKEY);

(function (ns) {
    'use strict';

    var BaseObject = ns.type.BaseObject;
    var Stringer = ns.type.Stringer;

    /**
     *  Create String
     *
     * @param {String|Stringer} str
     */
    var ConstantString = function (str) {
        BaseObject.call(this);
        if (!str) {
            str = '';
        } else if (ns.Interface.conforms(str, Stringer)) {
            str = str.toString();
        }
        this.__string = str;
    };
    ns.Class(ConstantString, BaseObject, [Stringer]);

    // Override
    ConstantString.prototype.equals = function (other) {
        if (BaseObject.prototype.equals.call(this, other)) {
            return true;
        } else if (!other) {
            return !this.__string;
        } else if (ns.Interface.conforms(other, Stringer)) {
            return this.__string === other.toString();
        } else {
            // console.assert(other instanceof String, 'other string error');
            return this.__string === other;
        }
    };

    // Override
    ConstantString.prototype.equalsIgnoreCase = function (other) {
        if (this.equals(other)) {
            return true;
        } else if (!other) {
            return !this.__string;
        } else if (ns.Interface.conforms(other, Stringer)) {
            return equalsIgnoreCase(this.__string, other.toString());
        } else {
            // console.assert(other instanceof String, 'other string error');
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

    // Override
    ConstantString.prototype.valueOf = function () {
        return this.__string;
    };

    // Override
    ConstantString.prototype.toString = function () {
        return this.__string;
    };

    // Override
    ConstantString.prototype.getLength = function() {
        return this.__string.length;
    };

    //-------- namespace --------
    ns.type.ConstantString = ConstantString;

    ns.type.registers('ConstantString');

})(MONKEY);
