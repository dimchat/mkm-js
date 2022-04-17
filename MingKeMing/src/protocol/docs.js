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

//! require 'document.js'

(function (ns) {
    'use strict';

    var Document = ns.protocol.Document;

    /**
     *  User Document
     *  ~~~~~~~~~~~~~
     *  This interface is defined for authorizing other apps to login,
     *  which can generate a temporary asymmetric key pair for messaging.
     */
    var Visa = function () {};
    ns.Interface(Visa, [Document]);

    /**
     *  Get public key to encrypt message for user
     *
     * @returns {EncryptKey} public key as visa.key
     */
    Visa.prototype.getKey = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Set public key for other user to encrypt message
     *
     * @param {EncryptKey} publicKey - public key as visa.key
     */
    Visa.prototype.setKey = function (publicKey) {
        console.assert(false, 'implement me!');
    };

    /**
     *  Get avatar URL
     *
     * @returns {String} URL string
     */
    Visa.prototype.getAvatar = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Set avatar URL
     *
     * @param {String} url - URL string
     */
    Visa.prototype.setAvatar = function (url) {
        console.assert(false, 'implement me!');
    };

    //-------- namespace --------
    ns.protocol.Visa = Visa;

    ns.protocol.registers('Visa');

})(MingKeMing);

(function (ns) {
    'use strict';

    var Document = ns.protocol.Document;

    /**
     *  Group Document
     *  ~~~~~~~~~~~~~~
     */
    var Bulletin = function () {};
    ns.Interface(Bulletin, [Document]);

    /**
     *  Get group assistants
     *
     * @return {ID[]} bot ID list
     */
    Bulletin.prototype.getAssistants = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Set group assistants
     *
     * @param {ID[]} assistants - bot ID list
     */
    Bulletin.prototype.setAssistants = function (assistants) {
        console.assert(false, 'implement me!');
    };

    //-------- namespace --------
    ns.protocol.Bulletin = Bulletin;

    ns.protocol.registers('Bulletin');

})(MingKeMing);
