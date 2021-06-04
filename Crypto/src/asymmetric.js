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

//! require 'cryptography.js'

(function (ns) {
    'use strict';

    var CryptographyKey = ns.crypto.CryptographyKey;

    //
    //  Asymmetric Cryptography Key
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    //  key data format: {
    //      algorithm : "RSA", // "ECC", ...
    //      data      : "{BASE64_ENCODE}",
    //      ...
    //  }
    //
    var AsymmetricKey = function (key) {
    };
    ns.Interface(AsymmetricKey, [CryptographyKey]);

    AsymmetricKey.RSA = 'RSA'; //-- "RSA/ECB/PKCS1Padding", "SHA256withRSA"
    AsymmetricKey.ECC = 'ECC';

    /**
     *  Check key pair by encryption
     *
     * @param {SignKey}   sKey
     * @param {VerifyKey} pKey
     */
    AsymmetricKey.matches = function (sKey, pKey) {
        // check by encryption
        var promise = CryptographyKey.promise;
        var signature = sKey.sign(promise);
        return pKey.verify(promise, signature);
    };

    var SignKey = function () {
    };
    ns.Interface(SignKey, [AsymmetricKey]);
    // noinspection JSUnusedLocalSymbols
    /**
     *  signature = sign(data, SK);
     *
     * @param {Uint8Array} data
     * @return {Uint8Array}
     */
    SignKey.prototype.sign = function (data) {
        console.assert(false, 'implement me!');
        return null;
    };

    var VerifyKey = function () {
    };
    ns.Interface(VerifyKey, [AsymmetricKey]);
    // noinspection JSUnusedLocalSymbols
    /**
     *  OK = verify(data, signature, PK)
     *
     * @param {Uint8Array} data
     * @param {Uint8Array} signature
     * @return {boolean}
     */
    VerifyKey.prototype.verify = function (data, signature) {
        console.assert(false, 'implement me!');
        return false;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  OK = verify(data, sign(data, SK), PK)
     *
     * @param {SignKey} sKey - private key
     * @return {boolean} true on signature matched
     */
    VerifyKey.prototype.matches = function (sKey) {
        console.assert(false, 'implement me!');
        return false;
    };

    //-------- namespace --------
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;

    ns.crypto.register('AsymmetricKey');
    ns.crypto.register('SignKey');
    ns.crypto.register('VerifyKey');

})(DIMP);
