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
//! require 'data.js'

!function (ns) {
    'use strict';

    //
    //  String
    //

    /**
     *  Create String with data array or another string
     *
     * @param {Uint8Array|String|str} value
     */
    var str = function (value) {
        if (!value) {
            value = '';
        } else if (value instanceof str) {
            value = value.valueOf();
        } else if (value instanceof Uint8Array) {
            // decode data array
            if (arguments.length === 1 || arguments[1] === 'UTF-8') {
                value = ns.format.UTF8.decode(value);
            } else {
                throw Error('unknown charset: ' + arguments[1]);
            }
        } else if (typeof value !== 'string') {
            throw Error('string value error: ' + value);
        }
        ns.type.Object.call(this);
        this.string = value;
    };
    ns.Class(str, ns.type.Object, null);

    /**
     *  Encode str to UTF8 data array
     *
     * @param {String} charset - 'UTF-8'
     * @returns {Uint8Array}
     */
    str.prototype.getBytes = function (charset) {
        if (!charset || charset === 'UTF-8') {
            return ns.format.UTF8.encode(this.string);
        }
        throw Error('unknown charset: ' + charset);
    };

    /**
     *  Check whether strings equal
     *
     * @param {str|String} other - another string
     * @returns {boolean}
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

    str.prototype.toLocaleString = function () {
        return this.string.toLocaleString();
    };

    str.prototype.toJSON = function () {
        return this.string;
    };

    str.prototype.getLength = function() {
        return this.string.length;
    };

    /**
     *  Create str from Array
     *
     * @param {Uint8Array|uint[]|str|String} array
     * @returns {str}
     */
    str.from = function (array) {
        if (array instanceof Array) {
            // convert Array to Uint8Array
            array = new Uint8Array(array);
        }
        if (arguments.length === 1) {
            return new str(array);
        } else {
            return new str(array, arguments[1]);
        }
    };

    //-------- namespace --------
    ns.type.String = str;

    ns.type.register('String');

}(DIMP);
