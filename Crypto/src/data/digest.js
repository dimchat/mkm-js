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
    //  Hash interface
    //
    const hash = function () {
    };
    ns.Interface(hash, null);
    // noinspection JSUnusedLocalSymbols
    /**
     *  Get digest of data
     *
     * @param {Uint8Array} data
     * @returns {Uint8Array}
     */
    hash.prototype.digest = function (data) {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  MD5
    //
    const md5 = function () {
    };
    ns.Class(md5, ns.type.Object, [hash]);
    // noinspection JSUnusedLocalSymbols
    md5.prototype.digest = function (data) {
        console.assert(false, 'MD5 not implemented');
        return null;
    };

    //
    //  SHA256
    //
    const sha256 = function () {
    };
    ns.Class(sha256, ns.type.Object, [hash]);
    // noinspection JSUnusedLocalSymbols
    sha256.prototype.digest = function (data) {
        console.assert(false, 'SHA256 not implemented');
        return null;
    };

    //
    //  RIPEMD160
    //
    const ripemd160 = function () {
    };
    ns.Class(ripemd160, ns.type.Object, [hash]);
    // noinspection JSUnusedLocalSymbols
    ripemd160.prototype.digest = function (data) {
        console.assert(false, 'RIPEMD160 not implemented');
        return null;
    };

    //
    //  Hash Lib
    //
    const Lib = function (hash) {
        this.hash = hash;
    };
    ns.Class(Lib, ns.type.Object, [hash]);

    Lib.prototype.digest = function (data) {
        return this.hash.digest(data);
    };

    //-------- namespace --------
    ns.digest.Hash = hash;
    ns.digest.MD5 = new Lib(new md5());
    ns.digest.SHA256 = new Lib(new sha256());
    ns.digest.RIPEMD160 = new Lib(new ripemd160());

    ns.digest.register('Hash');
    ns.digest.register('MD5');
    ns.digest.register('SHA256');
    ns.digest.register('RIPEMD160');

}(DIMP);
