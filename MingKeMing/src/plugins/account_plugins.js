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


/**
 *  CryptographyKey GeneralFactory
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
mkm.plugins.GeneralAccountHelper = Interface(null, null);
var GeneralAccountHelper = mkm.plugins.GeneralAccountHelper;

GeneralAccountHelper.prototype = {

    //
    //  Algorithm Version
    //

    getMetaType: function (meta, defaultValue) {},

    getDocumentType: function (doc, defaultValue) {}

};


/**
 *  Account FactoryManager
 *  ~~~~~~~~~~~~~~~~~~~~~~
 */
mkm.plugins.SharedAccountExtensions = {

    //
    //  Address
    //
    setAddressHelper: function (helper) {
        AccountExtensions.setAddressHelper(helper);
    },
    getAddressHelper: function () {
        return AccountExtensions.getAddressHelper();
    },

    //
    //  ID
    //
    setIdentifierHelper: function (helper) {
        AccountExtensions.setIdentifierHelper(helper);
    },
    getIdentifierHelper: function () {
        return AccountExtensions.getIdentifierHelper();
    },

    //
    //  Meta
    //
    setMetaHelper: function (helper) {
        AccountExtensions.setMetaHelper(helper);
    },
    getMetaHelper: function () {
        return AccountExtensions.getMetaHelper();
    },

    //
    //  Document
    //
    setDocumentHelper: function (helper) {
        AccountExtensions.setDocumentHelper(helper);
    },
    getDocumentHelper: function () {
        return AccountExtensions.getDocumentHelper();
    },

    //
    //  General Helper
    //
    setHelper: function (helper) {
        accountHelper = helper;
    },
    getHelper: function () {
        return accountHelper;
    }

};
var SharedAccountExtensions = mkm.plugins.SharedAccountExtensions;

var accountHelper = null;
