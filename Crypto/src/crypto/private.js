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

//! require 'keys.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;

    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;


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
    var PrivateKey = Interface(null, [SignKey]);

    PrivateKey.RSA = AsymmetricKey.RSA;
    PrivateKey.ECC = AsymmetricKey.ECC;

    /**
     *  Create public key from this private key
     *
     * @return {PublicKey}
     */
    PrivateKey.prototype.getPublicKey = function () {};

    //
    //  Factory methods
    //

    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory;
    };

    /**
     *  Generate key with algorithm name
     *
     * @param {string} algorithm - algorithm name ('RSA', 'ECC')
     * @return {PrivateKey}
     */
    PrivateKey.generate = function (algorithm) {
        var gf = general_factory();
        return gf.generatePrivateKey(algorithm);
    };

    /**
     *  Parse map object to key
     *
     * @param {*} key - key info
     * @return {PrivateKey}
     */
    PrivateKey.parse = function (key) {
        var gf = general_factory();
        return gf.parsePrivateKey(key);
    };

    /**
     *  Register private key factory with algorithm
     *
     * @param {string} algorithm
     * @param {PrivateKeyFactory} factory
     */
    PrivateKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setPrivateKeyFactory(algorithm, factory);
    };
    PrivateKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getPrivateKeyFactory(algorithm);
    };

    /**
     *  Private Key Factory
     *  ~~~~~~~~~~~~~~~~~~~
     */
    var PrivateKeyFactory = Interface(null, null);

    /**
     *  Generate key
     *
     * @return {PrivateKey}
     */
    PrivateKeyFactory.prototype.generatePrivateKey = function () {};


    /**
     *  Parse map object to key
     *
     * @param {*} key - key info
     * @return {PrivateKey}
     */
    PrivateKeyFactory.prototype.parsePrivateKey = function (key) {};

    PrivateKey.Factory = PrivateKeyFactory;

    //-------- namespace --------
    ns.crypto.PrivateKey = PrivateKey;
    // ns.crypto.PrivateKeyFactory = PrivateKeyFactory;

})(MONKEY);
