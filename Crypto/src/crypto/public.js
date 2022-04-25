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

//! require 'asymmetric.js'

(function (ns) {
    'use strict';

    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;

    var PublicKey = function () {};
    ns.Interface(PublicKey, [VerifyKey]);

    PublicKey.RSA = AsymmetricKey.RSA;
    PublicKey.ECC = AsymmetricKey.ECC;

    /**
     *  Key Factory
     *  ~~~~~~~~~~~
     */
    var PublicKeyFactory = function () {};
    ns.Interface(PublicKeyFactory, null);

    // noinspection JSUnusedLocalSymbols
    PublicKeyFactory.prototype.parsePublicKey = function (key) {
        console.assert(false, 'implement me!');
        return null;
    };

    PublicKey.Factory = PublicKeyFactory;

    //
    //  Instances of PublicKey.Factory
    //
    var s_public_factories = {};  // algorithm(String) -> PublicKeyFactory

    /**
     *  Register public key factory with algorithm
     *
     * @param {String} algorithm
     * @param {PublicKeyFactory} factory
     */
    PublicKey.setFactory = function (algorithm, factory) {
        s_public_factories[algorithm] = factory;
    };
    PublicKey.getFactory = function (algorithm) {
        return s_public_factories[algorithm];
    };

    /**
     *  Parse map object to key
     *
     * @param {*} key - key info
     * @return {PublicKey}
     */
    PublicKey.parse = function (key) {
        if (!key) {
            return null;
        } else if (ns.Interface.conforms(key, PublicKey)) {
            return key;
        }
        key = ns.type.Wrapper.fetchMap(key);
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PublicKey.getFactory(algorithm);
        if (!factory) {
            factory = PublicKey.getFactory('*');  // unknown
        }
        return factory.parsePublicKey(key);
    };

    //-------- namespace --------
    ns.crypto.PublicKey = PublicKey;

    ns.crypto.registers('PublicKey');

})(MONKEY);
