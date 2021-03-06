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

//! require 'data.js'
//! require 'coder.js'

(function (ns) {
    'use strict';

    var obj = ns.type.Object;
    var Data = ns.type.Data;
    var Coder = ns.format.BaseCoder;
    var Lib = ns.format.CoderLib;

    //-------- HEX algorithm begin --------
    var hex_chars = '0123456789abcdef';
    var hex_values = new Int8Array(128);
    (function (chars, values) {
        for (var i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i;
        }
        values['A'.charCodeAt(0)] = 0x0A;
        values['B'.charCodeAt(0)] = 0x0B;
        values['C'.charCodeAt(0)] = 0x0C;
        values['D'.charCodeAt(0)] = 0x0D;
        values['E'.charCodeAt(0)] = 0x0E;
        values['F'.charCodeAt(0)] = 0x0F;
    })(hex_chars, hex_values);

    /**
     *  Encode data array to HEX string
     *
     * @param {Uint8Array} data
     * @return {String}
     */
    var hex_encode = function (data) {
        var len = data.length;
        var str = '';
        var byt;
        for (var i = 0; i < len; ++i) {
            byt = data[i];
            str += hex_chars[byt >> 4];   // hi
            str += hex_chars[byt & 0x0F]; // lo
        }
        return str;
    };

    /**
     *  Decode HEX string to data array
     *
     * @param {String} string
     * @return {Uint8Array}
     */
    var hex_decode = function (string) {
        var i = 0;
        var len = string.length;
        if (len > 2) {
            // skip '0x'
            if (string[0] === '0') {
                if (string[1] === 'x' || string[1] === 'X') {
                    i += 2;
                }
            }
        }
        var size = Math.floor(len / 2);
        var data = new Data(size);
        --len; // for condition: i < (len - 1)
        var hi, lo;
        for (; i < len; i+=2) {
            hi = hex_values[string.charCodeAt(i)];
            lo = hex_values[string.charCodeAt(i+1)];
            data.push((hi << 4) | lo);
        }
        return data.getBytes();
    };
    //-------- HEX algorithm end --------

    //
    //  Hex
    //
    var hex = function () {
        obj.call(this);
    };
    ns.Class(hex, obj, [Coder]);

    hex.prototype.encode = function (data) {
        return hex_encode(data);
    };
    hex.prototype.decode = function (str) {
        return hex_decode(str);
    };

    //-------- namespace --------
    ns.format.Hex = new Lib(new hex());

    ns.format.registers('Hex');

})(MONKEY);
