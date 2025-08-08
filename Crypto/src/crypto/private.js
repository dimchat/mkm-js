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

//! require 'keys.js'

/** Asymmetric Cryptography Private Key
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  This class is used to decrypt symmetric key or sign message data
 *
 *  key data format: {
 *      algorithm : "RSA", // "ECC", ...
 *      data      : "{BASE64_ENCODE}",
 *      ...
 *  }
 */
mk.crypto.PrivateKey = Interface(null, [SignKey]);
var PrivateKey = mk.crypto.PrivateKey;

PrivateKey.prototype = {

    /**
     *  Create public key from this private key
     *
     * @return {mk.crypto.PublicKey}
     */
    getPublicKey: function () {}

};

// PrivateKey.RSA = AsymmetricKey.RSA;
// PrivateKey.ECC = AsymmetricKey.ECC;

//
//  Factory methods
//

/**
 *  Generate key with algorithm name
 *
 * @param {string} algorithm - algorithm name ('RSA', 'ECC')
 * @return {mk.crypto.PrivateKey}
 */
PrivateKey.generate = function (algorithm) {
    var helper = CryptoExtensions.getPrivateHelper();
    return helper.generatePrivateKey(algorithm);
};

/**
 *  Parse map object to key
 *
 * @param {*} key - key info
 * @return {mk.crypto.PrivateKey}
 */
PrivateKey.parse = function (key) {
    var helper = CryptoExtensions.getPrivateHelper();
    return helper.parsePrivateKey(key);
};

/**
 *  Register private key factory with algorithm
 *
 * @param {string} algorithm
 * @param {mk.crypto.PrivateKey.Factory} factory
 */
PrivateKey.setFactory = function (algorithm, factory) {
    var helper = CryptoExtensions.getPrivateHelper();
    helper.setPrivateKeyFactory(algorithm, factory);
};
PrivateKey.getFactory = function (algorithm) {
    var helper = CryptoExtensions.getPrivateHelper();
    return helper.getPrivateKeyFactory(algorithm);
};


/**
 *  Private Key Factory
 *  ~~~~~~~~~~~~~~~~~~~
 */
PrivateKey.Factory = Interface(null, null);
var PrivateKeyFactory = PrivateKey.Factory;

PrivateKeyFactory.prototype = {

    /**
     *  Generate key
     *
     * @return {mk.crypto.PrivateKey}
     */
    generatePrivateKey: function () {},


    /**
     *  Parse map object to key
     *
     * @param {*} key - key info
     * @return {mk.crypto.PrivateKey}
     */
    parsePrivateKey: function (key) {}

};
