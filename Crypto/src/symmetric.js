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
//! require 'cryptography.js'

!function (ns) {
    'use strict';

    const UTF8 = ns.format.UTF8;

    const CryptographyKey = ns.crypto.CryptographyKey;
    const EncryptKey = ns.crypto.EncryptKey;
    const DecryptKey = ns.crypto.DecryptKey;

    const promise = UTF8.encode('Moky loves May Lee forever!');

    //
    //  Symmetric Cryptography Key
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    //  key data format: {
    //      algorithm : "AES", // "DES", ...
    //      data      : "{BASE64_ENCODE}",
    //      ...
    //  }
    //
    const SymmetricKey = function (key) {
        CryptographyKey.call(this, key);
    };
    ns.Class(SymmetricKey, CryptographyKey, [EncryptKey, DecryptKey]);

    SymmetricKey.prototype.equals = function (other) {
        // check by encryption
        const ciphertext = other.encrypt(promise);
        const plaintext = this.decrypt(ciphertext);
        return ns.type.Arrays.equals(promise, plaintext);
    };

    /**
     *  Generate key with algorithm name
     *
     * @param {String} algorithm - algorithm name ('AES')
     * @returns {SymmetricKey}
     */
    SymmetricKey.generate = function (algorithm) {
        return this.getInstance({algorithm: algorithm});
    };

    //-------- runtime --------
    const key_classes = {};

    /**
     *  Register symmetric key class with algorithm
     *
     * @param {String} algorithm - key algorithm
     * @param {Class} clazz - if key class is None, then remove with algorithm
     */
    SymmetricKey.register = function (algorithm, clazz) {
        key_classes[algorithm] = clazz;
    };

    /**
     *  Create symmetric key
     *
     * @param {{}|SymmetricKey} key - key info (with algorithm='AES')
     * @returns {SymmetricKey}
     */
    SymmetricKey.getInstance = function (key) {
        if (!key) {
            return null;
        } else if (key instanceof SymmetricKey) {
            return key;
        }
        const algorithm = key['algorithm'];
        const clazz = key_classes[algorithm];
        if (typeof clazz === 'function') {
            return CryptographyKey.createInstance(clazz, key);
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };

    SymmetricKey.AES = 'AES'; //-- "AES/CBC/PKCS7Padding"
    SymmetricKey.DES = 'DES';

    //-------- namespace --------
    ns.crypto.SymmetricKey = SymmetricKey;

    ns.crypto.register('SymmetricKey');

}(DIMP);
