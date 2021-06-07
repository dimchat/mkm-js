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

//! require 'arrays.js'
//! require 'utf8.js'

(function (ns) {
    'use strict';

    var map = ns.type.Map;

    //
    //  Cryptography Key
    //  ~~~~~~~~~~~~~~~~
    //
    //  key data format: {
    //      algorithm : "RSA", // ECC, AES, ...
    //      data      : "{BASE64_ENCODE}",
    //      ...
    //  }
    //
    var CryptographyKey = function () {
    };
    ns.Interface(CryptographyKey, [map]);

    /**
     *  Get key algorithm name
     *
     * @return {String} algorithm name
     */
    CryptographyKey.prototype.getAlgorithm = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    CryptographyKey.getAlgorithm = function (key) {
        return key['algorithm'];
    };

    /**
     *  Get key data
     *
     * @return {Uint8Array}
     */
    CryptographyKey.prototype.getData = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    // sample data for checking keys
    CryptographyKey.promise = ns.format.UTF8.encode('Moky loves May Lee forever!');

    /**
     *  Check key pair by encryption
     *
     * @param {EncryptKey} pKey
     * @param {DecryptKey} sKey
     */
    CryptographyKey.matches = function (pKey, sKey) {
        // check by encryption
        var promise = CryptographyKey.promise;
        var ciphertext = pKey.encrypt(promise);
        var plaintext = sKey.decrypt(ciphertext);
        // check equals
        if (!plaintext || plaintext.length !== promise.length) {
            return false;
        }
        for (var i = 0; i < promise.length; ++i) {
            if (plaintext[i] !== promise[i]) {
                return false;
            }
        }
        return true;
    };

    //-------- namespace --------
    ns.crypto.CryptographyKey = CryptographyKey;

    ns.crypto.register('CryptographyKey');

})(MONKEY);
