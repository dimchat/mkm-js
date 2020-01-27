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

//! require <crypto.js>
//! require 'entity.js'

!function (ns) {

    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;

    var EntityDataSource = ns.EntityDataSource;
    var Entity = ns.Entity;

    /**
     *  User Data Source
     *  ~~~~~~~~~~~~~~~~
     *
     *  (Encryption/decryption)
     *  1. public key for encryption
     *     if profile.key not exists, means it is the same key with meta.key
     *  2. private keys for decryption
     *     the private keys paired with [profile.key, meta.key]
     *
     *  (Signature/Verification)
     *  3. private key for signature
     *     the private key paired with meta.key
     *  4. public keys for verification
     *     [meta.key]
     */
    var UserDataSource = function () {
    };
    UserDataSource.inherits(EntityDataSource);

    /**
     *  Get contacts list
     *
     * @param identifier - user ID
     * @returns {ID[]}
     */
    UserDataSource.prototype.getContacts = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get user's public key for encryption
     *  (profile.key or meta.key)
     *
     * @param identifier - user ID
     * @returns {EncryptKey}
     */
    UserDataSource.prototype.getPublicKeyForEncryption = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get user's private keys for decryption
     *  (which paired with [profile.key, meta.key])
     *
     * @param identifier - user ID
     * @returns {DecryptKey[]}
     */
    UserDataSource.prototype.getPrivateKeysForDecryption = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get user's private key for signature
     *  (which paired with profile.key or meta.key)
     *
     * @param identifier - user ID
     * @returns {SignKey}
     */
    UserDataSource.prototype.getPrivateKeyForSignature = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get user's public keys for verification
     *  [profile.key, meta.key]
     *
     * @param identifier
     * @returns {VerifyKey[]}
     */
    UserDataSource.prototype.getPublicKeysForVerification = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  User account for communication
     *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     *  This class is for creating user account
     *
     *  functions:
     *      (User)
     *      1. verify(data, signature) - verify (encrypted content) data and signature
     *      2. encrypt(data)           - encrypt (symmetric key) data
     *      (LocalUser)
     *      3. sign(data)    - calculate signature of (encrypted content) data
     *      4. decrypt(data) - decrypt (symmetric key) data
     */
    var User = function (identifier) {
        Entity.call(this, identifier);
    };
    User.inherits(Entity);

    /**
     *  Get all contacts of the user
     *
     * @returns {ID[]}
     */
    User.prototype.getContacts = function () {
        return this.delegate.getContacts(this.identifier);
    };

    var meta_key = function () {
        var meta = this.getMeta();
        // NOTICE: if meta not exists, user won't be created
        return meta.key;
    };

    var profile_key = function () {
        var profile = this.getProfile();
        if (!profile || !profile.isValid()) {
            return null;
        }
        return profile.getKey();
    };

    // NOTICE: meta.key will never changed, so use profile.key to encrypt
    //         is the better way
    var encrypt_key = function () {
        // 0. get key from data source
        var key = this.delegate.getPublicKeyForEncryption(this.identifier);
        if (key) {
            return key;
        }
        // 1. get key from profile
        key = profile_key.call(this);
        if (key) {
            return key;
        }
        // 2. get key from meta
        key = meta_key.call(this);
        if (key && key.isinstanceof(EncryptKey)) {
            return key;
        }
        throw Error('failed to get encrypt key for user: ' + this.identifier);
    };

    // NOTICE: I suggest using the private key paired with meta.key to sign message
    //         so here should return the meta.key
    var verify_keys = function () {
        // 0. get keys from data source
        var keys = this.delegate.getPublicKeysForVerification(this.identifier);
        if (keys && keys.length > 0) {
            return keys;
        }
        keys = [];
        // 1. get key from profile
        var key = profile_key.call(this);
        if (key && key.isinstanceof(VerifyKey)) {
            keys.push(key);
        }
        // 2. get key from meta
        key = meta_key.call(this);
        keys.push(key);
        return keys;
    };

    /**
     *  Verify data and signature with user's public keys
     *
     * @param data
     * @param signature
     * @returns {boolean}
     */
    User.prototype.verify = function (data, signature) {
        var keys = verify_keys.call(this);
        if (keys) {
            for (var i = 0; i < keys.length; ++i) {
                if (keys[i].verify(data, signature)) {
                    // matched!
                    return true;
                }
            }
        }
        return false;
    };

    /**
     *  Encrypt data, try profile.key first, if not found, use meta.key
     *
     * @param plaintext
     * @returns {*[]}
     */
    User.prototype.encrypt = function (plaintext) {
        var key = encrypt_key.call(this);
        if (!key) {
            throw Error('failed to get encrypt key for user: ' + this.identifier);
        }
        return key.encrypt(plaintext);
    };

    //
    //  Interfaces for Local User
    //

    // NOTICE: I suggest use the private key which paired to meta.key
    //         to sign message
    var sign_key = function () {
        return this.delegate.getPrivateKeyForSignature(this.identifier);
    };

    // NOTICE: if you provide a public key in profile for encryption
    //         here you should return the private key paired with profile.key
    var decrypt_keys = function () {
        return this.delegate.getPrivateKeysForDecryption(this.identifier);
    };

    /**
     *  Sign data with user's private key
     *
     * @param data
     * @returns {*[]}
     */
    User.prototype.sign = function (data) {
        var key = sign_key.call(this);
        return key.sign(data);
    };

    User.prototype.decrypt = function (ciphertext) {
        var plaintext;
        var keys = decrypt_keys.call(this);
        for (var i = 0; i < keys.length; ++i) {
            try {
                plaintext = keys[i].decrypt(ciphertext);
                if (plaintext && plaintext.length > 0) {
                    // OK!
                    return plaintext;
                }
            } catch (e) {
                // this key not match, try next one
            }
        }
        // decryption failed
        return null;
    };

    //-------- namespace --------
    ns.UserDataSource = UserDataSource;
    ns.User = User;

}(DIMP);
