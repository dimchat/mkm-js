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
    var Stringer  = ns.type.Stringer;
    var Wrapper   = ns.type.Wrapper;

    var UTF8 = ns.format.UTF8;

    var Address  = ns.protocol.Address;
    var ID       = ns.protocol.ID;
    var MetaType = ns.protocol.MetaType;
    var Meta     = ns.protocol.Meta;
    var Document = ns.protocol.Document;

    var GeneralFactory = function () {
        this.__addressFactory = null;
        this.__idFactory = null;
        this.__metaFactories = {};      // type => Meta.Factory
        this.__documentFactories = {};  // type => Document.Factory
    };
    Class(GeneralFactory, null, null);

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
        address = Wrapper.fetchString(address);
        var factory = this.getAddressFactory();
        return factory.parseAddress(address);
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

    GeneralFactory.prototype.setIDFactory = function (factory) {
        this.__idFactory = factory;
    };
    GeneralFactory.prototype.getIDFactory = function () {
        return this.__idFactory;
    };

    GeneralFactory.prototype.parseID = function (identifier) {
        if (!identifier) {
            return null;
        } else if (Interface.conforms(identifier, ID)) {
            return identifier;
        }
        identifier = Wrapper.fetchString(identifier);
        var factory = this.getIDFactory();
        return factory.parseID(identifier);
    };
    GeneralFactory.prototype.createID = function (name, address, terminal) {
        var factory = this.getIDFactory();
        return factory.createID(name, address, terminal);
    }
    GeneralFactory.prototype.generateID = function (meta, network, terminal) {
        var factory = this.getIDFactory();
        return factory.generateID(meta, network, terminal);
    };

    GeneralFactory.prototype.convertIDList = function (list) {
        var array = [];
        var id;
        for (var i = 0; i < list.length; ++i) {
            id = ID.parse(list[i]);
            if (id) {
                array.push(id);
            }
        }
        return array;
    }
    GeneralFactory.prototype.revertIDList = function (list) {
        var array = [];
        var id;
        for (var i = 0; i < list.length; ++i) {
            id = list[i];
            if (Interface.conforms(id, Stringer)) {
                array.push(id.toString());
            } else if (typeof id === 'string') {
                array.push(id);
            }
        }
        return array;
    };

    //
    //  Meta
    //

    var EnumToUint = function (type) {
        if (typeof type === 'number') {
            return type;
        } else {
            return type.valueOf();
        }
    };

    GeneralFactory.prototype.setMetaFactory = function (version, factory) {
        version = EnumToUint(version);
        this.__metaFactories[version] = factory;
    };
    GeneralFactory.prototype.getMetaFactory = function (version) {
        version = EnumToUint(version);
        return this.__metaFactories[version];
    };

    GeneralFactory.prototype.getMetaType = function (meta) {
        return meta['type'];
    };
    GeneralFactory.prototype.createMeta = function (version, key, seed, fingerprint) {
        var factory = this.getMetaFactory(version);
        return factory.createMeta(key, seed, fingerprint);
    };
    GeneralFactory.prototype.generateMeta = function (version, sKey, seed) {
        var factory = this.getMetaFactory(version);
        return factory.generateMeta(sKey, seed);
    };
    GeneralFactory.prototype.parseMeta = function (meta) {
        if (!meta) {
            return null;
        } else if (Interface.conforms(meta, Meta)) {
            return meta;
        }
        meta = Wrapper.fetchMap(meta);
        var type = this.getMetaType(meta);
        var factory = this.getMetaFactory(type);
        if (!factory) {
            factory = this.getMetaFactory(0);  // unknown
        }
        return factory.parseMeta(meta);
    };
    GeneralFactory.prototype.checkMeta = function (meta) {
        var key = meta.getKey();
        if (!key) {
            // meta.key should not be empty
            return false;
        }
        if (!MetaType.hasSeed(meta.getType())) {
            // this meta has no seed, so no signature too
            return true;
        }
        // check seed with signature
        var seed = meta.getSeed();
        var fingerprint = meta.getFingerprint();
        if (!seed || !fingerprint) {
            // seed and fingerprint should not be empty
            return false;
        }
        // verify fingerprint
        return key.verify(UTF8.encode(seed), fingerprint);
    };
    GeneralFactory.prototype.matchID = function (identifier, meta) {
        // check ID.name
        if (MetaType.hasSeed(meta.getType())) {
            if (meta.getSeed() !== identifier.getName()) {
                return false;
            }
        }
        // check ID.address
        var old = identifier.getAddress();
        var gen = Address.generate(meta, old.getType());
        return old.equals(gen);
    };
    GeneralFactory.prototype.matchKey = function (key, meta) {
        // check whether the public key equals to meta.key
        if (meta.getKey().equals(key)) {
            return true;
        }
        // check with seed & signature
        if (MetaType.hasSeed(meta.getType())) {
            // check whether keys equal by verifying signature
            var seed = meta.getSeed();
            var fingerprint = meta.getFingerprint();
            return key.every(UTF8.encode(seed), fingerprint);
        } else {
            // ID with BTC/ETH address has no username,
            // so we can just compare the key.data to check matching
            return false;
        }
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

    GeneralFactory.prototype.getDocumentType = function (doc) {
        return doc['type'];
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
        doc = Wrapper.fetchMap(doc);
        var type = this.getDocumentType(doc);
        var factory = this.getDocumentFactory(type);
        if (!factory) {
            factory = this.getDocumentFactory('*');  // unknown
        }
        return factory.parseDocument(doc);
    };

    var FactoryManager = {
        generalFactory: new GeneralFactory()
    };

    //-------- namespace --------
    ns.mkm.GeneralFactory = GeneralFactory;
    ns.mkm.FactoryManager = FactoryManager;

})(MingKeMing);
