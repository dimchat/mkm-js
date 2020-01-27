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

if (typeof DIMP !== 'object') {
    DIMP = {};
}

//! require 'class.js'
//! require 'parser.js'

!function (dimp) {
    'use strict';

    //
    //  UTF-8
    //
    var UTF8 = {
        /**
         *  Encode string to UTF8 data array
         *
         * @param str
         * @returns {[]}
         */
        encode: function (str) {
            var array = [];
            var len = str.length;
            var c;
            for (var i = 0; i < len; ++i) {
                c = str.charCodeAt(i);
                if (c <= 0) {
                    // end
                    break;
                } else if (c < 0x0080) {
                    // 0xxx xxxx
                    array.push(c);
                } else if (c < 0x0800) {
                    // 110x xxxx, 10xx xxxx
                    array.push(0xC0 | ((c >>  6) & 0x001F));
                    array.push(0x80 | ((c >>  0) & 0x003F));
                } else {
                    // 1110 xxxx, 10xx xxxx, 10xx xxxx
                    array.push(0xE0 | ((c >> 12) & 0x000F));
                    array.push(0x80 | ((c >>  6) & 0x003F));
                    array.push(0x80 | ((c >>  0) & 0x003F));
                }
            }
            return array;
        },
        /**
         *  Decode UTF8 data array to string
         *
         * @param array
         * @returns {string}
         */
        decode: function (array) {
            var string = '';
            var len = array.length;
            var c, c2, c3;
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
                }
                string += String.fromCharCode(c);
            }
            return string;
        }
    };

    //
    //  Object wrapper
    //
    var obj = function (data) {
        this.data = data;
    };

    obj.prototype.equals = function (other) {
        console.assert(false, 'implement me!');
        return false;
    };

    obj.prototype.toString = function () {
        return this.data.toString();
    };

    obj.prototype.toLocaleString = function () {
        return this.data.toLocaleString();
    };

    obj.prototype.toJSON = function () {
        return dimp.format.JSON.encode(this.data);
    };

    //
    //  String
    //
    var str = function (data, charset) {
        if (charset === 'UTF-8') {
            data = UTF8.decode(data);
        }
        obj.call(this, data);
    };
    str.inherits(obj);

    str.prototype.equals = function (other) {
        if (!other) {
            return !this.data;
        } else if (other instanceof str) {
            return this.data === other.data;
        }
        // console.assert(other instanceof String, 'other string error');
        return this.data === other;
    };

    /**
     *  Encode str to UTF8 data array
     *
     * @param charset
     * @returns {*[]}
     */
    str.prototype.getBytes = function (charset) {
        if (!charset || charset === 'UTF-8') {
            return UTF8.encode(this.data);
        }
        // TODO: other charset
        return this.data;
    };

    //
    //  Array
    //
    var arrays = {
        equals: function (a1, a2) {
            if (a1 === a2) {
                // same object
                return true;
            }
            if (a1.length !== a2.length) {
                return false;
            }
            for (var k in a1) {
                // noinspection JSUnfilteredForInLoop
                if (a1[k] !== a2[k]) {
                    return false;
                }
            }
            return true;
        },
    };

    //
    //  Dictionary
    //
    var map = function (map) {
        obj.call(this, map);
    };
    map.inherits(obj);

    map.prototype.equals = function (other) {
        if (!other) {
            return !this.data;
        } else if (other instanceof map) {
            return arrays.equals(this.data, other.data);
        }
        return arrays.equals(this.data, other);
    };

    /**
     *  Get all keys in dictionary
     *
     * @returns {string[]}
     */
    map.prototype.allKeys = function() {
        return Object.keys(this.data);
    };

    /**
     *  Get value for key
     *
     * @param key
     * @returns {*}
     */
    map.prototype.getValue = function (key) {
        return this.data[key];
    };

    /**
     *  Set value for key
     *
     * @param key
     * @param value
     */
    map.prototype.setValue = function (key, value) {
        this.data[key] = value;
    };

    //-------- namespace --------
    if (typeof dimp.type !== 'object') {
        dimp.type = {}
    }
    dimp.type.String = str;
    dimp.type.Dictionary = map;
    dimp.type.Arrays = arrays;

}(DIMP);
