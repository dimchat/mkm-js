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

    var Data = ns.type.Data;

    //
    //  UTF-8
    //
    var UTF8 = {
        /**
         *  Encode string to UTF8 data array
         *
         * @param {String} string
         * @returns {Uint8Array}
         */
        encode: function (string) {
            var len = string.length;
            var array = new Data(len);
            var c, l;
            for (var i = 0; i < len; ++i) {
                c = string.charCodeAt(i);
                if (0xD800 <= c && c <= 0xDBFF) {
                    // Unicode SMP (Supplementary Multilingual Plane)
                    l = string.charCodeAt(++i);
                    c = ((c - 0xD800) << 10) + 0x10000 + l - 0xDC00;
                }
                if (c <= 0) {
                    // end
                    break;
                } else if (c < 0x0080) {
                    // 0xxx xxxx
                    array.push(c);
                } else if (c < 0x0800) {
                    // 110x xxxx, 10xx xxxx
                    array.push(0xC0 | ((c >>  6) & 0x1F));
                    array.push(0x80 | ((c >>  0) & 0x3F));
                } else if (c < 0x10000) {
                    // 1110 xxxx, 10xx xxxx, 10xx xxxx
                    array.push(0xE0 | ((c >> 12) & 0x0F));
                    array.push(0x80 | ((c >>  6) & 0x3F));
                    array.push(0x80 | ((c >>  0) & 0x3F));
                } else {
                    // 1111 0xxx, 10xx xxxx, 10xx xxxx, 10xx xxxx
                    array.push(0xF0 | ((c >> 18) & 0x07));
                    array.push(0x80 | ((c >> 12) & 0x3F));
                    array.push(0x80 | ((c >>  6) & 0x3F));
                    array.push(0x80 | ((c >>  0) & 0x3F));
                }
            }
            return array.getBytes(false);
        },
        /**
         *  Decode UTF8 data array to string
         *
         * @param {Uint8Array} array
         * @returns {String}
         */
        decode: function (array) {
            var string = '';
            var len = array.length;
            var c, c2, c3, c4;
            for (var i = 0; i < len; ++i) {
                c = array[i];
                switch (c >> 4) {
                    // case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    //     // 0xxx xxxx
                    //     break;
                    case 12: case 13:
                        // 110x xxxx, 10xx xxxx
                        c2 = array[++i];
                        c = ((c & 0x1F) << 6) | (c2 & 0x3F);
                        break;
                    case 14:
                        // 1110 xxxx, 10xx xxxx, 10xx xxxx
                        c2 = array[++i];
                        c3 = array[++i];
                        c = ((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
                        break;
                    case 15:
                        c2 = array[++i];
                        c3 = array[++i];
                        c4 = array[++i];
                        // 1111 0xxx, 10xx xxxx, 10xx xxxx, 10xx xxxx
                        c = ((c & 0x07) << 18) | ((c2 & 0x3F) << 12) | ((c3 & 0x3F) << 6) | (c4 & 0x3F);
                        break;
                }
                if (c < 0x10000) {
                    string += String.fromCharCode(c);
                } else/* if (c < 0x110000)*/ {
                    // Unicode SMP (Supplementary Multilingual Plane)
                    c -= 0x10000;
                    string += String.fromCharCode((c >> 10) + 0xD800);    // hi
                    string += String.fromCharCode((c & 0x03FF) + 0xDC00); // lo
                }
            }
            return string;
        }
    };

    //
    //  String
    //

    /**
     *  Create String with data array or another string
     *
     * @param {Uint8Array|String|str} value
     * @param {String} charset - 'UTF-8'
     */
    var str = function (value, charset) {
        if (!value) {
            value = '';
        } else if (value instanceof str) {
            value = value.valueOf();
        } else if (typeof value !== 'string') {
            // array?
            if (!(value instanceof Uint8Array)) {
                value = new Uint8Array(value);
            }
            // decode data array
            if (!charset || charset === 'UTF-8') {
                value = UTF8.decode(value);
            } else {
                throw Error('only UTF-8 now');
            }
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
            return UTF8.encode(this.string);
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
            array = new Uint8Array(array);
        }
        return new str(array, null);
    };

    //-------- namespace --------
    ns.type.String = str;

    ns.type.register('String');

}(DIMP);
