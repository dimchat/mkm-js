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

    //-------- HEX algorithm begin --------
    var hex_encode = function (data) {
        var i = 0;
        var len = data.length;
        var num;
        var str = '';
        var s;
        for (; i < len; ++i) {
            num = Number(data[i]);
            s = num.toString(16);
            if (s.length % 2) {
                str += '0' + s;
            } else {
                str += s;
            }
        }
        return str;
    };

    var hex_decode = function (str) {
        var i = 0;
        var len = str.length;
        if (len > 2) {
            // skip '0x'
            if (str[0] === '0') {
                if (str[1] === 'x' || str[1] === 'X') {
                    i += 2;
                }
            }
        }
        var ch;
        var data = [];
        for (; (i+1) < len; i+=2) {
            ch = str.substring(i, i+2);
            data.push(parseInt(ch, 16));
        }
        return data;
    };
    //-------- HEX algorithm end --------

    //-------- Base64 algorithm begin --------
    var base64_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var base64_values = [];
    !function (chars, values) {
        var i;
        // init
        for (i = 0; i < 128; ++i) {
            values[i] = -1;
        }
        // set value
        for (i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i;
        }
        values[0x3D] = 0; // special value: '='
    }(base64_chars, base64_values);

    //
    //  (Int8Array)
    //
    // 11111111, 11111111, 11111111
    // 11111111, 11111111, 11111111,  11111111, ........, ........  (append 2 bytes)
    // 11111111, 11111111, 11111111,  11111111, 11111111, ........  (append 1 byte)
    // 11111111, 11111111, 11111111,  11111111, 11111111, 11111111

    //
    //  (Base64)
    //
    // 111111 11,1111 1111,11 111111
    // 111111 11,1111 1111,11 111111  111111 11,.... ....,.. ......  (append ==)
    // 111111 11,1111 1111,11 111111  111111 11,1111 1111,.. ......  (append =)
    // 111111 11,1111 1111,11 111111  111111 11,1111 1111,11 111111

    var base64_encode = function (data) {
        var base64 = '';
        var length = data.length;
        var tail = '';
        var remainder = length % 3;
        if (remainder === 1) {
            length -= 1;
            tail = '==';
        } else if (remainder === 2) {
            length -= 2;
            tail = '=';
        }
        var x1, x2, x3;
        var i;
        for (i = 0; i < length; i += 3) {
            x1 = data[i];
            x2 = data[i+1];
            x3 = data[i+2];
            // 111111.. ........ ........
            base64 += base64_chars.charAt((x1 & 0xFC) >> 2);
            // ......11 1111.... ........
            base64 += base64_chars.charAt(((x1 & 0x03) << 4) | ((x2 & 0xF0) >> 4));
            // ........ ....1111 11......
            base64 += base64_chars.charAt(((x2 & 0x0F) << 2) | ((x3 & 0xC0) >> 6));
            // ........ ........ ..111111
            base64 += base64_chars.charAt(x3 & 0x3F);
        }
        // check tail
        if (remainder === 1) {
            x1 = data[i];
            // 111111.. ........ ........
            base64 += base64_chars.charAt((x1 & 0xFC) >> 2);
            // ......11 0000.... ........
            base64 += base64_chars.charAt((x1 & 0x03) << 4);
        } else if (remainder === 2) {
            x1 = data[i];
            x2 = data[i+1];
            // 111111.. ........ ........
            base64 += base64_chars.charAt((x1 & 0xFC) >> 2);
            // ......11 1111.... ........
            base64 += base64_chars.charAt(((x1 & 0x03) << 4) | ((x2 & 0xF0) >> 4));
            // ........ ....1111 00......
            base64 += base64_chars.charAt((x2 & 0x0F) << 2);
        }
        return base64 + tail;
    };

    var base64_decode = function (string) {
        // preprocess
        var str = string.replace(/[^A-Za-z0-9+\/=]/g, '');
        var length = str.length;
        if ((length % 4) !== 0 || !/^[A-Za-z0-9+\/]+={0,2}$/.test(str)) {
            throw Error('base64 string error: ' + string)
        }
        var array = [];
        // parse each 4 chars to 3 bytes
        var ch1, ch2, ch3, ch4;
        var i;
        for (i = 0; i < length; i+=4) {
            ch1 = base64_values[str.charCodeAt(i)];
            ch2 = base64_values[str.charCodeAt(i+1)];
            ch3 = base64_values[str.charCodeAt(i+2)];
            ch4 = base64_values[str.charCodeAt(i+3)];
            // 111111 11.... ...... ......
            array.push(((ch1 & 0x3F) << 2) | ((ch2 & 0x30) >> 4));
            // ...... ..1111 1111.. ......
            array.push(((ch2 & 0x0F) << 4) | ((ch3 & 0x3C) >> 2));
            // ...... ...... ....11 111111
            array.push(((ch3 & 0x03) << 6) | ((ch4 & 0x3F) >> 0));
        }
        // remove tail
        while (str[--i] === '=') {
            array.pop();
        }
        return array;
    };
    //-------- Base64 algorithm end --------

    //
    //  BaseCoder interface
    //
    var coder = function () {
    };
    ns.type.Interface(coder);
    /**
     *  Encode binary data to text string
     *
     * @param data
     * @returns {null|string}
     */
    coder.prototype.encode = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Decode text string to binary data
     *
     * @param string
     * @returns {*[]}
     */
    coder.prototype.decode = function (string) {
        console.assert(string != null, 'string empty');
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Hex
    //
    var hex = function () {
    };
    ns.type.Class(hex, null, coder);

    hex.prototype.encode = function (data) {
        return hex_encode(data);
    };
    hex.prototype.decode = function (str) {
        return hex_decode(str);
    };

    //
    //  Base64
    //
    var base64 = function () {
    };
    ns.type.Class(base64, null, coder);

    base64.prototype.encode = function (data) {
        return base64_encode(data);
    };
    base64.prototype.decode = function (string) {
        return base64_decode(string);
    };

    //
    //  Base58
    //
    var base58 = function () {
    };
    ns.type.Class(base58, null, coder);

    base58.prototype.encode = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'Base58 encode not implemented');
        return null;
    };
    base58.prototype.decode = function (string) {
        console.assert(string != null, 'string empty');
        console.assert(false, 'Base58 decode not implemented');
        return null;
    };

    //
    //  Coder Lib
    //
    var C = function (lib) {
        this.coder = lib;
    };
    ns.type.Class(C, null, coder);

    C.prototype.encode = function (data) {
        return this.coder.encode(data);
    };
    C.prototype.decode = function (string) {
        return this.coder.decode(string);
    };

    //-------- namespace --------
    ns.format.BaseCoder = coder;
    ns.format.Hex = new C(new hex());
    ns.format.Base58 = new C(new base58());
    ns.format.Base64 = new C(new base64());

    ns.format.register('BaseCoder');
    ns.format.register('Hex');
    ns.format.register('Base58');
    ns.format.register('Base64');

}(DIMP);
