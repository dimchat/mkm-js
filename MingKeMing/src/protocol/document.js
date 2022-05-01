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

//! require 'tai.js'

(function (ns) {
    'use strict';

    var Mapper = ns.type.Mapper;
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
    var Document = function () {};
    ns.Interface(Document, [TAI, Mapper]);

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
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get entity ID
     *
     * @returns {ID}
     */
    Document.prototype.getIdentifier = function () {
        ns.assert(false, 'implement me!');
        return null;
    };

    //---- properties getter/setter

    /**
     *  Get sign time
     *
     * @return {Date}
     */
    Document.prototype.getTime = function () {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get entity name
     *
     * @return {String}
     */
    Document.prototype.getName = function () {
        ns.assert(false, 'implement me!');
        return null;
    };
    Document.prototype.setName = function (name) {
        ns.assert(false, 'implement me!');
    };

    Document.getType = function (doc) {
        return doc['type'];
    };
    Document.getIdentifier = function (doc) {
        return ID.parse(doc['ID']);
    };

    /**
     *  Document Factory
     *  ~~~~~~~~~~~~~~~~
     */
    var DocumentFactory = function () {};
    ns.Interface(DocumentFactory, null);

    DocumentFactory.prototype.createDocument = function (identifier, data, signature) {
        ns.assert(false, 'implement me!');
        return null;
    };

    DocumentFactory.prototype.parseDocument = function (doc) {
        ns.assert(false, 'implement me!');
        return null;
    };

    Document.Factory = DocumentFactory;

    //
    //  Instances of DocumentFactory
    //
    var s_factories = {};  // type(String) -> DocumentFactory

    /**
     *  Register document factory with type
     *
     * @param {String} type
     * @param {DocumentFactory} factory
     */
    Document.setFactory = function (type, factory) {
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
     * @param {String} type      - document type
     * @param {ID} identifier    - entity ID
     * @param {String} data      - document data (JsON)
     * @param {String} signature - document signature (Base64)
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
     * @param {*} doc - document info
     * @return {Document}
     */
    Document.parse = function (doc) {
        if (!doc) {
            return null;
        } else if (ns.Interface.conforms(doc, Document)) {
            return doc;
        }
        doc = ns.type.Wrapper.fetchMap(doc);
        var type = Document.getType(doc);
        var factory = Document.getFactory(type);
        if (!factory) {
            factory = Document.getFactory('*');  // unknown
        }
        return factory.parseDocument(doc);
    };

    //-------- namespace --------
    ns.protocol.Document = Document;

    ns.protocol.registers('Document');

})(MingKeMing);
