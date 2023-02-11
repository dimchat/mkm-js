/**
 * MingKeMing - User Module (v0.2.2)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Feb. 9, 2023
 * @copyright (c) 2023 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MingKeMing !== "object") {
    MingKeMing = {};
}
(function (ns) {
    if (typeof ns.type !== "object") {
        ns.type = MONKEY.type;
    }
    if (typeof ns.format !== "object") {
        ns.format = MONKEY.format;
    }
    if (typeof ns.digest !== "object") {
        ns.digest = MONKEY.digest;
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = MONKEY.crypto;
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = {};
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = {};
    }
})(MingKeMing);
(function (ns) {
    var EntityType = ns.type.Enum(null, {
        USER: 0,
        GROUP: 1,
        STATION: 2,
        ISP: 3,
        BOT: 4,
        ICP: 5,
        SUPERVISOR: 6,
        COMPANY: 7,
        ANY: 128,
        EVERY: 129
    });
    EntityType.isUser = function (network) {
        var user = EntityType.USER.valueOf();
        var group = EntityType.GROUP.valueOf();
        return (network & group) === user;
    };
    EntityType.isGroup = function (network) {
        var group = EntityType.GROUP.valueOf();
        return (network & group) === group;
    };
    EntityType.isBroadcast = function (network) {
        var any = EntityType.ANY.valueOf();
        return (network & any) === any;
    };
    ns.protocol.EntityType = EntityType;
})(MingKeMing);
(function (ns) {
    var MetaType = ns.type.Enum(null, {
        DEFAULT: 1,
        MKM: 1,
        BTC: 2,
        ExBTC: 3,
        ETH: 4,
        ExETH: 5
    });
    MetaType.hasSeed = function (version) {
        var mkm = MetaType.MKM.valueOf();
        return (version & mkm) === mkm;
    };
    ns.protocol.MetaType = MetaType;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Stringer = ns.type.Stringer;
    var Address = Interface(null, [Stringer]);
    Address.ANYWHERE = null;
    Address.EVERYWHERE = null;
    Address.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Address.prototype.isBroadcast = function () {
        throw new Error("NotImplemented");
    };
    Address.prototype.isUser = function () {
        throw new Error("NotImplemented");
    };
    Address.prototype.isGroup = function () {
        throw new Error("NotImplemented");
    };
    var AddressFactory = Interface(null, null);
    AddressFactory.prototype.generateAddress = function (meta, network) {
        throw new Error("NotImplemented");
    };
    AddressFactory.prototype.createAddress = function (address) {
        throw new Error("NotImplemented");
    };
    AddressFactory.prototype.parseAddress = function (address) {
        throw new Error("NotImplemented");
    };
    Address.Factory = AddressFactory;
    var general_factory = function () {
        var man = ns.mkm.FactoryManager;
        return man.generalFactory;
    };
    Address.setFactory = function (factory) {
        var gf = general_factory();
        gf.setAddressFactory(factory);
    };
    Address.getFactory = function () {
        var gf = general_factory();
        return gf.getAddressFactory();
    };
    Address.generate = function (meta, network) {
        var gf = general_factory();
        return gf.generateAddress(meta, network);
    };
    Address.create = function (address) {
        var gf = general_factory();
        return gf.createAddress(address);
    };
    Address.parse = function (address) {
        var gf = general_factory();
        return gf.parseAddress(address);
    };
    ns.protocol.Address = Address;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Stringer = ns.type.Stringer;
    var Address = ns.protocol.Address;
    var ID = Interface(null, [Stringer]);
    ID.ANYONE = null;
    ID.EVERYONE = null;
    ID.FOUNDER = null;
    ID.prototype.getName = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.getAddress = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.getTerminal = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.isBroadcast = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.isUser = function () {
        throw new Error("NotImplemented");
    };
    ID.prototype.isGroup = function () {
        throw new Error("NotImplemented");
    };
    ID.convert = function (list) {
        var gf = general_factory();
        return gf.convertIDList(list);
    };
    ID.revert = function (list) {
        var gf = general_factory();
        return gf.revertIDList(list);
    };
    var IDFactory = Interface(null, null);
    IDFactory.prototype.generateID = function (meta, network, terminal) {
        throw new Error("NotImplemented");
    };
    IDFactory.prototype.createID = function (name, address, terminal) {
        throw new Error("NotImplemented");
    };
    IDFactory.prototype.parseID = function (identifier) {
        throw new Error("NotImplemented");
    };
    ID.Factory = IDFactory;
    var general_factory = function () {
        var man = ns.mkm.FactoryManager;
        return man.generalFactory;
    };
    ID.setFactory = function (factory) {
        var gf = general_factory();
        gf.setIDFactory(factory);
    };
    ID.getFactory = function () {
        var gf = general_factory();
        return gf.getIDFactory();
    };
    ID.generate = function (meta, network, terminal) {
        var gf = general_factory();
        return gf.generateID(meta, network, terminal);
    };
    ID.create = function (name, address, terminal) {
        var gf = general_factory();
        return gf.createID(name, address, terminal);
    };
    ID.parse = function (identifier) {
        var gf = general_factory();
        return gf.parseID(identifier);
    };
    ns.protocol.ID = ID;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var PublicKey = ns.crypto.PublicKey;
    var Address = ns.protocol.Address;
    var MetaType = ns.protocol.MetaType;
    var ID = ns.protocol.ID;
    var Meta = Interface(null, [Mapper]);
    Meta.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Meta.prototype.getKey = function () {
        throw new Error("NotImplemented");
    };
    Meta.prototype.getSeed = function () {
        throw new Error("NotImplemented");
    };
    Meta.prototype.getFingerprint = function () {
        throw new Error("NotImplemented");
    };
    Meta.prototype.generateAddress = function (network) {
        throw new Error("NotImplemented");
    };
    Meta.check = function (meta) {
        var gf = general_factory();
        return gf.checkMeta(meta);
    };
    Meta.matchID = function (identifier, meta) {
        var gf = general_factory();
        return gf.matchID(identifier, meta);
    };
    Meta.matchKey = function (key, meta) {
        var gf = general_factory();
        return gf.matchKey(key, meta);
    };
    var MetaFactory = Interface(null, null);
    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
        throw new Error("NotImplemented");
    };
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
        throw new Error("NotImplemented");
    };
    MetaFactory.prototype.parseMeta = function (meta) {
        throw new Error("NotImplemented");
    };
    Meta.Factory = MetaFactory;
    var general_factory = function () {
        var man = ns.mkm.FactoryManager;
        return man.generalFactory;
    };
    Meta.setFactory = function (version, factory) {
        var gf = general_factory();
        gf.setMetaFactory(version, factory);
    };
    Meta.getFactory = function (version) {
        var gf = general_factory();
        return gf.getMetaFactory(version);
    };
    Meta.create = function (version, key, seed, fingerprint) {
        var gf = general_factory();
        return gf.createMeta(version, key, seed, fingerprint);
    };
    Meta.generate = function (version, sKey, seed) {
        var gf = general_factory();
        return gf.generateMeta(version, sKey, seed);
    };
    Meta.parse = function (meta) {
        var gf = general_factory();
        return gf.parseMeta(meta);
    };
    ns.protocol.Meta = Meta;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var TAI = Interface(null, null);
    TAI.prototype.isValid = function () {
        throw new Error("NotImplemented");
    };
    TAI.prototype.verify = function (publicKey) {
        throw new Error("NotImplemented");
    };
    TAI.prototype.sign = function (privateKey) {
        throw new Error("NotImplemented");
    };
    TAI.prototype.allProperties = function () {
        throw new Error("NotImplemented");
    };
    TAI.prototype.getProperty = function (name) {
        throw new Error("NotImplemented");
    };
    TAI.prototype.setProperty = function (name, value) {
        throw new Error("NotImplemented");
    };
    ns.protocol.TAI = TAI;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var TAI = ns.protocol.TAI;
    var ID = ns.protocol.ID;
    var Document = Interface(null, [TAI, Mapper]);
    Document.VISA = "visa";
    Document.PROFILE = "profile";
    Document.BULLETIN = "bulletin";
    Document.prototype.getType = function () {
        throw new Error("NotImplemented");
    };
    Document.prototype.getIdentifier = function () {
        throw new Error("NotImplemented");
    };
    Document.prototype.getTime = function () {
        throw new Error("NotImplemented");
    };
    Document.prototype.getName = function () {
        throw new Error("NotImplemented");
    };
    Document.prototype.setName = function (name) {
        throw new Error("NotImplemented");
    };
    var DocumentFactory = Interface(null, null);
    DocumentFactory.prototype.createDocument = function (
        identifier,
        data,
        signature
    ) {
        throw new Error("NotImplemented");
    };
    DocumentFactory.prototype.parseDocument = function (doc) {
        throw new Error("NotImplemented");
    };
    Document.Factory = DocumentFactory;
    var general_factory = function () {
        var man = ns.mkm.FactoryManager;
        return man.generalFactory;
    };
    Document.setFactory = function (type, factory) {
        var gf = general_factory();
        gf.setDocumentFactory(type, factory);
    };
    Document.getFactory = function (type) {
        var gf = general_factory();
        return gf.getDocumentFactory(type);
    };
    Document.create = function (type, identifier, data, signature) {
        var gf = general_factory();
        return gf.createDocument(type, identifier, data, signature);
    };
    Document.parse = function (doc) {
        var gf = general_factory();
        return gf.parseDocument(doc);
    };
    ns.protocol.Document = Document;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Document = ns.protocol.Document;
    var Visa = Interface(null, [Document]);
    Visa.prototype.getKey = function () {
        throw new Error("NotImplemented");
    };
    Visa.prototype.setKey = function (publicKey) {
        throw new Error("NotImplemented");
    };
    Visa.prototype.getAvatar = function () {
        throw new Error("NotImplemented");
    };
    Visa.prototype.setAvatar = function (url) {
        throw new Error("NotImplemented");
    };
    var Bulletin = Interface(null, [Document]);
    Bulletin.prototype.getAssistants = function () {
        throw new Error("NotImplemented");
    };
    Bulletin.prototype.setAssistants = function (assistants) {
        throw new Error("NotImplemented");
    };
    ns.protocol.Visa = Visa;
    ns.protocol.Bulletin = Bulletin;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var ConstantString = ns.type.ConstantString;
    var EntityType = ns.protocol.EntityType;
    var Address = ns.protocol.Address;
    var BroadcastAddress = function (string, network) {
        ConstantString.call(this, string);
        if (network instanceof EntityType) {
            network = network.valueOf();
        }
        this.__network = network;
    };
    Class(BroadcastAddress, ConstantString, [Address], null);
    BroadcastAddress.prototype.getType = function () {
        return this.__network;
    };
    BroadcastAddress.prototype.isBroadcast = function () {
        return true;
    };
    BroadcastAddress.prototype.isUser = function () {
        var any = EntityType.ANY.valueOf();
        return this.__network === any;
    };
    BroadcastAddress.prototype.isGroup = function () {
        var every = EntityType.EVERY.valueOf();
        return this.__network === every;
    };
    Address.ANYWHERE = new BroadcastAddress("anywhere", EntityType.ANY);
    Address.EVERYWHERE = new BroadcastAddress("everywhere", EntityType.EVERY);
    ns.mkm.BroadcastAddress = BroadcastAddress;
})(MingKeMing);
(function (ns) {
    var Class = ns.type.Class;
    var ConstantString = ns.type.ConstantString;
    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var Identifier = function (identifier, name, address, terminal) {
        ConstantString.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal;
    };
    Class(Identifier, ConstantString, [ID], null);
    Identifier.prototype.getName = function () {
        return this.__name;
    };
    Identifier.prototype.getAddress = function () {
        return this.__address;
    };
    Identifier.prototype.getTerminal = function () {
        return this.__terminal;
    };
    Identifier.prototype.getType = function () {
        return this.getAddress().getType();
    };
    Identifier.prototype.isBroadcast = function () {
        return this.getAddress().isBroadcast();
    };
    Identifier.prototype.isUser = function () {
        return this.getAddress().isUser();
    };
    Identifier.prototype.isGroup = function () {
        return this.getAddress().isGroup();
    };
    ID.ANYONE = new Identifier(
        "anyone@anywhere",
        "anyone",
        Address.ANYWHERE,
        null
    );
    ID.EVERYONE = new Identifier(
        "everyone@everywhere",
        "everyone",
        Address.EVERYWHERE,
        null
    );
    ID.FOUNDER = new Identifier("moky@anywhere", "moky", Address.ANYWHERE, null);
    ns.mkm.Identifier = Identifier;
})(MingKeMing);
(function (ns) {
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Stringer = ns.type.Stringer;
    var Wrapper = ns.type.Wrapper;
    var UTF8 = ns.format.UTF8;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var MetaType = ns.protocol.MetaType;
    var Meta = ns.protocol.Meta;
    var Document = ns.protocol.Document;
    var GeneralFactory = function () {
        this.__addressFactory = null;
        this.__idFactory = null;
        this.__metaFactories = {};
        this.__documentFactories = {};
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.setAddressFactory = function (factory) {
        this.__addressFactory = factory;
    };
    GeneralFactory.prototype.getAddressFactory = function () {
        return this.__addressFactory;
    };
    GeneralFactory.prototype.parseAddress = function (address) {
        if (!address) {
            return null;
        } else {
            if (Interface.conforms(address, Address)) {
                return address;
            }
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
    GeneralFactory.prototype.setIDFactory = function (factory) {
        this.__idFactory = factory;
    };
    GeneralFactory.prototype.getIDFactory = function () {
        return this.__idFactory;
    };
    GeneralFactory.prototype.parseID = function (identifier) {
        if (!identifier) {
            return null;
        } else {
            if (Interface.conforms(identifier, ID)) {
                return identifier;
            }
        }
        identifier = Wrapper.fetchString(identifier);
        var factory = this.getIDFactory();
        return factory.parseID(identifier);
    };
    GeneralFactory.prototype.createID = function (name, address, terminal) {
        var factory = this.getIDFactory();
        return factory.createID(name, address, terminal);
    };
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
    };
    GeneralFactory.prototype.revertIDList = function (list) {
        var array = [];
        var id;
        for (var i = 0; i < list.length; ++i) {
            id = list[i];
            if (Interface.conforms(id, Stringer)) {
                array.push(id.toString());
            } else {
                if (typeof id === "string") {
                    array.push(id);
                }
            }
        }
        return array;
    };
    var EnumToUint = function (type) {
        if (typeof type === "number") {
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
        return meta["type"];
    };
    GeneralFactory.prototype.createMeta = function (
        version,
        key,
        seed,
        fingerprint
    ) {
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
        } else {
            if (Interface.conforms(meta, Meta)) {
                return meta;
            }
        }
        meta = Wrapper.fetchMap(meta);
        var type = this.getMetaType(meta);
        var factory = this.getMetaFactory(type);
        if (!factory) {
            factory = this.getMetaFactory(0);
        }
        return factory.parseMeta(meta);
    };
    GeneralFactory.prototype.checkMeta = function (meta) {
        var key = meta.getKey();
        if (!key) {
            return false;
        }
        if (!MetaType.hasSeed(meta.getType())) {
            return true;
        }
        var seed = meta.getSeed();
        var fingerprint = meta.getFingerprint();
        if (!seed || !fingerprint) {
            return false;
        }
        return key.verify(UTF8.encode(seed), fingerprint);
    };
    GeneralFactory.prototype.matchID = function (identifier, meta) {
        if (MetaType.hasSeed(meta.getType())) {
            if (meta.getSeed() !== identifier.getName()) {
                return false;
            }
        }
        var old = identifier.getAddress();
        var gen = Address.generate(meta, old.getType());
        return old.equals(gen);
    };
    GeneralFactory.prototype.matchKey = function (key, meta) {
        if (meta.getKey().equals(key)) {
            return true;
        }
        if (MetaType.hasSeed(meta.getType())) {
            var seed = meta.getSeed();
            var fingerprint = meta.getFingerprint();
            return key.every(UTF8.encode(seed), fingerprint);
        } else {
            return false;
        }
    };
    GeneralFactory.prototype.setDocumentFactory = function (type, factory) {
        this.__documentFactories[type] = factory;
    };
    GeneralFactory.prototype.getDocumentFactory = function (type) {
        return this.__documentFactories[type];
    };
    GeneralFactory.prototype.getDocumentType = function (doc) {
        return doc["type"];
    };
    GeneralFactory.prototype.createDocument = function (
        type,
        identifier,
        data,
        signature
    ) {
        var factory = this.getDocumentFactory(type);
        return factory.createDocument(identifier, data, signature);
    };
    GeneralFactory.prototype.parseDocument = function (doc) {
        if (!doc) {
            return null;
        } else {
            if (Interface.conforms(doc, Document)) {
                return doc;
            }
        }
        doc = Wrapper.fetchMap(doc);
        var type = this.getDocumentType(doc);
        var factory = this.getDocumentFactory(type);
        if (!factory) {
            factory = this.getDocumentFactory("*");
        }
        return factory.parseDocument(doc);
    };
    var FactoryManager = { generalFactory: new GeneralFactory() };
    ns.mkm.GeneralFactory = GeneralFactory;
    ns.mkm.FactoryManager = FactoryManager;
})(MingKeMing);
