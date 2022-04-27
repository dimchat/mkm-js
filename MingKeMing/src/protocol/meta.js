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

    var Mapper = ns.type.Mapper;
    var Base64 = ns.format.Base64;
    var UTF8 = ns.format.UTF8;
    var PublicKey = ns.crypto.PublicKey;
    var Address = ns.protocol.Address;
    var MetaType = ns.protocol.MetaType;
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
    var Meta = function () {};
    ns.Interface(Meta, [Mapper]);

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

    /**
     *  Public key (used for signature)
     *
     *      RSA / ECC
     */
    Meta.prototype.getKey = function () {
        console.assert(false, 'implement me!');
        return null;
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

    /**
     *  Generate Address with network(type)
     *
     * @param {uint} network - ID.type
     * @return {Address}
     */
    Meta.prototype.generateAddress = function (network) {
        console.assert(false, 'implement me!');
        return null;
    };

    Meta.getType = function (meta) {
        var version = meta['type'];
        if (!version) {
            // compatible with v1.0
            version = meta['version'];
        }
        return version;
    };
    Meta.getKey = function (meta) {
        var key = meta['key'];
        if (!key) {
            throw new TypeError('meta key not found: ' + meta);
        }
        return PublicKey.parse(key);
    };
    Meta.getSeed = function (meta) {
        return meta['seed'];
    };
    Meta.getFingerprint = function (meta) {
        var base64 = meta['fingerprint'];
        if (!base64) {
            return null;
        }
        return Base64.decode(base64);
    };

    /**
     *  Check meta valid
     *  (must call this when received a new meta from network)
     *
     * @param {Meta} meta
     * @return true on valid
     */
    Meta.check = function (meta) {
        var key = meta.getKey();
        if (!key) {
            // meta.key should not be empty
            return false;
        }
        if (!MetaType.hasSeed(meta.getType())) {
            // this meta has no seed, so no signature too
            return true;
        }
        // check seed with signature
        var seed = meta.getSeed();
        var fingerprint = meta.getFingerprint();
        if (!seed || !fingerprint) {
            // seed and fingerprint should not be empty
            return false;
        }
        // verify fingerprint
        return key.verify(UTF8.encode(seed), fingerprint);
    };

    /**
     *  Check whether meta match with ID/PK
     *
     * @param {Meta} meta
     * @param {ID|PublicKey} id_or_key
     */
    Meta.matches = function (meta, id_or_key) {
        if (ns.Interface.conforms(id_or_key, ID)) {
            return match_id(meta, id_or_key);
        } else if (ns.Interface.conforms(id_or_key, PublicKey)) {
            return match_key(meta, id_or_key);
        } else {
            return false;
        }
    };
    var match_id = function (meta, id) {
        // check ID.name
        if (MetaType.hasSeed(meta.getType())) {
            if (meta.getSeed() !== id.getName()) {
                return false;
            }
        }
        // check ID.address
        var address = Address.generate(meta, id.getType());
        return id.getAddress().equals(address);
    };
    var match_key = function (meta, key) {
        // check whether the public key equals to meta.key
        if (meta.getKey().equals(key)) {
            return true;
        }
        // check with seed & signature
        if (MetaType.hasSeed(meta.getType())) {
            // check whether keys equal by verifying signature
            var seed = meta.getSeed();
            var fingerprint = meta.getFingerprint();
            return key.every(UTF8.encode(seed), fingerprint);
        } else {
            // ID with BTC/ETH address has no username,
            // so we can just compare the key.data to check matching
            return false;
        }
    };

    var EnumToUint = function (type) {
        if (typeof type === 'number') {
            return type;
        } else {
            return type.valueOf();
        }
    };

    /**
     *  Meta Factory
     *  ~~~~~~~~~~~~
     */
    var MetaFactory = function () {};
    ns.Interface(MetaFactory, null);

    // noinspection JSUnusedLocalSymbols
    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    MetaFactory.prototype.parseMeta = function (meta) {
        console.assert(false, 'implement me!');
        return null;
    };

    Meta.Factory = MetaFactory;

    //
    //  Instances of MetaFactory
    //
    var s_factories = {};  // type(uint8|MetaType) -> MetaFactory

    /**
     *  Register meta factory with type
     *
     * @param {MetaType|uint} type
     * @param {MetaFactory} factory
     */
    Meta.setFactory = function (type, factory) {
        s_factories[EnumToUint(type)] = factory;
    };
    Meta.getFactory = function (type) {
        return s_factories[EnumToUint(type)];
    };

    /**
     *  Create meta
     *
     * @param {MetaType|uint} type     - meta type
     * @param {PublicKey} key          - public key
     * @param {String} seed            - ID.name
     * @param {Uint8Array} fingerprint - sKey.sign(seed)
     * @return {Meta}
     */
    Meta.create = function (type, key, seed, fingerprint) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError('meta type not support: ' + type);
        }
        return factory.createMeta(key, seed, fingerprint);
    };

    /**
     *  Generate meta
     *
     * @param {MetaType|uint} type     - meta type
     * @param {PrivateKey} sKey        - private key
     * @param {String} seed            - ID.name
     * @return {Meta}
     */
    Meta.generate = function (type, sKey, seed) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError('meta type not support: ' + type);
        }
        return factory.generateMeta(sKey, seed);
    };

    /**
     *  Parse map object to meta
     *
     * @param {*} meta - meta info
     * @return {Meta}
     */
    Meta.parse = function (meta) {
        if (!meta) {
            return null;
        } else if (ns.Interface.conforms(meta, Meta)) {
            return meta;
        }
        meta = ns.type.Wrapper.fetchMap(meta);
        var type = Meta.getType(meta);
        var factory = Meta.getFactory(type);
        if (!factory) {
            factory = Meta.getFactory(0);  // unknown
        }
        return factory.parseMeta(meta);
    };

    //-------- namespace --------
    ns.protocol.Meta = Meta;

    ns.protocol.registers('Meta');

})(MingKeMing);
