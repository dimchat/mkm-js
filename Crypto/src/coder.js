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
    //  BaseCoder interface
    //
    var coder = function () {
    };
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
    hex.inherits(coder);
    hex.prototype.encode = function (data) {
        var i = 0;
        var len = data.length;
        var num;
        var str = '';
        for (; i < len; ++i) {
            num = Number(data[i]);
            str += num.toString(16);
        }
        return str;
    };
    hex.prototype.decode = function (str) {
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

    //
    //  Base58
    //
    var base58 = function () {
    };
    base58.inherits(coder);
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
    //  Base64
    //
    var base64 = function () {
    };
    base64.inherits(coder);
    base64.prototype.encode = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'Base64 encode not implemented');
        return null;
    };
    base64.prototype.decode = function (string) {
        console.assert(string != null, 'string empty');
        console.assert(false, 'Base64 decode not implemented');
        return null;
    };

    //
    //  Coder Lib
    //
    var C = function (lib) {
        this.coder = lib;
    };
    C.prototype.encode = function (data) {
        return this.coder.encode(data);
    };
    C.prototype.decode = function (string) {
        return this.coder.decode(string);
    };

    //-------- namespace --------
    if (typeof ns.format !== 'object') {
        ns.format = {}
    }
    ns.format.BaseCoder = coder;
    ns.format.Hex = new C(new hex());
    ns.format.Base58 = new C(new base58());
    ns.format.Base64 = new C(new base64());

}(DIMP);
