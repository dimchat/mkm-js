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

//! require 'identifier.js'
//! require 'meta.js'
//! require 'profile.js'

!function (ns) {
    'use strict';

    var EntityDataSource = function () {
    };
    ns.type.Interface(EntityDataSource);

    /**
     *  Get meta for entity ID
     *
     * @param identifier
     * @returns {Meta}
     */
    EntityDataSource.prototype.getMeta = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get profile for entity ID
     *
     * @param identifier
     * @returns {Profile}
     */
    EntityDataSource.prototype.getProfile = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.EntityDataSource = EntityDataSource;

    ns.register('EntityDataSource');

}(MingKeMing);

!function (ns) {
    'use strict';

    var EntityDataSource = ns.EntityDataSource;

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
    ns.type.Interface(UserDataSource, EntityDataSource);

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
        // console.assert(false, 'implement me!');
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
        // console.assert(false, 'implement me!');
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

    //-------- namespace --------
    ns.UserDataSource = UserDataSource;

    ns.register('UserDataSource');

}(MingKeMing);

!function (ns) {
    'use strict';

    var EntityDataSource = ns.EntityDataSource;

    var GroupDataSource = function () {
    };
    ns.type.Interface(GroupDataSource, EntityDataSource);

    /**
     *  Get group founder
     *
     * @param identifier - group ID
     * @returns {ID}
     */
    GroupDataSource.prototype.getFounder = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get group owner
     *
     * @param identifier - group ID
     * @returns {ID}
     */
    GroupDataSource.prototype.getOwner = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get group members list
     *
     * @param identifier - group ID
     * @returns {ID[]}
     */
    GroupDataSource.prototype.getMembers = function (identifier) {
        console.assert(identifier !== null, 'ID empty');
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.GroupDataSource = GroupDataSource;

    ns.register('GroupDataSource');

}(MingKeMing);
