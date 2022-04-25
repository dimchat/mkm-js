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

//! require 'protocol/document.js'

(function (ns) {
    'use strict';

    var UTF8 = ns.format.UTF8;
    var Base64 = ns.format.Base64;
    var JSON = ns.format.JSON;
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
        var map, status;
        var identifier, data;
        var properties;
        if (arguments.length === 1) {
            // new BaseDocument(map);
            map = arguments[0];
            status = 0;
            // lazy
            identifier = null;
            data = null;
            properties = null;
        } else if (arguments.length === 2) {
            // new BaseDocument(identifier, type);
            identifier = arguments[0];
            var type = arguments[1];
            map = {
                'ID': identifier.toString()
            };
            status = 0;
            data = null;
            if (type && type.length > 1) {
                properties = {
                    'type': type
                };
            } else {
                properties = null;
            }
        } else if (arguments.length === 3) {
            // new BaseDocument(identifier, data, signature);
            identifier = arguments[0];
            data = arguments[1];
            var signature = arguments[2];
            map = {
                'ID': identifier.toString(),
                'data': data,
                'signature': signature
            }
            status = 1;  // all documents must be verified before saving into local storage
            properties = null;
        } else {
            throw new SyntaxError('document arguments error: ' + arguments);
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__json = data;      // JsON.encode(properties)
        this.__sig = null;       // LocalUser(identifier).sign(data)
        this.__properties = properties;
        this.__status = status;  // 1 for valid, -1 for invalid
    };
    ns.Class(BaseDocument, Dictionary, [Document]);

    // Override
    BaseDocument.prototype.isValid = function () {
        return this.__status > 0;
    };

    // Override
    BaseDocument.prototype.getType = function () {
        var type = this.getProperty('type');
        if (!type) {
            var dict = this.toMap();
            type = Document.getType(dict);
        }
        return type;
    };

    // Override
    BaseDocument.prototype.getIdentifier = function () {
        if (this.__identifier === null) {
            var dict = this.toMap();
            this.__identifier = Document.getIdentifier(dict);
        }
        return this.__identifier;
    };

    // private
    BaseDocument.prototype.getData = function () {
        if (this.__json === null) {
            this.__json = this.getValue('data');
        }
        return this.__json;
    };

    // private
    BaseDocument.prototype.getSignature = function () {
        if (this.__sig === null) {
            var base64 = this.getValue('signature');
            if (base64) {
                this.__sig = Base64.decode(base64);
            }
        }
        return this.__sig;
    };

    //-------- properties --------

    // Override
    BaseDocument.prototype.allProperties = function () {
        if (this.__status < 0) {
            // invalid
            return null;
        }
        if (this.__properties === null) {
            var data = this.getData();
            if (data) {
                var json = UTF8.decode(data);
                this.__properties = JSON.decode(json);
            } else {
                this.__properties = {};
            }
        }
        return this.__properties;
    };

    // Override
    BaseDocument.prototype.getProperty = function (name) {
        var dict = this.allProperties();
        if (!dict) {
            return null;
        }
        return dict[name];
    };

    // Override
    BaseDocument.prototype.setProperty = function (name, value) {
        // 1. reset status
        this.__status = 0;
        // 2. update property value with name
        var dict = this.allProperties();
        dict[name] = value;
        // 3. clear data signature after properties changed
        this.removeValue('data');
        this.removeValue('signature');
        this.__json = null;
        this.__sig = null;
    };

    //-------- signature --------

    // Override
    BaseDocument.prototype.verify = function (publicKey) {
        if (this.__status > 0) {
            // already verify OK
            return true;
        }
        var data = this.getData();
        var signature = this.getSignature();
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
        } else if (publicKey.verify(UTF8.encode(data), signature)) {
            // signature matched
            this.__status = 1;
        }
        // NOTICE: if status is 0, it doesn't mean the profile is invalid,
        //         try another key
        return this.__status > 0;
    };

    // Override
    BaseDocument.prototype.sign = function (privateKey) {
        if (this.__status > 0) {
            // already signed/verified
            return this.getSignature();
        }
        // update sign time
        var now = new Date();
        this.setProperty('time', now.getTime() / 1000.0);
        // update status
        this.__status = 1;
        // sign
        var dict = this.allProperties();
        var json = JSON.encode(dict);
        var data = UTF8.encode(json);
        var sig = privateKey.sign(data);
        var b64 = Base64.encode(sig);
        this.__json = json;
        this.__sig = sig;
        this.setValue('data', json);
        this.setValue('signature', b64);
        return this.__sig;
    };

    //-------- extra info --------

    // Override
    BaseDocument.prototype.getTime = function () {
        var timestamp = this.getProperty('time');
        if (timestamp) {
            return new Date(timestamp * 1000);
        } else {
            return null;
        }
    };

    // Override
    BaseDocument.prototype.getName = function () {
        return this.getProperty('name');
    };

    // Override
    BaseDocument.prototype.setName = function (name) {
        this.setProperty('name', name);
    };

    //-------- namespace --------
    ns.mkm.BaseDocument = BaseDocument;

    ns.mkm.registers('BaseDocument');

})(MingKeMing);
