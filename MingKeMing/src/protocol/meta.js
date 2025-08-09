'use strict';
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

//! require 'types.js'
//! require 'address.js'
//! require 'identifier.js'


    /**
     *  User/Group Meta data
     *  ~~~~~~~~~~~~~~~~~~~~
     *  This class is used to generate entity ID
     *
     *      data format: {
     *          type       : 1,              // algorithm version
     *          key        : "{public key}", // PK = secp256k1(SK);
     *          seed       : "moKy",         // user/group name
     *          fingerprint: "..."           // CT = sign(seed, SK);
     *      }
     *
     *      algorithm:
     *          fingerprint = sign(seed, SK);
     */
    mkm.protocol.Meta = Interface(null, [Mapper]);
    var Meta = mkm.protocol.Meta;

    /**
     *  Meta algorithm version
     *
     *      1 = mkm : username@address (default)
     *      2 = btc : btc_address
     *      4 = eth : eth_address
     *      ...
     *
     * @return {string}
     */
    Meta.prototype.getType = function () {};

    /**
     *  Public key (used for signature)
     *
     *      RSA / ECC
     *
     * @return {VerifyKey}
     */
    Meta.prototype.getPublicKey = function () {};

    /**
     *  Seed to generate fingerprint
     *
     *      Username / Group-X
     *
     * @return {String}
     */
    Meta.prototype.getSeed = function () {};

    /**
     *  Fingerprint to verify ID and public key
     *
     *      Build: fingerprint = sign(seed, privateKey)
     *      Check: verify(seed, fingerprint, publicKey)
     *
     * @return {Uint8Array}
     */
    Meta.prototype.getFingerprint = function () {};

    //
    //  Validation
    //

    /**
     *  Check meta valid
     *  (must call this when received a new meta from network)
     *
     * @return {boolean} false on fingerprint not matched
     */
    Meta.prototype.isValid = function () {};

    /**
     *  Generate Address with network(type)
     *
     * @param {uint} network - ID.type
     * @return {Address}
     */
    Meta.prototype.generateAddress = function (network) {};

    //
    //  Factory methods
    //

    /**
     *  Create meta from stored info
     *
     * @param {String} type                   - meta algorithm version
     * @param {VerifyKey} key                 - public key
     * @param {String} seed                   - ID.name
     * @param {TransportableData} fingerprint - sKey.sign(seed)
     * @return {Meta}
     */
    Meta.create = function (type, key, seed, fingerprint) {
        var helper = AccountExtensions.getMetaHelper();
        return helper.createMeta(type, key, seed, fingerprint);
    };

    /**
     *  Generate meta
     *
     * @param {String} type                   - meta algorithm version
     * @param {SignKey} sKey                  - private key
     * @param {String} seed                   - ID.name
     * @return {Meta}
     */
    Meta.generate = function (type, sKey, seed) {
        var helper = AccountExtensions.getMetaHelper();
        return helper.generateMeta(type, sKey, seed);
    };

    /**
     *  Parse map object to meta
     *
     * @param {*} meta - meta info
     * @return {Meta}
     */
    Meta.parse = function (meta) {
        var helper = AccountExtensions.getMetaHelper();
        return helper.parseMeta(meta);
    };

    /**
     *  Register meta factory with type
     *
     * @param {string} type
     * @param {MetaFactory} factory
     */
    Meta.setFactory = function (type, factory) {
        var helper = AccountExtensions.getMetaHelper();
        helper.setMetaFactory(type, factory);
    };
    Meta.getFactory = function (type) {
        var helper = AccountExtensions.getMetaHelper();
        return helper.getMetaFactory(type);
    };

    /**
     *  Meta Factory
     *  ~~~~~~~~~~~~
     */
    Meta.Factory = Interface(null, null);
    var MetaFactory = Meta.Factory;

    /**
     *  Create meta
     *
     * @param {VerifyKey} pKey                - public key
     * @param {String} seed                   - ID.name
     * @param {TransportableData} fingerprint - sKey.sign(seed)
     * @return {Meta}
     */
    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {};

    /**
     *  Generate meta
     *
     * @param {SignKey} sKey - private key
     * @param {String} seed  - ID.name
     * @return {Meta}
     */
    MetaFactory.prototype.generateMeta = function (sKey, seed) {};

    /**
     *  Parse map object to meta
     *
     * @param {*} meta - meta info
     * @return {Meta}
     */
    MetaFactory.prototype.parseMeta = function (meta) {};
