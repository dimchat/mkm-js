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

//! require 'hash.js'

(function (ns) {
    'use strict';

    var MD5 = {
        /**
         *  Get digest of binary data
         *
         * @param {Uint8Array} data - binary data
         * @return {Uint8Array} binary data
         */
        digest: function (data) {
            return this.getDigester().digest(data);
        },

        /**
         *  Get MD5 Digester
         *
         * @return {DataDigester}
         */
        getDigester: function () {
            return md5Digester;
        },

        /**
         *  Set MD5 Digester
         * @param {DataDigester} digester
         */
        setDigester: function (digester) {
            md5Digester = digester;
        }
    };

    var md5Digester = null;

    //-------- namespace --------
    ns.digest.MD5 = MD5;

})(MONKEY);
