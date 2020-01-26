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

    //
    //  UTF-8
    //
    var fromUTF8 = function (array) {
        var out = '';
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
            out += String.fromCharCode(c);
        }
        return array;
    };
    var toUTF8 = function (str) {
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
    };

    //
    //  JSON
    //
    var toJSON = function () {
        //return JSON.stringify(this);
        return dimp.format.JSON.encode(this);
    };

    //
    //  String
    //
    var str = function (data, charset) {
        if (charset === 'UTF-8') {
            data = fromUTF8(data);
        }
        String.call(this, data);
    };
    str.extends(String);

    str.prototype.equals = function (other) {
        if (this === other) {
            // same object
            return true;
        }
        if (this.length !== other.length) {
            return false;
        }
        for (var index = 0; index < other.length; ++index) {
            if (this.charAt(index) !== other.charAt(index)) {
                return false;
            }
        }
        return true;
    };

    str.prototype.getBytes = function (charset) {
        if (charset === 'UTF-8') {
            return toUTF8(this);
        }
        // TODO: other charset
        return this;
    };

    if (typeof str.prototype.toJSON !== 'function') {
        str.prototype.toJSON = toJSON;
    }

    //
    //  Array
    //
    var array_equals = function (arr1, arr2) {
        if (arr1 === arr2) {
            // same object
            return true;
        }
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (var key in arr2) {
            // noinspection JSUnfilteredForInLoop
            if (arr1[key] !== arr2[key]) {
                return false;
            }
        }
        return true;
    };

    var arrays = {
        equals: array_equals,
    };

    //
    //  Dictionary
    //
    var dict = function (map) {
        Object.call(this, map);
    };
    dict.extends(Object);

    dict.prototype.equals = function (other) {
        return array_equals(this, other);
    };

    if (typeof dict.prototype.toJSON !== 'function') {
        dict.prototype.toJSON = toJSON;
    }

    //-------- namespace --------\\
    if (typeof dimp.type !== 'object') {
        dimp.type = {}
    }
    dimp.type.String = str;
    dimp.type.Dictionary = dict;
    dimp.type.Arrays = arrays;

}(DIMP);
