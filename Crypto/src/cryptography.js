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
    var CryptographyKey = function() {
    };
    CryptographyKey.prototype.equals = function (other) {
        console.assert(other != null, 'other key empty');
        console.assert(false, 'implement me!');
        return false;
    };
    /**
     *  Get key data
     *
     * @returns {*[]}
     */
    CryptographyKey.prototype.getData = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Get key size
     *
     * @returns {number}
     */
    CryptographyKey.prototype.getSize = function () {
        console.assert(false, 'implement me!');
        return 0;
    };
    /**
     *  Create key with info
     *
     * @param clazz - key class name
     * @param map - key info
     * @returns {object}
     */
    CryptographyKey.createInstance = function (clazz, map) {
        if (typeof clazz.createInstance === 'function') {
            return clazz.createInstance(map);
        } else {
            return new clazz(map);
        }
    };

    var EncryptKey = function () {
    };
    EncryptKey.implements(CryptographyKey);
    /**
     *  ciphertext = encrypt(plaintext, PW)
     *  ciphertext = encrypt(plaintext, PK)
     *
     * @param data - plaintext
     * @returns {*[]}
     */
    EncryptKey.prototype.encrypt = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'implement me!');
        return null;
    };

    var DecryptKey = function () {
    };
    DecryptKey.implements(CryptographyKey);
    /**
     *  plaintext = decrypt(ciphertext, PW);
     *  plaintext = decrypt(ciphertext, SK);
     *
     * @param data - ciphertext
     * @returns {*[]}
     */
    DecryptKey.prototype.decrypt = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'implement me!');
        return null;
    };

    var SignKey = function () {
    };
    SignKey.implements(CryptographyKey);
    /**
     *  signature = sign(data, SK);
     *
     * @param data - message data
     * @returns {*[]}
     */
    SignKey.prototype.sign = function (data) {
        console.assert(data != null, 'data empty');
        console.assert(false, 'implement me!');
        return null;
    };

    var VerifyKey = function () {
    };
    VerifyKey.implements(CryptographyKey);
    /**
     *  OK = verify(data, signature, PK)
     *
     * @param data - message data
     * @param signature - signature of message data
     * @returns {boolean}
     */
    VerifyKey.prototype.verify = function (data, signature) {
        console.assert(data != null, 'data empty');
        console.assert(signature != null, 'signature empty');
        console.assert(false, 'implement me!');
        return false;
    };

    //-------- namespace --------\\
    if (typeof dimp.crypto !== 'object') {
        dimp.crypto = {}
    }
    dimp.crypto.CryptographyKey = CryptographyKey;
    dimp.crypto.EncryptKey = EncryptKey;
    dimp.crypto.DecryptKey = DecryptKey;
    dimp.crypto.SignKey = SignKey;
    dimp.crypto.VerifyKey = VerifyKey;

}(DIMP);
