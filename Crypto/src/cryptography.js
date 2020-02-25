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
    ns.Interface(CryptographyKey, null);
    /**
     *  Check whether keys equal
     *
     * @param other {CryptographyKey}
     * @returns {boolean}
     */
    CryptographyKey.prototype.equals = function (other) {
        console.assert(other != null, 'other key empty');
        console.assert(false, 'implement me!');
        return false;
    };
    /**
     *  Get key data
     *
     * @returns {Uint8Array}
     */
    CryptographyKey.prototype.getData = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Get key size
     *
     * @returns {Number}
     */
    CryptographyKey.prototype.getSize = function () {
        console.assert(false, 'implement me!');
        return 0;
    };

    /**
     *  Create key with info
     *
     * @param clazz - key class
     * @param map {{}} - key info
     * @returns {*} CryptographyKey
     */
    CryptographyKey.createInstance = function (clazz, map) {
        if (typeof clazz.getInstance === 'function') {
            return clazz.getInstance(map);
        } else {
            return new clazz(map);
        }
    };

    var EncryptKey = function () {
    };
    ns.Interface(EncryptKey, CryptographyKey);
    /**
     *  ciphertext = encrypt(plaintext, PW)
     *  ciphertext = encrypt(plaintext, PK)
     *
     * @param data {Uint8Array}
     * @returns {Uint8Array}
     */
    EncryptKey.prototype.encrypt = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'implement me!');
        return null;
    };

    var DecryptKey = function () {
    };
    ns.Interface(DecryptKey, CryptographyKey);
    /**
     *  plaintext = decrypt(ciphertext, PW);
     *  plaintext = decrypt(ciphertext, SK);
     *
     * @param data {Uint8Array}
     * @returns {Uint8Array}
     */
    DecryptKey.prototype.decrypt = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'implement me!');
        return null;
    };

    var SignKey = function () {
    };
    ns.Interface(SignKey, CryptographyKey);
    /**
     *  signature = sign(data, SK);
     *
     * @param data {Uint8Array}
     * @returns {Uint8Array}
     */
    SignKey.prototype.sign = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'implement me!');
        return null;
    };

    var VerifyKey = function () {
    };
    ns.Interface(VerifyKey, CryptographyKey);
    /**
     *  OK = verify(data, signature, PK)
     *
     * @param data {Uint8Array}
     * @param signature {Uint8Array}
     * @returns {boolean}
     */
    VerifyKey.prototype.verify = function (data, signature) {
        console.assert(data != null, 'data empty');
        console.assert(signature != null, 'signature empty');
        console.assert(false, 'implement me!');
        return false;
    };

    //-------- namespace --------
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;

    // ns.crypto.register('CryptographyKey');
    ns.crypto.register('EncryptKey');
    ns.crypto.register('DecryptKey');
    ns.crypto.register('SignKey');
    ns.crypto.register('VerifyKey');

}(DIMP);
