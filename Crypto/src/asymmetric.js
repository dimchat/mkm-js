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

(function (ns) {
    'use strict';

    const CryptographyKey = ns.crypto.CryptographyKey;

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
    const AsymmetricKey = function (key) {
        CryptographyKey.call(this, key);
    };
    ns.Class(AsymmetricKey, CryptographyKey, null);

    AsymmetricKey.RSA = 'RSA'; //-- "RSA/ECB/PKCS1Padding", "SHA256withRSA"
    AsymmetricKey.ECC = 'ECC';

    //-------- namespace --------
    ns.crypto.AsymmetricKey = AsymmetricKey;

    ns.crypto.register('AsymmetricKey');

})(DIMP);

(function (ns) {
    'use strict';

    const UTF8 = ns.format.UTF8;

    const CryptographyKey = ns.crypto.CryptographyKey;
    const AsymmetricKey = ns.crypto.AsymmetricKey;
    const VerifyKey = ns.crypto.VerifyKey;

    const promise = UTF8.encode('Moky loves May Lee forever!');

    const PublicKey = function (key) {
        AsymmetricKey.call(this, key);
    };
    ns.Class(PublicKey, AsymmetricKey, [VerifyKey]);

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
        const publicKey = privateKey.getPublicKey();
        if (this.equals(publicKey)) {
            return true;
        }
        // 2. try to verify the SK's signature
        const signature = privateKey.sign(promise);
        return this.verify(promise, signature);
    };

    //-------- runtime --------
    const public_key_classes = {};

    /**
     *  Register symmetric key class with algorithm
     *
     * @param {String} algorithm - key algorithm
     * @param {Class} clazz - if key class is None, then remove with algorithm
     */
    PublicKey.register = function (algorithm, clazz) {
        public_key_classes[algorithm] = clazz;
    };

    /**
     *  Create symmetric key
     *
     * @param {{}|PublicKey} key - key info (with algorithm='AES')
     * @returns {PublicKey}
     */
    PublicKey.getInstance = function (key) {
        if (!key) {
            return null;
        } else if (key instanceof PublicKey) {
            return key;
        }
        const algorithm = key['algorithm'];
        const clazz = public_key_classes[algorithm];
        if (typeof clazz === 'function') {
            // noinspection JSValidateTypes
            return CryptographyKey.createInstance(clazz, key);
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };

    //-------- namespace --------
    ns.crypto.PublicKey = PublicKey;

    ns.crypto.register('PublicKey');

})(DIMP);

(function (ns) {
    'use strict';

    const CryptographyKey = ns.crypto.CryptographyKey;
    const AsymmetricKey = ns.crypto.AsymmetricKey;
    const SignKey = ns.crypto.SignKey;

    const PrivateKey = function (key) {
        AsymmetricKey.call(this, key);
    };
    ns.Class(PrivateKey, AsymmetricKey, [SignKey]);

    /**
     *  Check whether keys equal
     *
     * @param {PrivateKey} other - another private key
     * @returns {boolean}
     */
    PrivateKey.prototype.equals = function (other) {
        const publicKey = this.getPublicKey();
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
     * @param {String} algorithm - algorithm name ('RSA')
     * @returns {PrivateKey}
     */
    PrivateKey.generate = function (algorithm) {
        return this.getInstance({algorithm: algorithm});
    };

    //-------- runtime --------
    const private_key_classes = {};

    /**
     *  Register symmetric key class with algorithm
     *
     * @param {String} algorithm - key algorithm
     * @param {Class} clazz - if key class is None, then remove with algorithm
     */
    PrivateKey.register = function (algorithm, clazz) {
        private_key_classes[algorithm] = clazz;
    };

    /**
     *  Create symmetric key
     *
     * @param {{}|PrivateKey} key - key info (with algorithm='AES')
     * @returns {PrivateKey}
     */
    PrivateKey.getInstance = function (key) {
        if (!key) {
            return null;
        } else if (key instanceof PrivateKey) {
            return key;
        }
        const algorithm = key['algorithm'];
        const clazz = private_key_classes[algorithm];
        if (typeof clazz === 'function') {
            // noinspection JSValidateTypes
            return CryptographyKey.createInstance(clazz, key);
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };

    //-------- namespace --------
    ns.crypto.PrivateKey = PrivateKey;

    ns.crypto.register('PrivateKey');

})(DIMP);
