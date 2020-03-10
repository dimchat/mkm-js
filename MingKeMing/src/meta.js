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
//! require 'address.js'
//! require 'identifier.js'

!function (ns) {
    'use strict';

    var Dictionary = ns.type.Dictionary;

    var PublicKey = ns.crypto.PublicKey;
    var Base64 = ns.format.Base64;

    var MetaType = ns.protocol.MetaType;
    var NetworkType = ns.protocol.NetworkType;
    var Address = ns.Address;
    var ID = ns.ID;

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
    var Meta = function (map) {
        Dictionary.call(this, map);
        /**
         *  Meta algorithm version
         *
         *      0x01 - username@address
         *      0x02 - btc_address
         *      0x03 - username@btc_address
         */
        var version = map['version'];
        if (version instanceof MetaType) {
            version = version.valueOf();
        }
        this.version = version;
        /**
         *  Public key (used for signature)
         *
         *      RSA / ECC
         */
        this.key = PublicKey.getInstance(map['key']);
        // seed & fingerprint
        if (this.hasSeed()) {
            /**
             *  Seed to generate fingerprint
             *
             *      Username / Group-X
             */
            this.seed = map['seed'];
            /**
             *  Fingerprint to verify ID and public key
             *
             *      Build: fingerprint = sign(seed, privateKey)
             *      Check: verify(seed, fingerprint, publicKey)
             */
            this.fingerprint = Base64.decode(map['fingerprint']);
        } else {
            this.seed = null;
            this.fingerprint = null;
        }
        this.status = 0;  // 1 for valid, -1 for invalid
    };
    ns.Class(Meta, Dictionary, null);

    /**
     *  Check whether meta equal
     *
     * @param {Meta} other - another meta
     * @returns {boolean}
     */
    Meta.prototype.equals = function (other) {
        if (!other) {
            return false;
        } else if (Dictionary.prototype.equals.call(this, other)) {
            return true;
        }
        var meta = Meta.getInstance(other);
        var identifier = meta.generateIdentifier(NetworkType.Main);
        return this.matches(identifier);
    };

    Meta.prototype.hasSeed = function () {
        return MetaType.hasSeed(this.version);
    };

    /**
     *  Check whether meta.key valid
     *
     * @returns {boolean}
     */
    Meta.prototype.isValid = function () {
        if (this.status === 0) {
            if (!this.key) {
                // meta.key should not be empty
                this.status = -1;
            } else if (this.hasSeed()) {
                if (!this.seed || !this.fingerprint) {
                    // seed and fingerprint should not be empty
                    this.status = -1;
                } else {
                    var data = ns.type.String.from(this.seed).getBytes();
                    var signature = this.fingerprint;
                    if (this.key.verify(data, signature)) {
                        // fingerprint matched
                        this.status = 1;
                    } else {
                        // fingerprint not matched
                        this.status = -1;
                    }
                }
            } else {
                this.status = 1;
            }
        }
        return this.status === 1;
    };

    var match_public_key = function (publicKey) {
        // check whether the public key equals to meta.key
        if (this.key.equals(publicKey)) {
            return true;
        }
        // check with seed & fingerprint
        if (this.hasSeed()) {
            // check whether keys equal by verifying signature
            var data = ns.type.String.from(this.seed).getBytes();
            var signature = this.fingerprint;
            return publicKey.verify(data, signature);
        } else {
            // ID with BTC/ETH address has no username
            // so we can just compare the key.data to check matching
            return false;
        }
    };

    var match_identifier = function (identifier) {
        var network = identifier.getType();
        return this.generateIdentifier(network).equals(identifier);
    };

    var match_address = function (address) {
        var network = address.getNetwork();
        return this.generateAddress(network).equals(address);
    };

    /**
     *  Check whether meta matches Public Key, ID, or Address
     *  (must call this when received a new meta from network)
     *
     * @param {PublicKey|ID|Address} key_id_addr - public key or ID or address
     * @returns {boolean}
     */
    Meta.prototype.matches = function (key_id_addr) {
        if (!this.isValid()) {
            return false;
        }
        if (key_id_addr instanceof ID) {
            return match_identifier.call(this, key_id_addr);
        } else if (key_id_addr instanceof Address) {
            return match_address.call(this, key_id_addr);
        } else if (key_id_addr instanceof PublicKey) {
            return match_public_key.call(this, key_id_addr);
        }
        // console.assert(false, 'error: ' + key_id_addr);
        return false;
    };

    /**
     *  Generate ID with meta info and network type
     *
     * @param {NetworkType|int} network - Network ID (0 ~ 255)
     * @returns {ID}
     */
    Meta.prototype.generateIdentifier = function (network) {
        var address = this.generateAddress(network);
        return new ID(this.seed, address);
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Generate address with meta info and address type
     *
     * @param {NetworkType|int} network - Network ID (0 ~ 255)
     * @returns {Address}
     */
    Meta.prototype.generateAddress = function (network) {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Generate meta with private key and seed
     *
     * @param {MetaType} type - Meta algorithm version
     * @param privateKey
     * @param {String} seed - Seed string for generating ID
     * @returns {Meta}
     */
    Meta.generate = function (type, privateKey, seed) {
        var version;
        if (type instanceof MetaType) {
            version = type.valueOf();
        } else {
            version = type;
        }
        var meta = {
            'version': version,
            'key': privateKey.getPublicKey()
        };
        if (MetaType.hasSeed(version)) {
            // generate fingerprint with private key
            var data = ns.type.String.from(seed).getBytes();
            var fingerprint = privateKey.sign(data);
            meta['seed'] = seed;
            meta['fingerprint'] = Base64.encode(fingerprint);
        }
        return Meta.getInstance(meta);
    };

    //-------- Runtime --------
    var meta_classes = {};

    /**
     *  Register meta class with type
     *
     * @param {MetaType} type - Meta algorithm version
     * @param {Class} clazz - Meta class
     */
    Meta.register = function (type, clazz) {
        var version;
        if (type instanceof MetaType) {
            version = type.valueOf();
        } else {
            version = type;
        }
        meta_classes[version] = clazz;
    };

    /**
     *  Create meta
     *
     * @param {{}|Meta} meta - Meta info
     * @returns {Meta}
     */
    Meta.getInstance = function (meta) {
        if (!meta) {
            return null;
        } else if (meta instanceof Meta) {
            return meta;
        }
        var version = meta['version'];
        if (version instanceof MetaType) {
            version = version.valueOf();
        }
        var clazz = meta_classes[version];
        if (typeof clazz !== 'function') {
            throw TypeError('meta not supported: ' + meta);
        }
        if (typeof clazz.getInstance === 'function') {
            return clazz.getInstance(meta);
        }
        return new clazz(meta);
    };

    //-------- namespace --------
    ns.Meta = Meta;

    ns.register('Meta');

}(MingKeMing);
