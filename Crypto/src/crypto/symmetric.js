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

//! require 'cryptography.js'

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
    var SymmetricKey = function () {};
    ns.Interface(SymmetricKey, [EncryptKey, DecryptKey]);

    SymmetricKey.AES = 'AES'; //-- "AES/CBC/PKCS7Padding"
    SymmetricKey.DES = 'DES';

    /**
     *  Check key pair by encryption
     *
     * @param {EncryptKey} pKey
     * @param {DecryptKey} sKey
     */
    SymmetricKey.matches = function (pKey, sKey) {
        // check by encryption
        var promise = CryptographyKey.getPromise();
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

    /**
     *  Key Factory
     *  ~~~~~~~~~~~
     */
    var SymmetricKeyFactory = function () {};
    ns.Interface(SymmetricKeyFactory, null);

    SymmetricKeyFactory.prototype.generateSymmetricKey = function () {
        ns.assert(false, 'implement me!');
        return null;
    };

    SymmetricKeyFactory.prototype.parseSymmetricKey = function (key) {
        ns.assert(false, 'implement me!');
        return null;
    };

    SymmetricKey.Factory = SymmetricKeyFactory;

    //
    //  Instances of SymmetricKey.Factory
    //
    var s_symmetric_factories = {};  // algorithm(String) -> SymmetricKeyFactory

    /**
     *  Register symmetric key factory with algorithm
     *
     * @param {String} algorithm
     * @param {SymmetricKeyFactory} factory
     */
    SymmetricKey.setFactory = function (algorithm, factory) {
        s_symmetric_factories[algorithm] = factory;
    };
    SymmetricKey.getFactory = function (algorithm) {
        return s_symmetric_factories[algorithm];
    };

    /**
     *  Generate key with algorithm name
     *
     * @param {String} algorithm - algorithm name ('AES')
     * @return {SymmetricKey}
     */
    SymmetricKey.generate = function (algorithm) {
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            throw new ReferenceError('key algorithm not support: ' + algorithm);
        }
        return factory.generateSymmetricKey();
    };

    /**
     *  Parse map object to key
     *
     * @param {*} key - key info
     * @return {SymmetricKey}
     */
    SymmetricKey.parse = function (key) {
        if (!key) {
            return null;
        } else if (ns.Interface.conforms(key, SymmetricKey)) {
            return key;
        }
        key = ns.type.Wrapper.fetchMap(key);
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            factory = SymmetricKey.getFactory('*');  // unknown
        }
        return factory.parseSymmetricKey(key);
    };

    //-------- namespace --------
    ns.crypto.SymmetricKey = SymmetricKey;

    ns.crypto.registers('SymmetricKey');

})(MONKEY);
