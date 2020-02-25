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
    var hash = function () {
    };
    ns.Interface(hash, null);
    /**
     *  Get digest of data
     *
     * @param data {Uint8Array}
     * @returns {Uint8Array}
     */
    hash.prototype.digest = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  MD5
    //
    var md5 = function () {
    };
    ns.Class(md5, null, hash);

    md5.prototype.digest = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'MD5 not implemented');
        return null;
    };

    //
    //  SHA256
    //
    var sha256 = function () {
    };
    ns.Class(sha256, null, hash);

    sha256.prototype.digest = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'SHA256 not implemented');
        return null;
    };

    //
    //  RIPEMD160
    //
    var ripemd160 = function () {
    };
    ns.Class(ripemd160, null, hash);

    ripemd160.prototype.digest = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'RIPEMD160 not implemented');
        return null;
    };

    //
    //  Hash Lib
    //
    var H = function (lib) {
        this.hash = lib;
    };
    ns.Class(H, null, hash);

    H.prototype.digest = function (data) {
        return this.hash.digest(data);
    };

    //-------- namespace --------
    ns.digest.Hash = hash;
    ns.digest.MD5 = new H(new md5());
    ns.digest.SHA256 = new H(new sha256());
    ns.digest.RIPEMD160 = new H(new ripemd160());

    ns.digest.register('Hash');
    ns.digest.register('MD5');
    ns.digest.register('SHA256');
    ns.digest.register('RIPEMD160');

}(DIMP);
