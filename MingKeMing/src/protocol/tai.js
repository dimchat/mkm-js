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
//! require 'identifier.js'

(function (ns) {
    'use strict';

    /**
     *  The Additional Information
     *
     *      'Meta' is the information for entity which never changed,
     *          which contains the key for verify signature;
     *      'TAI' is the variable part,
     *          which could contain a public key for asymmetric encryption.
     */
    var TAI = function () {
    };
    ns.Interface(TAI, null);

    /**
     *  Check if signature matched
     *
     * @returns {boolean}
     */
    TAI.prototype.isValid = function () {
        console.assert(false, 'implement me!');
        return false;
    };

    //-------- signature --------

    // noinspection JSUnusedLocalSymbols
    /**
     *  Verify 'data' and 'signature' with public key
     *
     * @param {VerifyKey} publicKey
     * @returns {boolean}
     */
    TAI.prototype.verify = function (publicKey) {
        console.assert(false, 'implement me!');
        return false;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Encode properties to 'data' and sign it to 'signature'
     *
     * @param {SignKey} privateKey
     * @returns {Uint8Array}
     */
    TAI.prototype.sign = function (privateKey) {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- properties --------

    /**
     *  Get all names for properties
     *
     * @returns {String[]}
     */
    TAI.prototype.allPropertyNames = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get profile property data with key
     *
     * @param {String} name - property name
     * @returns {Object}
     */
    TAI.prototype.getProperty = function (name) {
        console.assert(false, 'implement me!');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Update profile property with key and data
     *  (this will reset 'data' and 'signature')
     *
     * @param {String} name - property name
     * @param {Object} value - property value
     */
    TAI.prototype.setProperty = function (name, value) {
        console.assert(false, 'implement me!');
    };

    //-------- namespace --------
    ns.protocol.TAI = TAI;

    ns.protocol.registers('TAI');

})(MingKeMing);

(function (ns) {
    'use strict';

    var map = ns.type.Map;
    var TAI = ns.protocol.TAI;
    var ID = ns.protocol.ID;

    /**
     *  User/Group Profile
     *  ~~~~~~~~~~~~~~~~~~
     *  This class is used to generate entity profile
     *
     *      data format: {
     *          ID: "EntityID",   // entity ID
     *          data: "{JSON}",   // data = json_encode(info)
     *          signature: "..."  // signature = sign(data, SK);
     *      }
     */
    var Document = function () {
    };
    ns.Interface(Document, [TAI, map]);

    //
    //  Document types
    //
    Document.VISA = 'visa';          // for login/communication
    Document.PROFILE = 'profile';    // for user info
    Document.BULLETIN = 'bulletin';  // for group info

    /**
     *  Get document type
     *
     * @return {String}
     */
    Document.prototype.getType = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    Document.getType = function (doc) {
        return doc['type'];
    };

    /**
     *  Get entity ID
     *
     * @returns {ID}
     */
    Document.prototype.getIdentifier = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    Document.getIdentifier = function (doc) {
        return ID.parse(doc['ID']);
    };

    Document.getData = function (doc) {
        var utf8 = doc['data'];
        if (utf8) {
            return ns.format.UTF8.encode(utf8);
        } else {
            return null;
        }
    };
    Document.getSignature = function (doc) {
        var base64 = doc['signature'];
        if (base64) {
            return ns.format.Base64.decode(base64);
        } else {
            return null;
        }
    };

    //---- properties getter/setter

    /**
     *  Get sign time
     *
     * @return {Date}
     */
    Document.prototype.getTime = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get entity name
     *
     * @return {String}
     */
    Document.prototype.getName = function () {
        console.assert(false, 'implement me!');
        return null;
    };
    Document.prototype.setName = function (name) {
        console.assert(false, 'implement me!');
    };

    //-------- namespace --------
    ns.protocol.Document = Document;

    ns.protocol.registers('Document');

})(MingKeMing);

(function (ns) {
    'use strict';

    var map = ns.type.Map;
    var Document = ns.protocol.Document;

    /**
     *  Document Factory
     *  ~~~~~~~~~~~~~~~~
     */
    var DocumentFactory = function () {
    };
    ns.Interface(DocumentFactory, null);

    // noinspection JSUnusedLocalSymbols
    DocumentFactory.prototype.createDocument = function (identifier, data, signature) {
        console.assert(false, 'implement me!');
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    DocumentFactory.prototype.parseDocument = function (doc) {
        console.assert(false, 'implement me!');
        return null;
    };

    Document.Factory = DocumentFactory;

    var s_factories = {};  // type(String) -> DocumentFactory

    /**
     *  Register document factory with type
     *
     * @param {String} type
     * @param {DocumentFactory} factory
     */
    Document.register = function (type, factory) {
        s_factories[type] = factory;
    };
    Document.getFactory = function (type) {
        return s_factories[type];
    };

    /**
     *  Create document
     *      1. Create a new empty document with entity ID
     *      2. Create document with data & signature loaded from local storage
     *
     * @param {String} type                 - document type
     * @param {ID} identifier               - entity ID
     * @param {Uint8Array|String} data      - document data
     * @param {Uint8Array|String} signature - document signature
     * @return {Document}
     */
    Document.create = function (type, identifier, data, signature) {
        var factory = Document.getFactory(type);
        if (!factory) {
            throw new ReferenceError('document type not support: ' + type);
        }
        return factory.createDocument(identifier, data, signature);
    };

    /**
     *  Parse map object to entity document
     *
     * @param {{String:Object}} doc - document info
     * @return {Document}
     */
    Document.parse = function (doc) {
        if (!doc) {
            return null;
        } else if (ns.Interface.conforms(doc, Document)) {
            return doc;
        } else if (ns.Interface.conforms(doc, map)) {
            doc = doc.getMap();
        }
        var type = Document.getType(doc);
        var factory = Document.getFactory(type);
        if (!factory) {
            factory = Document.getFactory('*');  // unknown
        }
        return factory.parseDocument(doc);
    };

})(MingKeMing);
