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
    var SignKey = ns.crypto.SignKey;

    var PrivateKey = function () {};
    ns.Interface(PrivateKey, [SignKey]);

    PrivateKey.RSA = AsymmetricKey.RSA;
    PrivateKey.ECC = AsymmetricKey.ECC;

    /**
     *  Create public key from this private key
     *
     * @return {PublicKey}
     */
    PrivateKey.prototype.getPublicKey = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Key Factory
     *  ~~~~~~~~~~~
     */
    var PrivateKeyFactory = function () {};
    ns.Interface(PrivateKeyFactory, null);

    /**
     *  Generate key
     *
     * @return {PrivateKey}
     */
    PrivateKeyFactory.prototype.generatePrivateKey = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Parse map object to key
     *
     * @param {{}} key - key info
     * @return {PrivateKey}
     */
    PrivateKeyFactory.prototype.parsePrivateKey = function (key) {
        console.assert(false, 'implement me!');
        return null;
    };

    PrivateKey.Factory = PrivateKeyFactory;

    //
    //  Instances of PrivateKey.Factory
    //
    var s_factories = {};  // algorithm(String) -> PrivateKeyFactory

    /**
     *  Register private key factory with algorithm
     *
     * @param {String} algorithm
     * @param {PrivateKeyFactory} factory
     */
    PrivateKey.setFactory = function (algorithm, factory) {
        s_factories[algorithm] = factory;
    };
    PrivateKey.getFactory = function (algorithm) {
        return s_factories[algorithm];
    }

    /**
     *  Generate key with algorithm name
     *
     * @param {String} algorithm - algorithm name ('RSA', 'ECC')
     * @return {PrivateKey}
     */
    PrivateKey.generate = function (algorithm) {
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            throw new ReferenceError('key algorithm not support: ' + algorithm);
        }
        return factory.generatePrivateKey();
    };

    /**
     *  Parse map object to key
     *
     * @param {PrivateKey|{}} key - key info
     * @return {PrivateKey}
     */
    PrivateKey.parse = function (key) {
        if (!key) {
            return null;
        } else if (ns.Interface.conforms(key, PrivateKey)) {
            return key;
        }
        key = ns.type.Wrapper.fetchMap(key);
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            factory = PrivateKey.getFactory('*');  // unknown
        }
        return factory.parsePrivateKey(key);
    }

    //-------- namespace --------
    ns.crypto.PrivateKey = PrivateKey;

    ns.crypto.registers('PrivateKey');

})(MONKEY);
