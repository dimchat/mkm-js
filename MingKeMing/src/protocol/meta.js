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

//! require 'crypto.js'
//! require 'address.js'
//! require 'identifier.js'

(function (ns) {
    'use strict';

    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;

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
    var Meta = function () {
    };
    ns.Interface(Meta, null);

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
        console.assert(false, 'implement me!');
        return 0;
    };
    Meta.getType = function (meta) {
        var version = meta['type'];
        if (!version) {
            // compatible with v1.0
            version = meta['version'];
        }
        return version;
    };

    /**
     *  Public key (used for signature)
     *
     *      RSA / ECC
     */
    Meta.prototype.getKey = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    Meta.getKey = function (meta) {
        var key = meta['key'];
        if (!key) {
            throw TypeError('meta key not found: ' + meta);
        }
        return PublicKey.parse(key);
    };

    /**
     *  Seed to generate fingerprint
     *
     *      Username / Group-X
     */
    Meta.prototype.getSeed = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    Meta.getSeed = function (meta) {
        return meta['seed'];
    };

    /**
     *  Fingerprint to verify ID and public key
     *
     *      Build: fingerprint = sign(seed, privateKey)
     *      Check: verify(seed, fingerprint, publicKey)
     */
    Meta.prototype.getFingerprint = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    Meta.getFingerprint = function (meta) {
        var base64 = meta['fingerprint'];
        if (!base64) {
            return null;
        }
        return ns.format.Base64.decode(base64);
    };

    /**
     *  Check meta valid
     *  (must call this when received a new meta from network)
     *
     * @return true on valid
     */
    Meta.prototype.isValid = function () {
        console.assert(false, 'implement me!');
        return false;
    };

    /**
     *  Generate ID with terminal
     *
     * @param {uint} type - ID.type
     * @param {String} terminal - ID.terminal
     * @return {ID}
     */
    Meta.prototype.generateID = function (type, terminal) {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Check whether meta matches ID (or PublicKey)
     *  (must call this when received a new meta from network)
     *
     * @param {ID|PublicKey} id_or_key - ID or PublicKey
     * @returns {boolean}
     */
    Meta.prototype.matches = function (id_or_key) {
        console.assert(false, 'implement me!');
        return false;
    };

    //
    //  Factory methods
    //
    Meta.create = function (type, key, seed, fingerprint) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw ReferenceError('meta type not support: ' + type);
        }
        return factory.createMeta(key, seed, fingerprint);
    };

    Meta.generate = function (type, sKey, seed) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw ReferenceError('meta type not support: ' + type);
        }
        return factory.generateMeta(sKey, seed);
    };

    Meta.parse = function (meta) {
        if (!meta) {
            return null;
        } else if (meta instanceof Meta) {
            return meta;
        } else if (meta instanceof ns.type.Dictionary) {
            meta = meta.getMap();
        }
        var version = Meta.getType(meta);
        var factory = Meta.getFactory(version);
        if (!factory) {
            factory = Meta.getFactory(0);
        }
        return factory.parseMeta(meta);
    };

    Meta.getFactory = function (type) {
        if (type instanceof MetaType) {
            type = type.valueOf();
        }
        return s_factories[type];
    };
    Meta.register = function (type, factory) {
        if (type instanceof MetaType) {
            type = type.valueOf();
        }
        s_factories[type] = factory;
    };

    var s_factories = {};  // type(uint8|MetaType) -> MetaFactory

    /**
     *  Meta Factory
     *  ~~~~~~~~~~~~
     */
    var MetaFactory = function () {
    };
    ns.Interface(MetaFactory, null);
    // noinspection JSUnusedLocalSymbols
    /**
     *  Create meta
     *
     * @param {PublicKey} key          - public key
     * @param {String} seed            - ID.name
     * @param {Uint8Array} fingerprint - sKey.sign(seed)
     * @return {Meta}
     */
    MetaFactory.prototype.createMeta = function (key, seed, fingerprint) {
        console.assert(false, 'implement me!');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Generate meta
     *
     * @param {PrivateKey} sKey        - private key
     * @param {String} seed            - ID.name
     * @return {Meta}
     */
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
        console.assert(false, 'implement me!');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Parse map object to meta
     *
     * @param {{String:Object}} meta - meta info
     * @return {Meta}
     */
    MetaFactory.prototype.parseMeta = function (meta) {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.protocol.Meta = Meta;
    ns.protocol.MetaFactory = MetaFactory;

    ns.protocol.register('Meta');
    ns.protocol.register('MetaFactory');

})(MingKeMing);
