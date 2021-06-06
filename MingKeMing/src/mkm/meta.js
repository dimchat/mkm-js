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

//! require 'protocol/address.js'
//! require 'protocol/identifier.js'
//! require 'protocol/meta.js'

(function (ns) {
    'use strict';

    var Dictionary = ns.type.Dictionary;
    var PublicKey = ns.crypto.PublicKey;

    var MetaType = ns.protocol.MetaType;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;

    /**
     *  Create Meta
     *
     *  Usages:
     *      1. new BaseMeta(map);
     *      2. new BaseMeta(type, key);
     *      3. new BaseMeta(type, key, seed, fingerprint);
     */
    var BaseMeta = function () {
        var type, key, seed, fingerprint;
        var meta, status;
        if (arguments.length === 1) {
            // new BaseMeta(map);
            meta = arguments[0];
            type = Meta.getType(meta);
            key = Meta.getKey(meta);
            seed = Meta.getSeed(meta);
            fingerprint = Meta.getFingerprint(meta);
            status = 0;
        } else if (arguments.length === 2) {
            // new BaseMeta(type, key);
            type = arguments[0];
            key = arguments[1];
            seed = null;
            fingerprint = null;
            if (type instanceof MetaType) {
                type = type.valueOf();
            }
            meta = {
                'type': type,
                'key': key.getMap()
            };
            status = 1;
        } else if (arguments.length === 4) {
            // new BaseMeta(type, key, seed, fingerprint);
            type = arguments[0];
            key = arguments[1];
            seed = arguments[2];
            fingerprint = arguments[3];
            if (type instanceof MetaType) {
                type = type.valueOf();
            }
            meta = {
                'type': type,
                'key': key.getMap(),
                'seed': seed,
                'fingerprint': ns.format.Base64.encode(fingerprint)
            };
            status = 1;
        } else {
            throw new SyntaxError('meta arguments error: ' + arguments);
        }
        Dictionary.call(this, meta);
        this.__type = type;
        this.__key = key;
        this.__seed = seed;
        this.__fingerprint = fingerprint;
        this.__status = status;  // 1 for valid, -1 for invalid
    };
    ns.Class(BaseMeta, Dictionary, [Meta]);

    BaseMeta.prototype.getType = function () {
        return this.__type;
    };
    BaseMeta.prototype.getKey = function () {
        return this.__key;
    };
    BaseMeta.prototype.getSeed = function () {
        return this.__seed;
    };
    BaseMeta.prototype.getFingerprint = function () {
        return this.__fingerprint;
    };

    /**
     *  Check whether meta.key valid
     *
     * @returns {boolean}
     */
    BaseMeta.prototype.isValid = function () {
        if (this.__status === 0) {
            if (!this.__key) {
                // meta.key should not be empty
                this.__status = -1;
            } else if (MetaType.hasSeed(this.__type)) {
                if (!this.__seed || !this.__fingerprint) {
                    // seed and fingerprint should not be empty
                    this.__status = -1;
                } else if (this.__key.verify(ns.format.UTF8.encode(this.__seed), this.__fingerprint)) {
                    // fingerprint matched
                    this.__status = 1;
                } else {
                    // fingerprint not matched
                    this.__status = -1;
                }
            } else {
                this.__status = 1;
            }
        }
        return this.__status === 1;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Generate address with meta info and address type
     *
     * @param {NetworkType|int} network - Network ID (0 ~ 255)
     * @returns {Address}
     */
    BaseMeta.prototype.generateAddress = function (network) {
        console.assert(false, 'implement me!');
        return null;
    };

    BaseMeta.prototype.generateID = function (type, terminal) {
        var address = this.generateAddress(type);
        if (!address) {
            return null;
        }
        return ID.create(this.getSeed(), address, terminal);
    };

    /**
     *  Check whether meta matches Public Key, ID, or Address
     *  (must call this when received a new meta from network)
     *
     * @param {ID|PublicKey} id_or_key - ID or PublicKey
     * @returns {boolean}
     */
    BaseMeta.prototype.matches = function (id_or_key) {
        if (!this.isValid()) {
            return false;
        }
        if (ns.Interface.conforms(id_or_key, ID)) {
            return match_identifier.call(this, id_or_key);
        } else if (ns.Interface.conforms(id_or_key, PublicKey)) {
            return match_public_key.call(this, id_or_key);
        }
        // console.assert(false, 'error: ' + key_id_addr);
        return false;
    };

    var match_identifier = function (identifier) {
        // check with seed & address
        if (MetaType.hasSeed(this.__type)) {
            if (identifier.getName() !== this.__seed) {
                return false;
            }
        }
        var address = this.generateAddress(identifier.getType());
        return identifier.getAddress().equals(address);
    };

    var match_public_key = function (publicKey) {
        // check whether the public key equals to meta.key
        if (this.__key.equals(publicKey)) {
            return true;
        }
        // check with seed & fingerprint
        if (MetaType.hasSeed(this.__type)) {
            // check whether keys equal by verifying signature
            var data = ns.format.UTF8.encode(this.__seed);
            var signature = this.__fingerprint;
            return publicKey.verify(data, signature);
        } else {
            // ID with BTC/ETH address has no username
            // so we can just compare the key.data to check matching
            return false;
        }
    };

    //-------- namespace --------
    ns.BaseMeta = BaseMeta;

    ns.register('BaseMeta');

})(MingKeMing);
