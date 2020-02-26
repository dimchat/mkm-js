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
    var AsymmetricKey = function (key) {
        CryptographyKey.call(this, key);
    };
    ns.Class(AsymmetricKey, CryptographyKey, null);

    AsymmetricKey.RSA = 'RSA'; //-- "RSA/ECB/PKCS1Padding", "SHA256withRSA"
    AsymmetricKey.ECC = 'ECC';

    //-------- namespace --------
    ns.crypto.AsymmetricKey = AsymmetricKey;

    ns.crypto.register('AsymmetricKey');

}(DIMP);

!function (ns) {
    'use strict';

    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;

    var promise = 'Moky loves May Lee forever!';
    promise = ns.type.String.from(promise).getBytes(null);

    var PublicKey = function (key) {
        AsymmetricKey.call(this, key);
    };
    ns.Class(PublicKey, AsymmetricKey, VerifyKey);

    /**
     *  Check if this pubic key paired with the private key
     *
     * @param privateKey
     * @returns {boolean}
     */
    PublicKey.prototype.matches = function (privateKey) {
        if (!privateKey) {
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
     * @param algorithm {String} - key algorithm
     * @param clazz {Class} - if key class is None, then remove with algorithm
     */
    PublicKey.register = function (algorithm, clazz) {
        public_key_classes[algorithm] = clazz;
    };

    /**
     *  Create symmetric key
     *
     * @param key {{}|PublicKey} - key info (with algorithm='AES')
     * @returns {PublicKey}
     */
    PublicKey.getInstance = function (key) {
        if (!key) {
            return null;
        } else if (key instanceof PublicKey) {
            return key;
        }
        var algorithm = key['algorithm'];
        var clazz = public_key_classes[algorithm];
        if (typeof clazz === 'function') {
            // noinspection JSValidateTypes
            return CryptographyKey.createInstance(clazz, key);
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };

    //-------- namespace --------
    ns.crypto.PublicKey = PublicKey;

    ns.crypto.register('PublicKey');

}(DIMP);

!function (ns) {
    'use strict';

    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;

    var PrivateKey = function (key) {
        AsymmetricKey.call(this, key);
    };
    ns.Class(PrivateKey, AsymmetricKey, SignKey);

    /**
     *  Check whether keys equal
     *
     * @param other {PrivateKey}
     * @returns {boolean}
     */
    PrivateKey.prototype.equals = function (other) {
        var publicKey = this.getPublicKey();
        if (!publicKey) {
            return false;
        }
        return publicKey.matches(other);
    };

    /**
     *  Create public key from this private key
     *
     * @returns {PublicKey}
     */
    PrivateKey.prototype.getPublicKey = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Generate key with algorithm name
     *
     * @param algorithm {String} - algorithm name ('AES')
     * @returns {PrivateKey}
     */
    PrivateKey.generate = function (algorithm) {
        return this.getInstance({algorithm: algorithm});
    };

    //-------- runtime --------
    var private_key_classes = {};

    /**
     *  Register symmetric key class with algorithm
     *
     * @param algorithm {String} - key algorithm
     * @param clazz {Class} - if key class is None, then remove with algorithm
     */
    PrivateKey.register = function (algorithm, clazz) {
        private_key_classes[algorithm] = clazz;
    };

    /**
     *  Create symmetric key
     *
     * @param key {{}|PrivateKey} - key info (with algorithm='AES')
     * @returns {PrivateKey}
     */
    PrivateKey.getInstance = function (key) {
        if (!key) {
            return null;
        } else if (key instanceof PrivateKey) {
            return key;
        }
        var algorithm = key['algorithm'];
        var clazz = private_key_classes[algorithm];
        if (typeof clazz === 'function') {
            // noinspection JSValidateTypes
            return CryptographyKey.createInstance(clazz, key);
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };

    //-------- namespace --------
    ns.crypto.PrivateKey = PrivateKey;

    ns.crypto.register('PrivateKey');

}(DIMP);
