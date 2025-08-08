;
// license: https://mit-license.org
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2025 Albert Moky
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


/**
 *  CryptographyKey GeneralFactory
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
mk.plugins.GeneralCryptoHelper = Interface(null, null);
var GeneralCryptoHelper = mk.plugins.GeneralCryptoHelper;

GeneralCryptoHelper.prototype = {

    //
    //  Algorithm
    //
    getKeyAlgorithm: function (key, defaultValue) {}

};

/**
 *  Sample data for checking keys
 */
GeneralCryptoHelper.PROMISE = 'Moky loves May Lee forever!';

var sample_data = function () {
    var promise = GeneralCryptoHelper.PROMISE;
    if (promise instanceof Uint8Array) {
        return promise;
    } else {
        var data = UTF8.encode(promise);
        GeneralCryptoHelper.PROMISE = data;
        return data;
    }
};

/**
 *  Compare asymmetric keys
 *
 * @param {mk.crypto.SignKey} sKey
 * @param {mk.crypto.VerifyKey} pKey
 * @return true on signature matched
 */
GeneralCryptoHelper.matchAsymmetricKeys = function (sKey, pKey) {
    var promise = sample_data();
    // verify with signature
    var signature = sKey.sign(promise);
    return pKey.verify(promise, signature);
};

/**
 *  Compare symmetric keys
 *
 * @param {mk.crypto.EncryptKey} encKey
 * @param {mk.crypto.DecryptKey} decKey
 */
GeneralCryptoHelper.matchSymmetricKeys = function (encKey, decKey) {
    var promise = sample_data();
    var params = {};
    // check by encryption
    var ciphertext = encKey.encrypt(promise, params);
    var plaintext = decKey.decrypt(ciphertext, params);
    return plaintext && Arrays.equals(plaintext, promise);
};


/**
 *  CryptographyKey FactoryManager
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
mk.plugins.SharedCryptoExtensions = {

    //
    //  Public Key
    //
    setPublicHelper: function (helper) {
        CryptoExtensions.setPublicHelper(helper);
    },
    getPublicHelper: function () {
        return CryptoExtensions.getPublicHelper();
    },

    //
    //  Private Key
    //
    setPrivateHelper: function (helper) {
        CryptoExtensions.setPrivateHelper(helper);
    },
    getPrivateHelper: function () {
        return CryptoExtensions.getPrivateHelper();
    },

    //
    //  Symmetric Key
    //
    setSymmetricHelper: function (helper) {
        CryptoExtensions.setSymmetricHelper(helper);
    },
    getSymmetricHelper: function () {
        return CryptoExtensions.getSymmetricHelper();
    },

    //
    //  General Helper
    //
    setHelper: function (helper) {
        cryptoHelper = helper;
    },
    getHelper: function () {
        return cryptoHelper;
    }

};
var SharedCryptoExtensions = mk.plugins.SharedCryptoExtensions;

var cryptoHelper = null;
