'use strict';
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


    /**
     *  User/Group Profile
     *  ~~~~~~~~~~~~~~~~~~
     *  This class is used to generate entity profile
     *
     *      data format: {
     *          ID        : "EntityID",        // entity ID
     *          type      : "visa",            // "bulletin", ...
     *          data      : "{JSON}",          // data = json_encode(info)
     *          signature : "{BASE64_ENCODE}"  // signature = sign(data, SK);
     *      }
     */
    mkm.protocol.Document = Interface(null, [TAI, Mapper]);
    var Document = mkm.protocol.Document;

    /**
     *  Entity ID
     *
     * @returns {ID}
     */
    Document.prototype.getIdentifier = function () {};

    //---- properties getter/setter

    /**
     *  Signed time
     *
     * @return {Date}
     */
    Document.prototype.getTime = function () {};

    /**
     *  Entity name
     *
     * @param {String} name
     */
    Document.prototype.setName = function (name) {};
    Document.prototype.getName = function () {};

    //
    //  Conveniences
    //

    /**
     *  Convert Maps to Documents
     *
     * @param {*[]} array
     * @return {Document[]}
     */
    Document.convert = function (array) {
        var documents = [];
        var doc;
        for (var i = 0; i < array.length; ++i) {
            doc = Document.parse(array[i]);
            if (doc) {
                documents.push(doc);
            }
        }
        return documents;
    };

    /**
     *  Convert Documents to Maps
     * @param {Document[]} documents
     * @return {*[]}
     */
    Document.revert = function (documents) {
        var array = [];
        var doc;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            if (Interface.conforms(doc, Mapper)) {
                array.push(doc.toMap());
            } else {
                array.push(doc);
            }
        }
        return array;
    };

    //
    //  Factory methods
    //

    /**
     *  Create document
     *      1. Create a new empty document with entity ID
     *      2. Create document with data & signature loaded from local storage
     *
     * @param {String} type                 - document type
     * @param {ID} identifier               - entity ID
     * @param {String} data                 - document data (JsON)
     * @param {TransportableData} signature - document signature (Base64)
     * @return {Document}
     */
    Document.create = function (type, identifier, data, signature) {
        var helper = AccountExtensions.getDocumentHelper();
        return helper.createDocument(type, identifier, data, signature);
    };

    /**
     *  Parse map object to entity document
     *
     * @param {*} doc - document info
     * @return {Document}
     */
    Document.parse = function (doc) {
        var helper = AccountExtensions.getDocumentHelper();
        return helper.parseDocument(doc);
    };

    /**
     *  Register document factory with type
     *
     * @param {string} type
     * @param {DocumentFactory} factory
     */
    Document.setFactory = function (type, factory) {
        var helper = AccountExtensions.getDocumentHelper();
        helper.setDocumentFactory(type, factory);
    };
    Document.getFactory = function (type) {
        var helper = AccountExtensions.getDocumentHelper();
        return helper.getDocumentFactory(type);
    };

    /**
     *  Document Factory
     *  ~~~~~~~~~~~~~~~~
     */
    Document.Factory = Interface(null, null);
    var DocumentFactory = Document.Factory;

    /**
     *  Create document with data & signature loaded from local storage
     *  Create a new empty document with entity ID only
     *
     * @param {ID} identifier               - entity ID
     * @param {String} data                 - document data (JsON)
     * @param {TransportableData} signature - document signature (Base64)
     * @return {Document}
     */
    DocumentFactory.prototype.createDocument = function (identifier, data, signature) {};

    /**
     *  Parse map object to entity document
     *
     * @param {*} doc - info
     * @return {Document}
     */
    DocumentFactory.prototype.parseDocument = function (doc) {};
