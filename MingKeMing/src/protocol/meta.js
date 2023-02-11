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
    var PublicKey = ns.crypto.PublicKey;

    var Address  = ns.protocol.Address;
    var MetaType = ns.protocol.MetaType;
    var ID       = ns.protocol.ID;

    /**
     *  User/Group Meta data
     *  ~~~~~~~~~~~~~~~~~~~~
     *  This class is used to generate entity ID
     *
     *      data format: {
     *          version: 1,          // algorithm version
     *          seed: "moKy",        // user/group name
     *          key: "{public key}", // PK = secp256k1(SK);
     *          fingerprint: "..."   // CT = sign(seed, SK);
     *      }
     *
     *      algorithm:
     *          fingerprint = sign(seed, SK);
     */
    var Meta = Interface(null, [Mapper]);

    /**
     *  Meta algorithm version
     *
     *      0x01 - username@address
     *      0x02 - btc_address
     *      0x03 - username@btc_address
     *      0x04 - eth_address
     *      0x05 - username@eth_address
     */
    Meta.prototype.getType = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Public key (used for signature)
     *
     *      RSA / ECC
     */
    Meta.prototype.getKey = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Seed to generate fingerprint
     *
     *      Username / Group-X
     */
    Meta.prototype.getSeed = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Fingerprint to verify ID and public key
     *
     *      Build: fingerprint = sign(seed, privateKey)
     *      Check: verify(seed, fingerprint, publicKey)
     */
    Meta.prototype.getFingerprint = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Generate Address with network(type)
     *
     * @param {uint} network - ID.type
     * @return {Address}
     */
    Meta.prototype.generateAddress = function (network) {
        throw new Error('NotImplemented');
    };

    /**
     *  Check meta valid
     *  (must call this when received a new meta from network)
     *
     * @param {Meta} meta
     * @return true on valid
     */
    Meta.check = function (meta) {
        var gf = general_factory();
        return gf.checkMeta(meta);
    };

    /**
     *  Check whether meta match with ID/PK
     *
     * @param {ID} identifier
     * @param {Meta} meta
     */
    Meta.matchID = function (identifier, meta) {
        var gf = general_factory();
        return gf.matchID(identifier, meta);
    };
    Meta.matchKey = function (key, meta) {
        var gf = general_factory();
        return gf.matchKey(key, meta);
    };

    /**
     *  Meta Factory
     *  ~~~~~~~~~~~~
     */
    var MetaFactory = Interface(null, null);

    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
        throw new Error('NotImplemented');
    };

    MetaFactory.prototype.generateMeta = function (sKey, seed) {
        throw new Error('NotImplemented');
    };

    MetaFactory.prototype.parseMeta = function (meta) {
        throw new Error('NotImplemented');
    };

    Meta.Factory = MetaFactory;

    var general_factory = function () {
        var man = ns.mkm.FactoryManager;
        return man.generalFactory;
    };

    /**
     *  Register meta factory with type
     *
     * @param {MetaType|uint} version
     * @param {MetaFactory} factory
     */
    Meta.setFactory = function (version, factory) {
        var gf = general_factory();
        gf.setMetaFactory(version, factory);
    };
    Meta.getFactory = function (version) {
        var gf = general_factory();
        return gf.getMetaFactory(version);
    };

    /**
     *  Create meta
     *
     * @param {MetaType|uint} version  - meta type
     * @param {PublicKey} key          - public key
     * @param {String} seed            - ID.name
     * @param {Uint8Array} fingerprint - sKey.sign(seed)
     * @return {Meta}
     */
    Meta.create = function (version, key, seed, fingerprint) {
        var gf = general_factory();
        return gf.createMeta(version, key, seed, fingerprint);
    };

    /**
     *  Generate meta
     *
     * @param {MetaType|uint} version  - meta type
     * @param {PrivateKey} sKey        - private key
     * @param {String} seed            - ID.name
     * @return {Meta}
     */
    Meta.generate = function (version, sKey, seed) {
        var gf = general_factory();
        return gf.generateMeta(version, sKey, seed);
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

    //-------- namespace --------
    ns.protocol.Meta = Meta;

})(MingKeMing);
