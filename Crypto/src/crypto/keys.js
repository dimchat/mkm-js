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

//! require 'arrays.js'
//! require 'utf8.js'

(function (ns) {
    'use strict';

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
    var CryptographyKey = function () {};
    ns.Interface(CryptographyKey, [Mapper]);

    /**
     *  Get key algorithm name
     *
     * @return {String} algorithm name
     */
    CryptographyKey.prototype.getAlgorithm = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get key data
     *
     * @return {Uint8Array}
     */
    CryptographyKey.prototype.getData = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    var EncryptKey = function () {};
    ns.Interface(EncryptKey, [CryptographyKey]);

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

    var DecryptKey = function () {};
    ns.Interface(DecryptKey, [CryptographyKey]);

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
    /**
     *  OK = decrypt(encrypt(data, SK), PK) == data
     *
     * @param {EncryptKey} pKey - encrypt key
     * @return {boolean} true on signature matched
     */
    DecryptKey.prototype.matches = function (pKey) {
        console.assert(false, 'implement me!');
        return false;
    };

    //-------- namespace --------
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;

    ns.crypto.registers('CryptographyKey');
    ns.crypto.registers('EncryptKey');
    ns.crypto.registers('DecryptKey');

})(MONKEY);

(function (ns) {
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
    var AsymmetricKey = function () {};
    ns.Interface(AsymmetricKey, [CryptographyKey]);

    AsymmetricKey.RSA = 'RSA'; //-- "RSA/ECB/PKCS1Padding", "SHA256withRSA"
    AsymmetricKey.ECC = 'ECC';

    var SignKey = function () {};
    ns.Interface(SignKey, [AsymmetricKey]);

    /**
     *  signature = sign(data, SK);
     *
     * @param {Uint8Array} data
     * @return {Uint8Array}
     */
    SignKey.prototype.sign = function (data) {
        console.assert(false, 'implement me!');
        return null;
    };

    var VerifyKey = function () {};
    ns.Interface(VerifyKey, [AsymmetricKey]);

    /**
     *  OK = verify(data, signature, PK)
     *
     * @param {Uint8Array} data
     * @param {Uint8Array} signature
     * @return {boolean}
     */
    VerifyKey.prototype.verify = function (data, signature) {
        console.assert(false, 'implement me!');
        return false;
    };

    /**
     *  OK = verify(data, sign(data, SK), PK)
     *
     * @param {SignKey} sKey - private key
     * @return {boolean} true on signature matched
     */
    VerifyKey.prototype.matches = function (sKey) {
        console.assert(false, 'implement me!');
        return false;
    };

    //-------- namespace --------
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;

    ns.crypto.registers('AsymmetricKey');
    ns.crypto.registers('SignKey');
    ns.crypto.registers('VerifyKey');

})(MONKEY);

(function (ns) {
    'use strict';

    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;

    CryptographyKey.getAlgorithm = function (key) {
        return key['algorithm'];
    };

    // sample data for checking keys
    CryptographyKey.promise = ns.format.UTF8.encode('Moky loves May Lee forever!');

    /**
     *  Check key pair by encryption
     *
     * @param {SignKey}   sKey
     * @param {VerifyKey} pKey
     */
    AsymmetricKey.matches = function (sKey, pKey) {
        // check by encryption
        var promise = CryptographyKey.promise;
        var signature = sKey.sign(promise);
        return pKey.verify(promise, signature);
    };

})(MONKEY);
