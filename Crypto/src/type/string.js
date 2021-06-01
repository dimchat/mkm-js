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

//! require 'object.js'

(function (ns) {
    'use strict';

    //
    //  String
    //

    /**
     *  Create String
     *
     * @param {String|str} value
     */
    var str = function (value) {
        if (!value) {
            value = '';
        } else if (value instanceof str) {
            value = value.toString();
        }
        ns.type.Object.call(this);
        this.string = value;
    };
    ns.Class(str, ns.type.Object, null);

    /**
     *  Check whether strings equal
     *
     * @param {str|String} other - another string
     * @return {boolean}
     */
    str.prototype.equals = function (other) {
        if (!other) {
            return !this.string;
        } else if (other instanceof str) {
            return this.string === other.string;
        } else {
            // console.assert(other instanceof String, 'other string error');
            return this.string === other;
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
    str.prototype.equalsIgnoreCase = function (other) {
        if (!other) {
            return !this.string;
        } else if (other instanceof str) {
            return equalsIgnoreCase(this.string, other.string);
        } else {
            // console.assert(other instanceof String, 'other string error');
            return equalsIgnoreCase(this.string, other);
        }
    };

    str.prototype.valueOf = function () {
        return this.string;
    };

    str.prototype.toString = function () {
        return this.string;
    };

    str.prototype.getLength = function() {
        return this.string.length;
    };

    //-------- namespace --------
    ns.type.String = str;

    ns.type.register('String');

})(DIMP);
