;
// license: https://mit-license.org
//
//  Ming-Ke-Ming : Decentralized User Identity Authentication
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

//! require 'namespace.js'
//! require 'identifier.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;

    /**
     *  The Additional Information
     *
     *      'Meta' is the information for entity which never changed,
     *          which contains the key for verify signature;
     *      'TAI' is the variable part,
     *          which could contain a public key for asymmetric encryption.
     */
    var TAI = Interface(null, null);

    /**
     *  Check if signature matched
     *
     * @returns {boolean}
     */
    TAI.prototype.isValid = function () {
        throw new Error('NotImplemented');
    };

    //-------- signature --------

    /**
     *  Verify 'data' and 'signature' with public key
     *
     * @param {VerifyKey} publicKey
     * @returns {boolean}
     */
    TAI.prototype.verify = function (publicKey) {
        throw new Error('NotImplemented');
    };

    /**
     *  Encode properties to 'data' and sign it to 'signature'
     *
     * @param {SignKey} privateKey
     * @returns {Uint8Array}
     */
    TAI.prototype.sign = function (privateKey) {
        throw new Error('NotImplemented');
    };

    //-------- properties --------

    /**
     *  Get all properties
     *
     * @returns {{}} mapping(String => Object)
     */
    TAI.prototype.allProperties = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Get property data with key
     *
     * @param {String} name - property name
     * @returns {Object}
     */
    TAI.prototype.getProperty = function (name) {
        throw new Error('NotImplemented');
    };

    /**
     *  Update property with key and data
     *  (this will reset 'data' and 'signature')
     *
     * @param {String} name - property name
     * @param {Object} value - property value
     */
    TAI.prototype.setProperty = function (name, value) {
        throw new Error('NotImplemented');
    };

    //-------- namespace --------
    ns.protocol.TAI = TAI;

})(MingKeMing);
