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

    var Interface = ns.type.Interface;
    var Mapper    = ns.type.Mapper;
    var TAI       = ns.protocol.TAI;

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
    var Document = Interface(null, [TAI, Mapper]);

    //
    //  Document types
    //
    Document.VISA     = 'visa';      // for login/communication
    Document.PROFILE  = 'profile';   // for user info
    Document.BULLETIN = 'bulletin';  // for group info

    /**
     *  Document type
     *
     * @return {String}
     */
    Document.prototype.getType = function () {};

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
    //  Factory methods
    //

    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory;
    };

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
        var gf = general_factory();
        return gf.createDocument(type, identifier, data, signature);
    };

    /**
     *  Parse map object to entity document
     *
     * @param {*} doc - document info
     * @return {Document}
     */
    Document.parse = function (doc) {
        var gf = general_factory();
        return gf.parseDocument(doc);
    };

    /**
     *  Register document factory with type
     *
     * @param {string} type
     * @param {DocumentFactory} factory
     */
    Document.setFactory = function (type, factory) {
        var gf = general_factory();
        gf.setDocumentFactory(type, factory);
    };
    Document.getFactory = function (type) {
        var gf = general_factory();
        return gf.getDocumentFactory(type);
    };

    /**
     *  Document Factory
     *  ~~~~~~~~~~~~~~~~
     */
    var DocumentFactory = Interface(null, null);

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

    Document.Factory = DocumentFactory;

    //-------- namespace --------
    ns.protocol.Document = Document;
    // ns.protocol.DocumentFactory = DocumentFactory;

})(MingKeMing);
