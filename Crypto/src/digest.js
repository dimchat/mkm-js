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

if (typeof DIMP !== 'object') {
    DIMP = {};
}

//! require 'class.js'

!function (dimp) {
    'use strict';

    //
    //  Hash interface
    //
    var hash = function () {
    };
    /**
     *  Get digest of data
     *
     * @param data
     * @returns {*[]}
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
    md5.inherits(hash);
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
    sha256.inherits(hash);
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
    ripemd160.inherits(hash);
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
    H.prototype.digest = function (data) {
        return this.hash.digest(data);
    };

    //-------- namespace --------
    if (typeof dimp.digest !== 'object') {
        dimp.digest = {}
    }
    dimp.digest.Hash = hash;
    dimp.digest.MD5 = new H(new md5());
    dimp.digest.SHA256 = new H(new sha256());
    dimp.digest.RIPEMD160 = new H(new ripemd160());

}(DIMP);
