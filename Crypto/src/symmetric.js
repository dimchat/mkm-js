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

//! require 'dictionary.js'
//! require 'cryptography.js'

(function (ns) {
    'use strict';

    var CryptographyKey = ns.crypto.CryptographyKey;

    var EncryptKey = function () {
    };
    ns.Interface(EncryptKey, [CryptographyKey]);
    // noinspection JSUnusedLocalSymbols
    /**
     *  ciphertext = encrypt(plaintext, PW)
     *  ciphertext = encrypt(plaintext, PK)
     *
     * @param {Uint8Array} plaintext
     * @return {Uint8Array}
     */
    EncryptKey.prototype.encrypt = function (plaintext) {
        console.assert(false, 'implement me!');
        return null;
    };

    var DecryptKey = function () {
    };
    ns.Interface(DecryptKey, [CryptographyKey]);
    // noinspection JSUnusedLocalSymbols
    /**
     *  plaintext = decrypt(ciphertext, PW);
     *  plaintext = decrypt(ciphertext, SK);
     *
     * @param {Uint8Array} ciphertext
     * @return {Uint8Array}
     */
    DecryptKey.prototype.decrypt = function (ciphertext) {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;

    ns.crypto.register('EncryptKey');
    ns.crypto.register('DecryptKey');

})(DIMP);

(function (ns) {
    'use strict';

    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;

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
    ns.Interface(SymmetricKey, [EncryptKey, DecryptKey]);

    SymmetricKey.AES = 'AES'; //-- "AES/CBC/PKCS7Padding"
    SymmetricKey.DES = 'DES';

    /**
     *  Generate key with algorithm name
     *
     * @param {String} algorithm - algorithm name ('AES')
     * @return {SymmetricKey}
     */
    SymmetricKey.generate = function (algorithm) {
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            throw ReferenceError('key algorithm not support: ' + algorithm);
        }
        return factory.generateSymmetricKey();
    };

    /**
     *  Parse map object to key
     *
     * @param {{String:Object}} key - key info
     * @return {SymmetricKey}
     */
    SymmetricKey.parse = function (key) {
        if (!key) {
            return null;
        } else if (key instanceof SymmetricKey) {
            return key;
        }
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            factory = SymmetricKey.getFactory('*');  // unknown
        }
        return factory.parseSymmetricKey(key);
    }

    /**
     *  Register symmetric key class with algorithm
     *
     * @param {String} algorithm
     * @param {SymmetricKeyFactory} factory
     */
    SymmetricKey.register = function (algorithm, factory) {
        s_factories[algorithm] = factory;
    };
    SymmetricKey.getFactory = function (algorithm) {
        return s_factories[algorithm];
    }

    var s_factories = {};

    /**
     *  Key Factory
     *  ~~~~~~~~~~~
     */
    var SymmetricKeyFactory = function () {
    };
    ns.Interface(SymmetricKeyFactory, null);
    /**
     *  Generate key
     *
     * @return {SymmetricKey}
     */
    SymmetricKeyFactory.prototype.generateSymmetricKey = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Parse map object to key
     *
     * @param {{String:Object}} key - key info
     * @return {SymmetricKey}
     */
    SymmetricKeyFactory.prototype.parseSymmetricKey = function (key) {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.SymmetricKeyFactory = SymmetricKeyFactory;

    ns.crypto.register('SymmetricKey');
    ns.crypto.register('SymmetricKeyFactory');

})(DIMP);
