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

//! require 'object.js'

(function (ns) {
    'use strict';

    //
    //  BaseCoder interface
    //
    var coder = function () {
    };
    ns.Interface(coder, null);

    /**
     *  Encode binary data to text string
     *
     * @param {Uint8Array} data
     * @return {String}
     */
    coder.prototype.encode = function (data) {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Decode text string to binary data
     *
     * @param {String} string
     * @return {Uint8Array}
     */
    coder.prototype.decode = function (string) {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Coder Lib
    //
    var lib = function (coder) {
        this.coder = coder;
    };
    ns.Class(lib, ns.type.Object, [coder]);

    lib.prototype.encode = function (data) {
        return this.coder.encode(data);
    };
    lib.prototype.decode = function (string) {
        return this.coder.decode(string);
    };

    //-------- namespace --------
    ns.format.BaseCoder = coder;
    ns.format.CoderLib = lib;

    ns.format.register('BaseCoder');
    ns.format.register('CoderLib');

})(MONKEY);
