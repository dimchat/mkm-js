'use strict';
// license: https://mit-license.org
//
//  Ming-Ke-Ming : Decentralized User Identity Authentication
//
//                               Written in 2025 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2025 Albert Moky
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

//! require 'protocol/address.js'
//! require 'protocol/identifier.js'
//! require 'protocol/meta.js'
//! require 'protocol/document.js'


mkm.plugins.AddressHelper = Interface(null, null);
var AddressHelper = mkm.plugins.AddressHelper;

AddressHelper.prototype = {

    setAddressFactory: function (factory) {},
    getAddressFactory: function () {},

    parseAddress: function (address) {},

    generateAddress: function (meta, network) {}

};


mkm.plugins.IdentifierHelper = Interface(null, null);
var IdentifierHelper = mkm.plugins.IdentifierHelper;

IdentifierHelper.prototype = {

    setIdentifierFactory: function (factory) {},
    getIdentifierFactory: function () {},

    parseIdentifier: function (identifier) {},

    createIdentifier: function (name, address, terminal) {},

    generateIdentifier: function (meta, network, terminal) {}

};


mkm.plugins.MetaHelper = Interface(null, null);
var MetaHelper = mkm.plugins.MetaHelper;

MetaHelper.prototype = {

    setMetaFactory: function (type, factory) {},
    getMetaFactory: function (type) {},

    /**
     *  Create meta from local storage
     *
     * @param {String} type
     * @param {VerifyKey} key
     * @param {String} seed
     * @param {TransportableData} fingerprint
     */
    createMeta: function (type, key, seed, fingerprint) {},

    /**
     *  Generate new meta
     *
     * @param {String} type
     * @param {SignKey} sKey
     * @param {String} seed
     */
    generateMeta: function (type, sKey, seed) {},

    parseMeta: function (meta) {}

};


mkm.plugins.DocumentHelper = Interface(null, null);
var DocumentHelper = mkm.plugins.DocumentHelper;

DocumentHelper.prototype = {

    setDocumentFactory: function (type, factory) {},
    getDocumentFactory: function (type) {},

    /**
     *  Create document from local storage
     *
     * @param {String} type
     * @param {ID} identifier
     * @param {String} data
     * @param {TransportableData} signature
     */
    createDocument: function (type, identifier, data, signature) {},

    parseDocument: function (doc) {}

};


/**
 *  Account FactoryManager
 *  ~~~~~~~~~~~~~~~~~~~~~~
 */
mkm.plugins.AccountExtensions = {

    /**
     *  Init address helper
     *
     * @param {AddressHelper} helper
     */
    setAddressHelper: function (helper) {
        addressHelper = helper;
    },
    getAddressHelper: function () {
        return addressHelper;
    },

    /**
     *  Init did helper
     *
     * @param {IdentifierHelper} helper
     */
    setIdentifierHelper: function (helper) {
        idHelper = helper;
    },
    getIdentifierHelper: function () {
        return idHelper;
    },

    /**
     *  Init meta helper
     *
     * @param {MetaHelper} helper
     */
    setMetaHelper: function (helper) {
        metaHelper = helper;
    },
    getMetaHelper: function () {
        return metaHelper;
    },

    /**
     *  Init document helper
     *
     * @param {DocumentHelper} helper
     */
    setDocumentHelper: function (helper) {
        docHelper = helper;
    },
    getDocumentHelper: function () {
        return docHelper;
    }

};
var AccountExtensions = mkm.plugins.AccountExtensions;

var addressHelper = null;
var idHelper = null;
var metaHelper = null;
var docHelper = null;
