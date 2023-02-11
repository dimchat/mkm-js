;
// license: https://mit-license.org
//
//  MONKEY: Memory Object aNd KEYs
//
//                               Written in 2023 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2023 Albert Moky
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
//! require 'type/wrapper.js'

//! require 'keys.js'
//! require 'symmetric.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Wrapper = ns.type.Wrapper;

    var SymmetricKey = ns.crypto.SymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PublicKey = ns.crypto.PublicKey;

    // sample data for checking keys
    var promise = 'Moky loves May Lee forever!';
    var get_promise = function () {
        if (typeof promise === 'string') {
            promise = ns.format.UTF8.encode(promise);
        }
        return promise;
    };

    var GeneralFactory = function () {
        this.__symmetricKeyFactories = {};  // name => SymmetricKey.Factory
        this.__publicKeyFactories    = {};  // name => PublicKey.Factory
        this.__privateKeyFactories   = {};  // name => PrivateKey.Factory
    };
    Class(GeneralFactory, null, null, null);

    /**
     *  Check whether keys matched
     *
     * @param {SignKey} sKey
     * @param {VerifyKey} pKey
     * @return {boolean}
     */
    GeneralFactory.prototype.matchSignKey = function (sKey, pKey) {
        // verify with signature
        var data = get_promise();
        var signature = sKey.sign(data);
        return pKey.verify(data, signature);
    };

    /**
     *  Check whether keys matched
     *
     * @param {EncryptKey} pKey
     * @param {DecryptKey} sKey
     * @return {boolean}
     */
    GeneralFactory.prototype.matchEncryptKey = function (pKey, sKey) {
        // check by encryption
        var data = get_promise();
        var ciphertext = pKey.encrypt(data);
        var plaintext = sKey.decrypt(ciphertext);
        // check equals
        if (!plaintext || plaintext.length !== data.length) {
            return false;
        }
        for (var i = 0; i < data.length; ++i) {
            if (plaintext[i] !== data[i]) {
                return false;
            }
        }
        return true;
    };

    /**
     *  Get key algorithm
     *
     * @param {{}} key
     * @return {string}
     */
    GeneralFactory.prototype.getAlgorithm = function (key) {
        return key['algorithm'];
    };

    //
    //  SymmetricKey
    //

    GeneralFactory.prototype.setSymmetricKeyFactory = function (algorithm, factory) {
        this.__symmetricKeyFactories[algorithm] = factory;
    };
    GeneralFactory.prototype.getSymmetricKeyFactory = function (algorithm) {
        return this.__symmetricKeyFactories[algorithm];
    };

    GeneralFactory.prototype.generateSymmetricKey = function (algorithm) {
        var factory = this.getSymmetricKeyFactory(algorithm);
        return factory.generateSymmetricKey();
    };
    GeneralFactory.prototype.parseSymmetricKey = function (key) {
        if (!key) {
            return null;
        } else if (Interface.conforms(key, SymmetricKey)) {
            return key;
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info);
        var factory = this.getSymmetricKeyFactory(algorithm);
        if (!factory) {
            factory = this.getSymmetricKeyFactory('*'); // unknown
        }
        return factory.parseSymmetricKey(info);
    };

    //
    //  PrivateKey
    //

    GeneralFactory.prototype.setPrivateKeyFactory = function (algorithm, factory) {
        this.__privateKeyFactories[algorithm] = factory;
    };
    GeneralFactory.prototype.getPrivateKeyFactory = function (algorithm) {
        return this.__privateKeyFactories[algorithm];
    };

    GeneralFactory.prototype.generatePrivateKey = function (algorithm) {
        var factory = this.getPrivateKeyFactory(algorithm);
        return factory.generatePrivateKey();
    };
    GeneralFactory.prototype.parsePrivateKey = function (key) {
        if (!key) {
            return null;
        } else if (Interface.conforms(key, PrivateKey)) {
            return key;
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info);
        var factory = this.getPrivateKeyFactory(algorithm);
        if (!factory) {
            factory = this.getPrivateKeyFactory('*');  // unknown
        }
        return factory.parsePrivateKey(info);
    };

    //
    //  PublicKey
    //

    GeneralFactory.prototype.setPublicKeyFactory = function (algorithm, factory) {
        this.__publicKeyFactories[algorithm] = factory;
    };
    GeneralFactory.prototype.getPublicKeyFactory = function (algorithm) {
        return this.__publicKeyFactories[algorithm];
    };

    GeneralFactory.prototype.parsePublicKey = function (key) {
        if (!key) {
            return null;
        } else if (Interface.conforms(key, PublicKey)) {
            return key;
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info);
        var factory = this.getPublicKeyFactory(algorithm);
        if (!factory) {
            factory = this.getPublicKeyFactory('*');  // unknown
        }
        return factory.parsePublicKey(info);
    };

    var FactoryManager = {
        generalFactory: new GeneralFactory()
    };

    //-------- namespace --------
    ns.crypto.GeneralFactory = GeneralFactory;
    ns.crypto.FactoryManager = FactoryManager;

})(MONKEY);
