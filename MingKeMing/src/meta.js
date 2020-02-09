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
        this.version = new MetaType(map['version']);
        /**
         *  Public key (used for signature)
         *
         *      RSA / ECC
         */
        this.key = PublicKey.getInstance(map['key']);
        // seed & fingerprint
        if (this.version.hasSeed()) {
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
    ns.type.Class(Meta, Dictionary);

    Meta.prototype.equals = function (other) {
        if (!other) {
            return false;
        } else if (Dictionary.prototype.equals.call(this, other)) {
            return true;
        }
        other = Meta.getInstance(other);
        var identifier = other.generateIdentifier(NetworkType.Main);
        return this.matches(identifier);
    };

    Meta.prototype.isValid = function () {
        if (this.status === 0) {
            if (!this.key) {
                // meta.key should not be empty
                this.status = -1;
            } else if (this.version.hasSeed()) {
                if (!this.seed || !this.fingerprint) {
                    // seed and fingerprint should not be empty
                    this.status = -1;
                } else {
                    var data = (new ns.type.String(this.seed)).getBytes();
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
        if (this.version.hasSeed()) {
            // check whether keys equal by verifying signature
            var data = (new ns.type.String(this.seed)).getBytes();
            var signature = this.fingerprint;
            return publicKey.verify(data, signature);
        } else {
            // ID with BTC/ETH address has no username
            // so we can just compare the key.data to check matching
            return false;
        }
    };

    /**
     *  Check whether meta match with entity ID
     *  (must call this when received a new meta from network)
     *
     * @param identifier
     * @returns {boolean}
     */
    var match_identifier = function (identifier) {
        return this.generateIdentifier(identifier.getType()).equals(identifier);
    };

    var match_address = function (address) {
        return this.generateAddress(address.getNetwork()).equals(address);
    };

    Meta.prototype.matches = function (key_id_addr) {
        if (!this.isValid()) {
            return false;
        }
        if (key_id_addr instanceof ID) {
            return match_identifier.call(this, key_id_addr);
        } else if (key_id_addr instanceof Address) {
            return match_address.call(this, key_id_addr);
        } else if (ns.type.Object.isinstance(key_id_addr, PublicKey)) {
            return match_public_key.call(this, key_id_addr);
        }
        // console.assert(false, 'error: ' + key_id_addr);
        return false;
    };

    Meta.prototype.generateIdentifier = function (network) {
        var address = this.generateAddress(network);
        return new ID(this.seed, address);
    };

    /**
     *  Generate address with meta info and address type
     *
     * @param network
     * @returns {Address|null}
     */
    Meta.prototype.generateAddress = function (network) {
        console.assert(network instanceof NetworkType, 'network error: ' + network);
        console.assert(false, 'implement me!');
        return null;
    };

    Meta.generate = function (version, privateKey, seed) {
        var meta = {
            'version': version,
            'key': privateKey.getPublicKey()
        };
        if (!(version instanceof MetaType)) {
            version = new MetaType(version);
        }
        if (version.hasSeed()) {
            // generate fingerprint with private key
            var data = (new ns.type.String(seed)).getBytes();
            var fingerprint = privateKey.sign(data);
            meta['seed'] = seed;
            meta['fingerprint'] = Base64.encode(fingerprint);
        }
        return Meta.getInstance(meta);
    };

    //-------- Runtime --------
    var meta_classes = {};

    Meta.register = function (version, clazz) {
        if (version instanceof MetaType) {
            version = version.value;
        }
        meta_classes[version] = clazz;
    };

    Meta.getInstance = function (meta) {
        if (!meta) {
            return null;
        } else if (meta instanceof Meta) {
            return meta;
        }
        var version = meta['version'];
        if (version instanceof MetaType) {
            version = version.value;
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
