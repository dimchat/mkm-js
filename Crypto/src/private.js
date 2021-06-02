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

//! require 'asymmetric.js'

(function (ns) {
    'use strict';

    var CryptographyKey = ns.crypto.CryptographyKey;
    var SignKey = ns.crypto.SignKey;

    var PrivateKey = function () {
    };
    ns.Interface(PrivateKey, [SignKey]);

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
     *  Generate key with algorithm name
     *
     * @param {String} algorithm - algorithm name ('AES')
     * @return {PrivateKey}
     */
    PrivateKey.generate = function (algorithm) {
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            throw ReferenceError('key algorithm not support: ' + algorithm);
        }
        return factory.generatePrivateKey();
    };

    /**
     *  Parse map object to key
     *
     * @param {{String:Object}|Dictionary} key - key info
     * @return {PrivateKey}
     */
    PrivateKey.parse = function (key) {
        if (!key) {
            return null;
        } else if (key instanceof PrivateKey) {
            return key;
        } else if (key instanceof ns.type.Dictionary) {
            key = key.getMap();
        }
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            factory = PrivateKey.getFactory('*');  // unknown
        }
        return factory.parsePrivateKey(key);
    }

    /**
     *  Register private key factory with algorithm
     *
     * @param {String} algorithm
     * @param {PrivateKeyFactory} factory
     */
    PrivateKey.register = function (algorithm, factory) {
        s_factories[algorithm] = factory;
    };
    PrivateKey.getFactory = function (algorithm) {
        return s_factories[algorithm];
    }

    var s_factories = {};  // algorithm(String) -> PrivateKeyFactory

    /**
     *  Key Factory
     *  ~~~~~~~~~~~
     */
    var PrivateKeyFactory = function () {
    };
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
    // noinspection JSUnusedLocalSymbols
    /**
     *  Parse map object to key
     *
     * @param {{String:Object}} key - key info
     * @return {PrivateKey}
     */
    PrivateKeyFactory.prototype.parsePrivateKey = function (key) {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.PrivateKeyFactory = PrivateKeyFactory;

    ns.crypto.register('PrivateKey');
    ns.crypto.register('PrivateKeyFactory');

})(DIMP);
