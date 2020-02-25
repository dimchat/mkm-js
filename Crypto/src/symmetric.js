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

    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;

    var promise = 'Moky loves May Lee forever!';
    promise = ns.type.String.from(promise).getBytes(null);

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
    var SymmetricKey = function () {
    };
    ns.Interface(SymmetricKey, EncryptKey, DecryptKey);

    SymmetricKey.prototype.equals = function (other) {
        // check by encryption
        var ciphertext = other.encrypt(promise);
        var plaintext = this.decrypt(ciphertext);
        return ns.type.Arrays.equals(promise, plaintext);
    };

    /**
     *  Generate key with algorithm name
     *
     * @param algorithm {String} - algorithm name ('AES')
     * @returns {SymmetricKey}
     */
    SymmetricKey.generate = function (algorithm) {
        return this.getInstance({algorithm: algorithm});
    };

    //-------- runtime --------
    var key_classes = {};

    /**
     *  Register symmetric key class with algorithm
     *
     * @param algorithm {String} - key algorithm
     * @param clazz {Class} - if key class is None, then remove with algorithm
     */
    SymmetricKey.register = function (algorithm, clazz) {
        key_classes[algorithm] = clazz;
    };

    /**
     *  Create symmetric key
     *
     * @param key {{}|SymmetricKey} - key info (with algorithm='AES')
     * @returns {SymmetricKey}
     */
    SymmetricKey.getInstance = function (key) {
        if (!key) {
            return null;
        } else if (ns.type.Object.isinstance(key, SymmetricKey)) {
            return key;
        }
        var algorithm = key['algorithm'];
        var clazz = key_classes[algorithm];
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
