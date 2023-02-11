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

    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;

    //
    //  Symmetric Cryptography Key
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    //  key data format: {
    //      algorithm : "AES", // "DES", ...
    //      data      : "{BASE64_ENCODE}",
    //      ...
    //  }
    //
    var SymmetricKey = Interface(null, [EncryptKey, DecryptKey]);

    SymmetricKey.AES = 'AES'; //-- "AES/CBC/PKCS7Padding"
    SymmetricKey.DES = 'DES';

    /**
     *  Key Factory
     *  ~~~~~~~~~~~
     */
    var SymmetricKeyFactory = Interface(null, null);

    SymmetricKeyFactory.prototype.generateSymmetricKey = function () {
        throw new Error('NotImplemented');
    };

    SymmetricKeyFactory.prototype.parseSymmetricKey = function (key) {
        throw new Error('NotImplemented');
    };

    SymmetricKey.Factory = SymmetricKeyFactory;

    var general_factory = function () {
        var man = ns.crypto.FactoryManager;
        return man.generalFactory;
    };

    /**
     *  Register symmetric key factory with algorithm
     *
     * @param {String} algorithm
     * @param {SymmetricKeyFactory} factory
     */
    SymmetricKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setSymmetricKeyFactory(algorithm, factory);
    };
    SymmetricKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getSymmetricKeyFactory(algorithm);
    };

    /**
     *  Generate key with algorithm name
     *
     * @param {String} algorithm - algorithm name ('AES')
     * @return {SymmetricKey}
     */
    SymmetricKey.generate = function (algorithm) {
        var gf = general_factory();
        return gf.generateSymmetricKey(algorithm);
    };

    /**
     *  Parse map object to key
     *
     * @param {*} key - key info
     * @return {SymmetricKey}
     */
    SymmetricKey.parse = function (key) {
        var gf = general_factory();
        return gf.parseSymmetricKey(key);
    };

    //-------- namespace --------
    ns.crypto.SymmetricKey = SymmetricKey;

})(MONKEY);
