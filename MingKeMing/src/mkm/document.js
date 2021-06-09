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

//! require 'protocol/tai.js'

(function (ns) {
    'use strict';

    var Dictionary = ns.type.Dictionary;
    var Document = ns.protocol.Document;

    /**
     *  Create base document
     *
     *  1. Create document with info
     *      new BaseDocument(map);
     *  2. Create a new empty document with ID & type
     *      new BaseDocument(identifier, type);
     *  3. Create document with data & signature loaded from local storage
     *      new BaseDocument(identifier, data, signature);
     */
    var BaseDocument = function () {
        var identifier, data, signature;
        var map, status;
        var properties;
        if (arguments.length === 1) {
            // new BaseDocument(map);
            map = arguments[0];
            identifier = Document.getIdentifier(map);
            data = Document.getData(map);
            signature = Document.getSignature(map);
            properties = null;
            status = 0;
        } else if (arguments.length === 2) {
            // new BaseDocument(identifier, type);
            identifier = arguments[0];
            var type = arguments[1];
            data = null;
            signature = null;
            map = {
                'ID': identifier.toString()
            };
            if (type && type.length > 1) {
                properties = {
                    'type': type
                };
            } else {
                properties = null;
            }
            status = 0;
        } else if (arguments.length === 3) {
            // new BaseDocument(identifier, data, signature);
            identifier = arguments[0];
            data = arguments[1];
            signature = arguments[2];
            map = {
                'ID': identifier.toString(),
                'data': ns.format.UTF8.decode(data),
                'signature': ns.format.Base64.encode(signature)
            }
            properties = null;
            // all documents must be verified before saving into local storage
            status = 1;
        } else {
            throw new SyntaxError('document arguments error: ' + arguments);
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__data = data;            // JsON.encode(properties)
        this.__signature = signature;  // LocalUser(identifier).sign(data)
        this.__properties = properties;
        this.__status = status;        // 1 for valid, -1 for invalid
    };
    ns.Class(BaseDocument, Dictionary, [Document]);

    BaseDocument.prototype.isValid = function () {
        return this.__status > 0;
    };

    BaseDocument.prototype.getType = function () {
        var type = this.getProperty('type');
        if (!type) {
            type = Document.getType(this.getMap());
        }
        return type;
    };

    BaseDocument.prototype.getIdentifier = function () {
        return this.__identifier;
    };

    //-------- properties --------

    BaseDocument.prototype.allPropertyNames = function () {
        var dict = this.getProperties();
        if (!dict) {
            return null;
        }
        return Object.keys(dict);
    };

    BaseDocument.prototype.getProperties = function () {
        if (this.__status < 0) {
            // invalid
            return null;
        }
        if (!this.__properties) {
            var data = this.__data;
            if (data) {
                this.__properties = ns.format.JSON.decode(data);
            } else {
                this.__properties = {};
            }
        }
        return this.__properties;
    };

    BaseDocument.prototype.getProperty = function (name) {
        var dict = this.getProperties();
        if (!dict) {
            return null;
        }
        return dict[name];
    };

    BaseDocument.prototype.setProperty = function (name, value) {
        // 1. reset status
        this.__status = 0;
        // 2. update property value with name
        var dict = this.getProperties();
        dict[name] = value;
        // 3. clear data signature after properties changed
        this.setValue('data', null);
        this.setValue('signature', null);
        this.__data = null;
        this.__signature = null;
    };

    //-------- signature --------

    BaseDocument.prototype.verify = function (publicKey) {
        if (this.__status > 0) {
            // already verify OK
            return true;
        }
        var data = this.__data;
        var signature = this.__signature;
        if (!data) {
            // NOTICE: if data is empty, signature should be empty at the same time
            //         this happen while profile not found
            if (!signature) {
                this.__status = 0;
            } else {
                // data signature error
                this.__status = -1;
            }
        } else if (!signature) {
            // signature error
            this.__status = -1;
        } else if (publicKey.verify(data, signature)) {
            // signature matched
            this.__status = 1;
        }
        // NOTICE: if status is 0, it doesn't mean the profile is invalid,
        //         try another key
        return this.__status > 0;
    };

    BaseDocument.prototype.sign = function (privateKey) {
        if (this.__status > 0) {
            // already signed/verified
            return this.__signature;
        }
        // update sign time
        var now = new Date();
        this.setProperty('time', now.getTime() / 1000);
        // update status
        this.__status = 1;
        // sign
        this.__data = ns.format.JSON.encode(this.getProperties());
        this.__signature = privateKey.sign(this.__data);
        this.setValue('data', ns.format.UTF8.decode(this.__data));
        this.setValue('signature', ns.format.Base64.encode(this.__signature));
        return this.__signature;
    };

    //-------- extra info --------

    BaseDocument.prototype.getTime = function () {
        var timestamp = this.getProperty('time');
        if (timestamp) {
            return new Date(timestamp * 1000);
        } else {
            return null;
        }
    };

    BaseDocument.prototype.getName = function () {
        return this.getProperty('name');
    };

    BaseDocument.prototype.setName = function (name) {
        this.setProperty('name', name);
    };

    //-------- namespace --------
    ns.mkm.BaseDocument = BaseDocument;

    ns.mkm.registers('BaseDocument');

})(MingKeMing);
