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

//! require 'coder.js'

(function (ns) {
    'use strict';

    var UTF8 = {
        /**
         *  Encode local string to binary data
         *
         * @param {String} string
         * @return {Uint8Array}
         */
        encode: function (string) {
            return this.getCoder().encode(string);
        },

        /**
         *  Decode binary data to local string
         *
         * @param {Uint8Array} data
         * @return {String}
         */
        decode: function (data) {
            return this.getCoder().decode(data);
        },

        /**
         *  Get UTF8 Coder
         *
         * @return {StringCoder}
         */
        getCoder: function () {
            return utf8Coder;
        },

        /**
         *  Set UTF8 Coder
         *
         * @param {StringCoder} coder
         */
        setCoder: function (coder) {
            utf8Coder = coder
        }
    };

    var utf8Coder = null;

    //-------- namespace --------
    ns.format.UTF8 = UTF8;

})(MONKEY);
