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
//! require 'cryptography.js'

!function (dimp) {
    'use strict';

    var CryptographyKey = dimp.crypto.CryptographyKey;

    //
    //  Asymmetric Cryptography Key
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    //  key data format: {
    //      algorithm : "RSA", // "ECC", ...
    //      data      : "{BASE64_ENCODE}",
    //      ...
    //  }
    //
    var AsymmetricKey = function () {
    };
    AsymmetricKey.inherits(CryptographyKey);

    AsymmetricKey.RSA = 'RSA'; //-- "RSA/ECB/PKCS1Padding", "SHA256withRSA"
    AsymmetricKey.ECC = 'ECC';

    //-------- namespace --------
    dimp.crypto.AsymmetricKey = AsymmetricKey;

}(DIMP);

!function (dimp) {
    'use strict';

    var CryptographyKey = dimp.crypto.CryptographyKey;
    var AsymmetricKey = dimp.crypto.AsymmetricKey;
    var VerifyKey = dimp.crypto.VerifyKey;

    var promise = new dimp.type.String('Moky loves May Lee forever!');
    promise = promise.getBytes();

    var PublicKey = function () {
    };
    PublicKey.inherits(AsymmetricKey, VerifyKey);

    PublicKey.prototype.matches = function (privateKey) {
        if (privateKey === null) {
            return false;
        }
        // 1. if the SK has the same public key, return true
        var publicKey = privateKey.getPublicKey();
        if (this.equals(publicKey)) {
            return true;
        }
        // 2. try to verify the SK's signature
        var signature = privateKey.sign(promise);
        return this.verify(promise, signature);
    };

    //-------- runtime --------
    var public_key_classes = {};

    /**
     *  Register symmetric key class with algorithm
     *
     * @param algorithm - key algorithm
     * @param clazz - if key class is None, then remove with algorithm
     */
    PublicKey.register = function (algorithm, clazz) {
        public_key_classes[algorithm] = clazz;
    };

    /**
     *  Create symmetric key
     *
     * @param key - key info (with algorithm='AES')
     * @returns {null|SymmetricKey}
     */
    PublicKey.getInstance = function (key) {
        if (key === null) {
            return null;
        } else if (key instanceof PublicKey) {
            return key;
        }
        var algorithm = key['algorithm'];
        var clazz = public_key_classes[algorithm];
        if (typeof clazz === 'function') {
            return CryptographyKey.createInstance(clazz, key);
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };

    //-------- namespace --------
    dimp.crypto.PublicKey = PublicKey;

}(DIMP);

!function (dimp) {
    'use strict';

    var CryptographyKey = dimp.crypto.CryptographyKey;
    var AsymmetricKey = dimp.crypto.AsymmetricKey;
    var SignKey = dimp.crypto.SignKey;

    var PrivateKey = function () {
    };
    PrivateKey.inherits(AsymmetricKey, SignKey);

    PrivateKey.prototype.equals = function (other) {
        var publicKey = this.getPublicKey();
        if (publicKey === null) {
            return false;
        }
        return publicKey.matches(other);
    };

    PrivateKey.prototype.getPublicKey = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Generate key with algorithm name
     *
     * @param algorithm - algorithm name ('AES')
     * @returns {SymmetricKey}
     */
    PrivateKey.generate = function (algorithm) {
        return this.getInstance({algorithm: algorithm});
    };

    //-------- runtime --------
    var private_key_classes = {};

    /**
     *  Register symmetric key class with algorithm
     *
     * @param algorithm - key algorithm
     * @param clazz - if key class is None, then remove with algorithm
     */
    PrivateKey.register = function (algorithm, clazz) {
        private_key_classes[algorithm] = clazz;
    };

    /**
     *  Create symmetric key
     *
     * @param key - key info (with algorithm='AES')
     * @returns {null|SymmetricKey}
     */
    PrivateKey.getInstance = function (key) {
        if (key === null) {
            return null;
        } else if (key instanceof PrivateKey) {
            return key;
        }
        var algorithm = key['algorithm'];
        var clazz = private_key_classes[algorithm];
        if (typeof clazz === 'function') {
            return CryptographyKey.createInstance(clazz, key);
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };

    //-------- namespace --------
    dimp.crypto.PrivateKey = PrivateKey;

}(DIMP);
