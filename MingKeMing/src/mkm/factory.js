;
// license: https://mit-license.org
//
//  Ming-Ke-Ming : Decentralized User Identity Authentication
//
//                               Written in 2023 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2023 Albert Moky
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

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class     = ns.type.Class;
    var IObject   = ns.type.Object;
    var Stringer  = ns.type.Stringer;
    var Wrapper   = ns.type.Wrapper;
    var Converter = ns.type.Converter;

    var Address  = ns.protocol.Address;
    var ID       = ns.protocol.ID;
    var Meta     = ns.protocol.Meta;
    var Document = ns.protocol.Document;

    /**
     *  Account GeneralFactory
     *  ~~~~~~~~~~~~~~~~~~~~~~
     */
    var GeneralFactory = function () {
        this.__addressFactory = null;
        this.__idFactory = null;
        this.__metaFactories = {};      // type => Meta.Factory
        this.__documentFactories = {};  // type => Document.Factory
    };
    Class(GeneralFactory, null, null, null);

    //
    //  Address
    //

    GeneralFactory.prototype.setAddressFactory = function (factory) {
        this.__addressFactory = factory;
    };
    GeneralFactory.prototype.getAddressFactory = function () {
        return this.__addressFactory;
    };

    GeneralFactory.prototype.parseAddress = function (address) {
        if (!address) {
            return null;
        } else if (Interface.conforms(address, Address)) {
            return address;
        }
        var str = Wrapper.fetchString(address);
        var factory = this.getAddressFactory();
        return factory.parseAddress(str);
    };

    GeneralFactory.prototype.createAddress = function (address) {
        var factory = this.getAddressFactory();
        return factory.createAddress(address);
    };

    GeneralFactory.prototype.generateAddress = function (meta, network) {
        var factory = this.getAddressFactory();
        return factory.generateAddress(meta, network);
    };

    //
    //  ID
    //

    GeneralFactory.prototype.setIdentifierFactory = function (factory) {
        this.__idFactory = factory;
    };
    GeneralFactory.prototype.getIdentifierFactory = function () {
        return this.__idFactory;
    };

    GeneralFactory.prototype.parseIdentifier = function (identifier) {
        if (!identifier) {
            return null;
        } else if (Interface.conforms(identifier, ID)) {
            return identifier;
        }
        var str = Wrapper.fetchString(identifier);
        var factory = this.getIdentifierFactory();
        return factory.parseIdentifier(str);
    };
    GeneralFactory.prototype.createIdentifier = function (name, address, terminal) {
        var factory = this.getIdentifierFactory();
        return factory.createIdentifier(name, address, terminal);
    }
    GeneralFactory.prototype.generateIdentifier = function (meta, network, terminal) {
        var factory = this.getIdentifierFactory();
        return factory.generateIdentifier(meta, network, terminal);
    };

    GeneralFactory.prototype.convertIdentifiers = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = ID.parse(members[i]);
            if (id) {
                array.push(id);
            }
        }
        return array;
    }
    GeneralFactory.prototype.revertIdentifiers = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = members[i];
            if (Interface.conforms(id, Stringer)) {
                array.push(id.toString());
            } else if (IObject.isString(id)) {
                array.push(id);
            }
        }
        return array;
    };

    //
    //  Meta
    //

    GeneralFactory.prototype.setMetaFactory = function (type, factory) {
        this.__metaFactories[type] = factory;
    };
    GeneralFactory.prototype.getMetaFactory = function (type) {
        return this.__metaFactories[type];
    };

    GeneralFactory.prototype.getMetaType = function (meta, defaultVersion) {
        var type = meta['type'];
        return Converter.getString(type, defaultVersion)
    };

    /*/
    GeneralFactory.prototype.hashMetaSeed = function (meta) {
        var type = this.getMetaType(meta, '');
        return type === '1' || type === 'mkm';
    };
    GeneralFactory.prototype.getMetaSeed = function (meta) {
        if (!this.hashMetaSeed(meta)) {
            return null;
        }
        var seed = meta['seed'];
        return Converter.getString(seed, '');
    };
    /*/

    GeneralFactory.prototype.createMeta = function (type, key, seed, fingerprint) {
        var factory = this.getMetaFactory(type);
        return factory.createMeta(key, seed, fingerprint);
    };
    GeneralFactory.prototype.generateMeta = function (type, sKey, seed) {
        var factory = this.getMetaFactory(type);
        return factory.generateMeta(sKey, seed);
    };
    GeneralFactory.prototype.parseMeta = function (meta) {
        if (!meta) {
            return null;
        } else if (Interface.conforms(meta, Meta)) {
            return meta;
        }
        var info = Wrapper.fetchMap(meta);
        if (!info) {
            return null;
        }
        var type = this.getMetaType(info, '*');
        var factory = this.getMetaFactory(type);
        if (!factory) {
            factory = this.getMetaFactory('*');  // unknown
        }
        return factory.parseMeta(info);
    };

    //
    //  Document
    //

    GeneralFactory.prototype.setDocumentFactory = function (type, factory) {
        this.__documentFactories[type] = factory;
    };
    GeneralFactory.prototype.getDocumentFactory = function (type) {
        return this.__documentFactories[type];
    };

    GeneralFactory.prototype.getDocumentType = function (doc, defaultType) {
        var type = doc['type'];
        return Converter.getString(type, defaultType)
    };
    GeneralFactory.prototype.createDocument = function (type, identifier, data, signature) {
        var factory = this.getDocumentFactory(type);
        return factory.createDocument(identifier, data, signature);
    };
    GeneralFactory.prototype.parseDocument = function (doc) {
        if (!doc) {
            return null;
        } else if (Interface.conforms(doc, Document)) {
            return doc;
        }
        var info = Wrapper.fetchMap(doc);
        if (!info) {
            return null;
        }
        var type = this.getDocumentType(info, '*');
        var factory = this.getDocumentFactory(type);
        if (!factory) {
            factory = this.getDocumentFactory('*');  // unknown
        }
        return factory.parseDocument(info);
    };

    var FactoryManager = {
        generalFactory: new GeneralFactory()
    };

    //-------- namespace --------
    ns.mkm.AccountGeneralFactory = GeneralFactory;
    ns.mkm.AccountFactoryManager = FactoryManager;

})(MingKeMing);
