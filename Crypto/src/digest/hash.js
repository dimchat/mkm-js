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

    var obj = ns.type.Object;

    //
    //  Hash interface
    //
    var hash = function () {
    };
    ns.Interface(hash, null);

    /**
     *  Get digest of data
     *
     * @param {Uint8Array} data
     * @return {Uint8Array}
     */
    hash.prototype.digest = function (data) {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Hash Lib
    //
    var lib = function (hash) {
        obj.call(this);
        this.hash = hash;
    };
    ns.Class(lib, obj, [hash]);

    lib.prototype.digest = function (data) {
        return this.hash.digest(data);
    };

    //-------- namespace --------
    ns.digest.Hash = hash;
    ns.digest.HashLib = lib;

    ns.digest.registers('Hash');
    ns.digest.registers('HashLib');

})(MONKEY);
