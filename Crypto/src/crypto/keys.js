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

//! require 'type/class.js'
//! require 'type/dictionary.js'


/**
 *  Cryptography Key
 *  ~~~~~~~~~~~~~~~~
 *  Cryptography key with designated algorithm
 *
 *  key data format: {
 *      algorithm : "RSA", // ECC, AES, ...
 *      data      : "{BASE64_ENCODE}",
 *      ...
 *  }
 */
mk.crypto.CryptographyKey = Interface(null, [Mapper], {

    /**
     *  Get key algorithm name
     *
     * @return {String} algorithm name
     */
    getAlgorithm: function () {},

    /**
     *  Get key data
     *
     * @return {Uint8Array}
     */
    getData: function () {}

});
var CryptographyKey = mk.crypto.CryptographyKey;

mk.crypto.EncryptKey = Interface(null, [CryptographyKey], {

    /**
     *  1. Symmetric Key:
     *     ciphertext = encrypt(plaintext, PW)
     *  2. Asymmetric Public Key:
     *     ciphertext = encrypt(plaintext, PK)
     *
     * @param {Uint8Array} plaintext - plain data
     * @param {*} extra              - store extra variables ('IV' for 'AES')
     * @return {Uint8Array} ciphertext
     */
    encrypt: function (plaintext, extra) {}

});
var EncryptKey = mk.crypto.EncryptKey;

mk.crypto.DecryptKey = Interface(null, [CryptographyKey], {

    /**
     *  1. Symmetric Key:
     *     plaintext = decrypt(ciphertext, PW);
     *  2. Asymmetric Private Key:
     *     plaintext = decrypt(ciphertext, SK);
     *
     * @param {Uint8Array} ciphertext - encrypted data
     * @param {*} params              - extra params ('IV' for 'AES')
     * @return {Uint8Array} plaintext
     */
    decrypt: function (ciphertext, params) {},

    /**
     *  OK = decrypt(encrypt(data, SK), PK) == data
     *
     * @param {EncryptKey} pKey - encrypt key
     * @return {boolean} true on signature matched
     */
    matchEncryptKey: function (pKey) {}

});
var DecryptKey = mk.crypto.DecryptKey;


/**
 *  Asymmetric Cryptography Key
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *  key data format: {
 *      algorithm : "RSA", // "ECC", ...
 *      data      : "{BASE64_ENCODE}",
 *      ...
 *  }
 */
mk.crypto.AsymmetricKey = Interface(null, [CryptographyKey], null);
var AsymmetricKey = mk.crypto.AsymmetricKey;

// AsymmetricKey.RSA = 'RSA'; //-- "RSA/ECB/PKCS1Padding", "SHA256withRSA"
// AsymmetricKey.ECC = 'ECC';

mk.crypto.SignKey = Interface(null, [AsymmetricKey], {

    /**
     *  signature = sign(data, SK);
     *
     * @param {Uint8Array} data
     * @return {Uint8Array}
     */
    sign: function (data) {}

});
var SignKey = mk.crypto.SignKey;

mk.crypto.VerifyKey = Interface(null, [AsymmetricKey], {

    /**
     *  OK = verify(data, signature, PK)
     *
     * @param {Uint8Array} data
     * @param {Uint8Array} signature
     * @return {boolean}
     */
    verify: function (data, signature) {},

    /**
     *  OK = verify(data, sign(data, SK), PK)
     *
     * @param {SignKey} sKey - private key
     * @return {boolean} true on signature matched
     */
    matchSignKey: function (sKey) {}

});
var VerifyKey = mk.crypto.VerifyKey;
