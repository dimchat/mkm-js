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

//! require 'types.js'
//! require 'address.js'
//! require 'identifier.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Mapper    = ns.type.Mapper;

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
    var Meta = Interface(null, [Mapper]);

    //
    //  MetaType
    //  ~~~~~~~~
    //  Meta algorithm names
    //
    Meta.MKM = 'mkm'; // '1';
    Meta.BTC = 'btc'; // '2';
    Meta.ETH = 'eth'; // '4';
    // ...

    /**
     *  Meta algorithm version
     *
     *      1 = mkm : username@address (default)
     *      2 = btc : btc_address
     *      4 = eth : eth_address
     *      ...
     *
     * @return {String}
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

    /**
     *  Generate Address with network(type)
     *
     * @param {uint} network - ID.type
     * @return {Address}
     */
    Meta.prototype.generateAddress = function (network) {};

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
     *  Check whether meta matches with entity ID
     *  (must call this when received a new meta from network)
     *
     * @param {ID} identifier - entity ID
     * @return {boolean} true on matched
     */
    Meta.prototype.matchIdentifier = function (identifier) {};

    /**
     *  Check whether meta matches with public key
     *
     * @param {VerifyKey} pKey - public key
     * @return {boolean} true on matched
     */
    Meta.prototype.matchPublicKey = function (pKey) {};

    //
    //  Factory methods
    //

    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory;
    };

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
        var gf = general_factory();
        return gf.createMeta(type, key, seed, fingerprint);
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
        var gf = general_factory();
        return gf.generateMeta(type, sKey, seed);
    };

    /**
     *  Parse map object to meta
     *
     * @param {*} meta - meta info
     * @return {Meta}
     */
    Meta.parse = function (meta) {
        var gf = general_factory();
        return gf.parseMeta(meta);
    };

    /**
     *  Register meta factory with type
     *
     * @param {string} type
     * @param {MetaFactory} factory
     */
    Meta.setFactory = function (type, factory) {
        var gf = general_factory();
        gf.setMetaFactory(type, factory);
    };
    Meta.getFactory = function (type) {
        var gf = general_factory();
        return gf.getMetaFactory(type);
    };

    /**
     *  Meta Factory
     *  ~~~~~~~~~~~~
     */
    var MetaFactory = Interface(null, null);

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

    Meta.Factory = MetaFactory;

    //-------- namespace --------
    ns.protocol.Meta = Meta;
    // ns.protocol.MetaFactory = MetaFactory;

})(MingKeMing);
