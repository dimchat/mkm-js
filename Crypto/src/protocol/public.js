'use strict';
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

/** Asymmetric Cryptography Public Key
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *  key data format: {
 *      algorithm : "RSA", // "ECC", ...
 *      data      : "{BASE64_ENCODE}",
 *      ...
 *  }
 */
mk.protocol.PublicKey = Interface(null, [VerifyKey]);
var PublicKey = mk.protocol.PublicKey;

// PublicKey.RSA = AsymmetricKey.RSA;
// PublicKey.ECC = AsymmetricKey.ECC;

//
//  Factory methods
//

/**
 *  Parse map object to key
 *
 * @param {*} key - key info
 * @return {mk.protocol.PublicKey}
 */
PublicKey.parse = function (key) {
    var helper = CryptoExtensions.getPublicHelper();
    return helper.parsePublicKey(key);
};

/**
 *  Register public key factory with algorithm
 *
 * @param {string} algorithm
 * @param {mk.protocol.PublicKey.Factory} factory
 */
PublicKey.setFactory = function (algorithm, factory) {
    var helper = CryptoExtensions.getPublicHelper();
    helper.setPublicKeyFactory(algorithm, factory);
};
PublicKey.getFactory = function (algorithm) {
    var helper = CryptoExtensions.getPublicHelper();
    return helper.getPublicKeyFactory(algorithm);
};

/**
 *  Public Key Factory
 *  ~~~~~~~~~~~~~~~~~~
 */
PublicKey.Factory = Interface(null, null);
var PublicKeyFactory = PublicKey.Factory;

PublicKeyFactory.prototype = {

    /**
     *  Parse map object to key
     *
     * @param {*} key - key info
     * @return {mk.protocol.PublicKey}
     */
    parsePublicKey: function (key) {}

};
