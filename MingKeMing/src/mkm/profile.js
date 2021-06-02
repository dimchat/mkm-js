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

    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;

    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.BaseDocument;

    var BaseVisa = function () {
        if (arguments.length === 3) {
            // new BaseVisa(identifier, data, signature);
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else if (arguments[0] instanceof ID) {
            // new BaseVisa(identifier);
            BaseDocument.call(this, arguments[0], Document.VISA);
        } else if (arguments.length === 1) {
            // new BaseVisa(map);
            BaseDocument.call(this, arguments[0]);
        }
        this.key = null;
    };
    ns.Class(BaseVisa, BaseDocument, [Visa]);

    /**
     *  Public key (used for encryption, can be same with meta.key)
     *
     *      RSA
     *
     * @returns {EncryptKey}
     */
    BaseVisa.prototype.getKey = function () {
        if (!this.key) {
            var key = this.getProperty('key');
            if (key) {
                key = PublicKey.parse(key);
                if (key instanceof EncryptKey) {
                    this.key = key;
                }
            }
        }
        return this.key;
    };
    BaseVisa.prototype.setKey = function (publicKey) {
        this.setProperty('key', publicKey.getMap());
        this.key = publicKey;
    };

    //-------- extra info --------

    BaseVisa.prototype.getAvatar = function () {
        return this.getProperty('avatar');
    };

    BaseVisa.prototype.setAvatar = function (url) {
        this.setProperty('avatar', url);
    };

    //-------- namespace --------
    ns.BaseVisa = BaseVisa;

    ns.register('BaseVisa');

})(MingKeMing);

(function (ns) {
    'use strict';

    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.BaseDocument;

    var BaseBulletin = function () {
        if (arguments.length === 3) {
            // new BaseBulletin(identifier, data, signature);
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else if (arguments[0] instanceof ID) {
            // new BaseBulletin(identifier);
            BaseDocument.call(this, arguments[0], Document.BULLETIN);
        } else if (arguments.length === 1) {
            // new BaseBulletin(map);
            BaseDocument.call(this, arguments[0]);
        }
        this.assistants = null;
    };
    ns.Class(BaseBulletin, BaseDocument, [Bulletin]);

    //-------- extra info --------

    /**
     *  Get group assistants
     *
     * @return {ID[]} bot ID list
     */
    BaseBulletin.prototype.getAssistants = function () {
        if (!this.assistants) {
            var assistants = this.getProperty('assistants');
            if (assistants) {
                this.assistants = ID.convert(assistants);
            }
        }
        return this.assistants;
    };
    /**
     *  Set group assistants
     * @param {ID[]} assistants
     */
    BaseBulletin.prototype.setAssistants = function (assistants) {
        if (assistants && assistants.length > 0) {
            this.setProperty('assistants', ID.revert(assistants));
        } else {
            this.setProperty('assistants', null);
        }
    };

    //-------- namespace --------
    ns.BaseBulletin = BaseBulletin;

    ns.register('BaseBulletin');

})(MingKeMing);