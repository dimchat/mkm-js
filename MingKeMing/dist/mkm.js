/**
 * MingKeMing - User Module (v1.0.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Nov. 16, 2024
 * @copyright (c) 2024 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MingKeMing !== 'object') {
    MingKeMing = {}
}
(function (ns) {
    'use strict';
    if (typeof ns.type !== 'object') {
        ns.type = MONKEY.type
    }
    if (typeof ns.format !== 'object') {
        ns.format = MONKEY.format
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = MONKEY.digest
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = MONKEY.crypto
    }
    if (typeof ns.protocol !== 'object') {
        ns.protocol = {}
    }
    if (typeof ns.mkm !== 'object') {
        ns.mkm = {}
    }
})(MingKeMing);
(function (ns) {
    'use strict';
    var EntityType = ns.type.Enum('EntityType', {
        USER: (0x00),
        GROUP: (0x01),
        STATION: (0x02),
        ISP: (0x03),
        BOT: (0x04),
        ICP: (0x05),
        SUPERVISOR: (0x06),
        COMPANY: (0x07),
        ANY: (0x80),
        EVERY: (0x81)
    });
    EntityType.isUser = function (network) {
        var user = EntityType.USER.getValue();
        var group = EntityType.GROUP.getValue();
        return (network & group) === user
    };
    EntityType.isGroup = function (network) {
        var group = EntityType.GROUP.getValue();
        return (network & group) === group
    };
    EntityType.isBroadcast = function (network) {
        var any = EntityType.ANY.getValue();
        return (network & any) === any
    };
    ns.protocol.EntityType = EntityType
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Stringer = ns.type.Stringer;
    var Address = Interface(null, [Stringer]);
    Address.prototype.getType = function () {
    };
    Address.ANYWHERE = null;
    Address.EVERYWHERE = null;
    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory
    };
    Address.generate = function (meta, network) {
        var gf = general_factory();
        return gf.generateAddress(meta, network)
    };
    Address.create = function (address) {
        var gf = general_factory();
        return gf.createAddress(address)
    };
    Address.parse = function (address) {
        var gf = general_factory();
        return gf.parseAddress(address)
    };
    Address.setFactory = function (factory) {
        var gf = general_factory();
        gf.setAddressFactory(factory)
    };
    Address.getFactory = function () {
        var gf = general_factory();
        return gf.getAddressFactory()
    };
    var AddressFactory = Interface(null, null);
    AddressFactory.prototype.generateAddress = function (meta, network) {
    };
    AddressFactory.prototype.createAddress = function (address) {
    };
    AddressFactory.prototype.parseAddress = function (address) {
    };
    Address.Factory = AddressFactory;
    ns.protocol.Address = Address
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Stringer = ns.type.Stringer;
    var ID = Interface(null, [Stringer]);
    ID.prototype.getName = function () {
    };
    ID.prototype.getAddress = function () {
    };
    ID.prototype.getTerminal = function () {
    };
    ID.prototype.getType = function () {
    };
    ID.prototype.isBroadcast = function () {
    };
    ID.prototype.isUser = function () {
    };
    ID.prototype.isGroup = function () {
    };
    ID.ANYONE = null;
    ID.EVERYONE = null;
    ID.FOUNDER = null;
    ID.convert = function (list) {
        var gf = general_factory();
        return gf.convertIdentifiers(list)
    };
    ID.revert = function (list) {
        var gf = general_factory();
        return gf.revertIdentifiers(list)
    };
    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory
    };
    ID.generate = function (meta, network, terminal) {
        var gf = general_factory();
        return gf.generateIdentifier(meta, network, terminal)
    };
    ID.create = function (name, address, terminal) {
        var gf = general_factory();
        return gf.createIdentifier(name, address, terminal)
    };
    ID.parse = function (identifier) {
        var gf = general_factory();
        return gf.parseIdentifier(identifier)
    };
    ID.setFactory = function (factory) {
        var gf = general_factory();
        gf.setIdentifierFactory(factory)
    };
    ID.getFactory = function () {
        var gf = general_factory();
        return gf.getIdentifierFactory()
    };
    var IDFactory = Interface(null, null);
    IDFactory.prototype.generateIdentifier = function (meta, network, terminal) {
    };
    IDFactory.prototype.createIdentifier = function (name, address, terminal) {
    };
    IDFactory.prototype.parseIdentifier = function (identifier) {
    };
    ID.Factory = IDFactory;
    ns.protocol.ID = ID
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var Meta = Interface(null, [Mapper]);
    Meta.MKM = 'mkm';
    Meta.BTC = 'btc';
    Meta.ETH = 'eth';
    Meta.prototype.getType = function () {
    };
    Meta.prototype.getPublicKey = function () {
    };
    Meta.prototype.getSeed = function () {
    };
    Meta.prototype.getFingerprint = function () {
    };
    Meta.prototype.generateAddress = function (network) {
    };
    Meta.prototype.isValid = function () {
    };
    Meta.prototype.matchIdentifier = function (identifier) {
    };
    Meta.prototype.matchPublicKey = function (pKey) {
    };
    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory
    };
    Meta.create = function (type, key, seed, fingerprint) {
        var gf = general_factory();
        return gf.createMeta(type, key, seed, fingerprint)
    };
    Meta.generate = function (type, sKey, seed) {
        var gf = general_factory();
        return gf.generateMeta(type, sKey, seed)
    };
    Meta.parse = function (meta) {
        var gf = general_factory();
        return gf.parseMeta(meta)
    };
    Meta.setFactory = function (type, factory) {
        var gf = general_factory();
        gf.setMetaFactory(type, factory)
    };
    Meta.getFactory = function (type) {
        var gf = general_factory();
        return gf.getMetaFactory(type)
    };
    var MetaFactory = Interface(null, null);
    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
    };
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
    };
    MetaFactory.prototype.parseMeta = function (meta) {
    };
    Meta.Factory = MetaFactory;
    ns.protocol.Meta = Meta
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var TAI = Interface(null, null);
    TAI.prototype.isValid = function () {
    };
    TAI.prototype.verify = function (pKey) {
    };
    TAI.prototype.sign = function (sKey) {
    };
    TAI.prototype.allProperties = function () {
    };
    TAI.prototype.getProperty = function (name) {
    };
    TAI.prototype.setProperty = function (name, value) {
    };
    ns.protocol.TAI = TAI
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var TAI = ns.protocol.TAI;
    var Document = Interface(null, [TAI, Mapper]);
    Document.VISA = 'visa';
    Document.PROFILE = 'profile';
    Document.BULLETIN = 'bulletin';
    Document.prototype.getType = function () {
    };
    Document.prototype.getIdentifier = function () {
    };
    Document.prototype.getTime = function () {
    };
    Document.prototype.setName = function (name) {
    };
    Document.prototype.getName = function () {
    };
    var general_factory = function () {
        var man = ns.mkm.AccountFactoryManager;
        return man.generalFactory
    };
    Document.create = function (type, identifier, data, signature) {
        var gf = general_factory();
        return gf.createDocument(type, identifier, data, signature)
    };
    Document.parse = function (doc) {
        var gf = general_factory();
        return gf.parseDocument(doc)
    };
    Document.setFactory = function (type, factory) {
        var gf = general_factory();
        gf.setDocumentFactory(type, factory)
    };
    Document.getFactory = function (type) {
        var gf = general_factory();
        return gf.getDocumentFactory(type)
    };
    var DocumentFactory = Interface(null, null);
    DocumentFactory.prototype.createDocument = function (identifier, data, signature) {
    };
    DocumentFactory.prototype.parseDocument = function (doc) {
    };
    Document.Factory = DocumentFactory;
    ns.protocol.Document = Document
})(MingKeMing);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var Enum = ns.type.Enum;
    var ConstantString = ns.type.ConstantString;
    var EntityType = ns.protocol.EntityType;
    var Address = ns.protocol.Address;
    var BroadcastAddress = function (string, network) {
        ConstantString.call(this, string);
        this.__network = Enum.getInt(network)
    };
    Class(BroadcastAddress, ConstantString, [Address], null);
    BroadcastAddress.prototype.getType = function () {
        return this.__network
    };
    Address.ANYWHERE = new BroadcastAddress('anywhere', EntityType.ANY);
    Address.EVERYWHERE = new BroadcastAddress('everywhere', EntityType.EVERY);
    ns.mkm.BroadcastAddress = BroadcastAddress
})(MingKeMing);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var ConstantString = ns.type.ConstantString;
    var EntityType = ns.protocol.EntityType;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Identifier = function (identifier, name, address, terminal) {
        ConstantString.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal
    };
    Class(Identifier, ConstantString, [ID], null);
    Identifier.prototype.getName = function () {
        return this.__name
    };
    Identifier.prototype.getAddress = function () {
        return this.__address
    };
    Identifier.prototype.getTerminal = function () {
        return this.__terminal
    };
    Identifier.prototype.getType = function () {
        return this.__address.getType()
    };
    Identifier.prototype.isBroadcast = function () {
        var network = this.getType();
        return EntityType.isBroadcast(network)
    };
    Identifier.prototype.isUser = function () {
        var network = this.getType();
        return EntityType.isUser(network)
    };
    Identifier.prototype.isGroup = function () {
        var network = this.getType();
        return EntityType.isGroup(network)
    };
    Identifier.create = function (name, address, terminal) {
        var string = Identifier.concat(name, address, terminal);
        return new Identifier(string, name, address, terminal)
    };
    Identifier.concat = function (name, address, terminal) {
        var string = address.toString();
        if (name && name.length > 0) {
            string = name + '@' + string
        }
        if (terminal && terminal.length > 0) {
            string = string + '/' + terminal
        }
        return string
    };
    ID.ANYONE = Identifier.create("anyone", Address.ANYWHERE, null);
    ID.EVERYONE = Identifier.create("everyone", Address.EVERYWHERE, null);
    ID.FOUNDER = Identifier.create("moky", Address.ANYWHERE, null);
    ns.mkm.Identifier = Identifier
})(MingKeMing);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var Stringer = ns.type.Stringer;
    var Wrapper = ns.type.Wrapper;
    var Converter = ns.type.Converter;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var GeneralFactory = function () {
        this.__addressFactory = null;
        this.__idFactory = null;
        this.__metaFactories = {};
        this.__documentFactories = {}
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.setAddressFactory = function (factory) {
        this.__addressFactory = factory
    };
    GeneralFactory.prototype.getAddressFactory = function () {
        return this.__addressFactory
    };
    GeneralFactory.prototype.parseAddress = function (address) {
        if (!address) {
            return null
        } else if (Interface.conforms(address, Address)) {
            return address
        }
        var str = Wrapper.fetchString(address);
        var factory = this.getAddressFactory();
        return factory.parseAddress(str)
    };
    GeneralFactory.prototype.createAddress = function (address) {
        var factory = this.getAddressFactory();
        return factory.createAddress(address)
    };
    GeneralFactory.prototype.generateAddress = function (meta, network) {
        var factory = this.getAddressFactory();
        return factory.generateAddress(meta, network)
    };
    GeneralFactory.prototype.setIdentifierFactory = function (factory) {
        this.__idFactory = factory
    };
    GeneralFactory.prototype.getIdentifierFactory = function () {
        return this.__idFactory
    };
    GeneralFactory.prototype.parseIdentifier = function (identifier) {
        if (!identifier) {
            return null
        } else if (Interface.conforms(identifier, ID)) {
            return identifier
        }
        var str = Wrapper.fetchString(identifier);
        var factory = this.getIdentifierFactory();
        return factory.parseIdentifier(str)
    };
    GeneralFactory.prototype.createIdentifier = function (name, address, terminal) {
        var factory = this.getIdentifierFactory();
        return factory.createIdentifier(name, address, terminal)
    }
    GeneralFactory.prototype.generateIdentifier = function (meta, network, terminal) {
        var factory = this.getIdentifierFactory();
        return factory.generateIdentifier(meta, network, terminal)
    };
    GeneralFactory.prototype.convertIdentifiers = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = ID.parse(members[i]);
            if (id) {
                array.push(id)
            }
        }
        return array
    }
    GeneralFactory.prototype.revertIdentifiers = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = members[i];
            if (Interface.conforms(id, Stringer)) {
                array.push(id.toString())
            } else if (IObject.isString(id)) {
                array.push(id)
            }
        }
        return array
    };
    GeneralFactory.prototype.setMetaFactory = function (type, factory) {
        this.__metaFactories[type] = factory
    };
    GeneralFactory.prototype.getMetaFactory = function (type) {
        return this.__metaFactories[type]
    };
    GeneralFactory.prototype.getMetaType = function (meta, defaultVersion) {
        var type = meta['type'];
        return Converter.getString(type, defaultVersion)
    };
    GeneralFactory.prototype.createMeta = function (type, key, seed, fingerprint) {
        var factory = this.getMetaFactory(type);
        return factory.createMeta(key, seed, fingerprint)
    };
    GeneralFactory.prototype.generateMeta = function (type, sKey, seed) {
        var factory = this.getMetaFactory(type);
        return factory.generateMeta(sKey, seed)
    };
    GeneralFactory.prototype.parseMeta = function (meta) {
        if (!meta) {
            return null
        } else if (Interface.conforms(meta, Meta)) {
            return meta
        }
        var info = Wrapper.fetchMap(meta);
        if (!info) {
            return null
        }
        var type = this.getMetaType(info, '*');
        var factory = this.getMetaFactory(type);
        if (!factory) {
            factory = this.getMetaFactory('*')
        }
        return factory.parseMeta(info)
    };
    GeneralFactory.prototype.setDocumentFactory = function (type, factory) {
        this.__documentFactories[type] = factory
    };
    GeneralFactory.prototype.getDocumentFactory = function (type) {
        return this.__documentFactories[type]
    };
    GeneralFactory.prototype.getDocumentType = function (doc, defaultType) {
        var type = doc['type'];
        return Converter.getString(type, defaultType)
    };
    GeneralFactory.prototype.createDocument = function (type, identifier, data, signature) {
        var factory = this.getDocumentFactory(type);
        return factory.createDocument(identifier, data, signature)
    };
    GeneralFactory.prototype.parseDocument = function (doc) {
        if (!doc) {
            return null
        } else if (Interface.conforms(doc, Document)) {
            return doc
        }
        var info = Wrapper.fetchMap(doc);
        if (!info) {
            return null
        }
        var type = this.getDocumentType(info, '*');
        var factory = this.getDocumentFactory(type);
        if (!factory) {
            factory = this.getDocumentFactory('*')
        }
        return factory.parseDocument(info)
    };
    var FactoryManager = {generalFactory: new GeneralFactory()};
    ns.mkm.AccountGeneralFactory = GeneralFactory;
    ns.mkm.AccountFactoryManager = FactoryManager
})(MingKeMing);
