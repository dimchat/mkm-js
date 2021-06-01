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

//! require 'dictionary.js'
//! require 'asymmetric.js'

(function (ns) {
    'use strict';

    var obj = ns.type.Object;
    var Dictionary = ns.type.Dictionary;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var VerifyKey = ns.crypto.VerifyKey;

    var PublicKey = function (key) {
    };
    ns.Interface(PublicKey, [VerifyKey]);

    /**
     *  Parse map object to key
     *
     * @param {{String:Object}} key - key info
     * @return {PublicKey}
     */
    PublicKey.parse = function (key) {
        if (obj.isNull(key)) {
            return null;
        } else if (key instanceof PublicKey) {
            return key;
        } else if (key instanceof Dictionary) {
            key = key.getMap();
        }
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PublicKey.getFactory(algorithm);
        if (obj.isNull(factory)) {
            factory = PublicKey.getFactory('*');  // unknown
        }
        return factory.parsePublicKey(key);
    }

    /**
     *  Register public key factory with algorithm
     *
     * @param {String} algorithm
     * @param {PublicKeyFactory} factory
     */
    PublicKey.register = function (algorithm, factory) {
        s_factories[algorithm] = factory;
    };
    PublicKey.getFactory = function (algorithm) {
        return s_factories[algorithm];
    }

    var s_factories = {};

    /**
     *  Key Factory
     *  ~~~~~~~~~~~
     */
    var PublicKeyFactory = function () {
    };
    ns.Interface(PublicKeyFactory, null);
    // noinspection JSUnusedLocalSymbols
    /**
     *  Parse map object to key
     *
     * @param {{String:Object}} key - key info
     * @return {PublicKey}
     */
    PublicKeyFactory.prototype.parsePublicKey = function (key) {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.PublicKeyFactory = PublicKeyFactory;

    ns.crypto.register('PublicKey');
    ns.crypto.register('PublicKeyFactory');

})(DIMP);