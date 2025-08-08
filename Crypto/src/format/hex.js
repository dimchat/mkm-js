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

//! require 'coder.js'


mk.format.Hex = {
    /**
     *  Encode binary data to Hex string
     *
     * @param {Uint8Array} data
     * @return {String}
     */
    encode: function (data) {
        return this.getCoder().encode(data);
    },

    /**
     *  Decode Hex string to binary data
     *
     * @param {string} string
     * @return {Uint8Array}
     */
    decode: function (string) {
        return this.getCoder().decode(string);
    },

    /**
     *  Get Hex Coder
     *
     * @return {mk.format.DataCoder}
     */
    getCoder: function () {
        return hexCoder;
    },

    /**
     *  Set Hex Coder
     *
     * @param {mk.format.DataCoder} coder
     */
    setCoder: function (coder) {
        hexCoder = coder
    }
};
var Hex = mk.format.Hex;

var hexCoder = null;
