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

//! require 'crypto/public.js'
//! require 'crypto/private.js'
//! require 'crypto/symmetric.js'


mk.plugins.PublicKeyHelper = Interface(null, null, {

    setPublicKeyFactory: function (algorithm, factory) {},
    getPublicKeyFactory: function (algorithm) {},

    parsePublicKey: function (key) {}

});
var PublicKeyHelper = mk.plugins.PublicKeyHelper;


mk.plugins.PrivateKeyHelper = Interface(null, null, {

    setPrivateKeyFactory: function (algorithm, factory) {},
    getPrivateKeyFactory: function (algorithm) {},

    generatePrivateKey: function (algorithm) {},

    parsePrivateKey: function (key) {}

});
var PrivateKeyHelper = mk.plugins.PrivateKeyHelper;


mk.plugins.SymmetricKeyHelper = Interface(null, null, {

    setSymmetricKeyFactory: function (algorithm, factory) {},
    getSymmetricKeyFactory: function (algorithm) {},

    generateSymmetricKey: function (algorithm) {},

    parseSymmetricKey: function (key) {}

});
var SymmetricKeyHelper = mk.plugins.SymmetricKeyHelper;


/**
 *  CryptographyKey FactoryManager
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
mk.plugins.CryptoExtensions = {

    /**
     *  Init public key helper
     *
     * @param {PublicKeyHelper} helper
     */
    setPublicHelper: function (helper) {
        publicHelper = helper;
    },
    getPublicHelper: function () {
        return publicHelper;
    },

    /**
     *  Init private key helper
     *
     * @param {PrivateKeyHelper} helper
     */
    setPrivateHelper: function (helper) {
        privateHelper = helper;
    },
    getPrivateHelper: function () {
        return privateHelper;
    },

    /**
     *  Init symmetric key helper
     *
     * @param {SymmetricKeyHelper} helper
     */
    setSymmetricHelper: function (helper) {
        symmetricHelper = helper;
    },
    getSymmetricHelper: function () {
        return symmetricHelper;
    }

};
var CryptoExtensions = mk.plugins.CryptoExtensions;

var publicHelper = null;
var privateHelper = null;
var symmetricHelper = null;
