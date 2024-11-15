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

//! require 'type/class.js'
//! require 'type/dictionary.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;

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
    var CryptographyKey = Interface(null, [Mapper]);

    /**
     *  Get key algorithm name
     *
     * @return {String} algorithm name
     */
    CryptographyKey.prototype.getAlgorithm = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Get key data
     *
     * @return {Uint8Array}
     */
    CryptographyKey.prototype.getData = function () {
        throw new Error('NotImplemented');
    };

    var EncryptKey = Interface(null, [CryptographyKey]);

    /**
     *  ciphertext = encrypt(plaintext, PW)
     *  ciphertext = encrypt(plaintext, PK)
     *
     * @param {Uint8Array} plaintext - plain data
     * @param {*} extra              - store extra variables ('IV' for 'AES')
     * @return {Uint8Array}
     */
    EncryptKey.prototype.encrypt = function (plaintext, extra) {
        throw new Error('NotImplemented');
    };

    var DecryptKey = Interface(null, [CryptographyKey]);

    /**
     *  plaintext = decrypt(ciphertext, PW);
     *  plaintext = decrypt(ciphertext, SK);
     *
     * @param {Uint8Array} ciphertext - encrypted data
     * @param {*} params              - extra params ('IV' for 'AES')
     * @return {Uint8Array}
     */
    DecryptKey.prototype.decrypt = function (ciphertext, params) {
        throw new Error('NotImplemented');
    };

    /**
     *  OK = decrypt(encrypt(data, SK), PK) == data
     *
     * @param {EncryptKey} pKey - encrypt key
     * @return {boolean} true on signature matched
     */
    DecryptKey.prototype.matchEncryptKey = function (pKey) {
        throw new Error('NotImplemented');
    };

    //-------- namespace --------
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;

})(MONKEY);

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
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
    var AsymmetricKey = Interface(null, [CryptographyKey]);

    AsymmetricKey.RSA = 'RSA'; //-- "RSA/ECB/PKCS1Padding", "SHA256withRSA"
    AsymmetricKey.ECC = 'ECC';

    var SignKey = Interface(null, [AsymmetricKey]);

    /**
     *  signature = sign(data, SK);
     *
     * @param {Uint8Array} data
     * @return {Uint8Array}
     */
    SignKey.prototype.sign = function (data) {
        throw new Error('NotImplemented');
    };

    var VerifyKey = Interface(null, [AsymmetricKey]);

    /**
     *  OK = verify(data, signature, PK)
     *
     * @param {Uint8Array} data
     * @param {Uint8Array} signature
     * @return {boolean}
     */
    VerifyKey.prototype.verify = function (data, signature) {
        throw new Error('NotImplemented');
    };

    /**
     *  OK = verify(data, sign(data, SK), PK)
     *
     * @param {SignKey} sKey - private key
     * @return {boolean} true on signature matched
     */
    VerifyKey.prototype.matchSignKey = function (sKey) {
        throw new Error('NotImplemented');
    };

    //-------- namespace --------
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;

})(MONKEY);
