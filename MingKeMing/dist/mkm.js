/**
 * MingKeMing - User Module (v0.2.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Apr. 18, 2022
 * @copyright (c) 2022 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MingKeMing !== "object") {
    MingKeMing = new MONKEY.Namespace();
}
(function (ns, base) {
    base.exports(ns);
    if (typeof ns.assert !== "function") {
        ns.assert = console.assert;
    }
    if (typeof ns.protocol !== "object") {
        ns.protocol = new ns.Namespace();
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = new ns.Namespace();
    }
    ns.registers("protocol");
    ns.registers("mkm");
})(MingKeMing, MONKEY);
(function (ns) {
    var NetworkType = ns.type.Enum(null, {
        BTC_MAIN: 0,
        MAIN: 8,
        GROUP: 16,
        POLYLOGUE: 16,
        CHATROOM: 48,
        PROVIDER: 118,
        STATION: 136,
        THING: 128,
        ROBOT: 200
    });
    NetworkType.isUser = function (network) {
        var main = NetworkType.MAIN.valueOf();
        var btcMain = NetworkType.BTC_MAIN.valueOf();
        return (network & main) === main || network === btcMain;
    };
    NetworkType.isGroup = function (network) {
        var group = NetworkType.GROUP.valueOf();
        return (network & group) === group;
    };
    ns.protocol.NetworkType = NetworkType;
    ns.protocol.registers("NetworkType");
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
    ns.protocol.registers("MetaType");
})(MingKeMing);
(function (ns) {
    var Stringer = ns.type.Stringer;
    var Address = function () {};
    ns.Interface(Address, [Stringer]);
    Address.ANYWHERE = null;
    Address.EVERYWHERE = null;
    Address.prototype.getNetwork = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    Address.prototype.isBroadcast = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    Address.prototype.isUser = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    Address.prototype.isGroup = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    var AddressFactory = function () {};
    ns.Interface(AddressFactory, null);
    AddressFactory.prototype.generateAddress = function (meta, network) {
        ns.assert(false, "implement me!");
        return null;
    };
    AddressFactory.prototype.createAddress = function (address) {
        ns.assert(false, "implement me!");
        return null;
    };
    AddressFactory.prototype.parseAddress = function (address) {
        ns.assert(false, "implement me!");
        return null;
    };
    Address.Factory = AddressFactory;
    var s_factory = null;
    Address.setFactory = function (factory) {
        s_factory = factory;
    };
    Address.getFactory = function () {
        return s_factory;
    };
    Address.generate = function (meta, network) {
        var factory = Address.getFactory();
        return factory.generateAddress(meta, network);
    };
    Address.create = function (address) {
        var factory = Address.getFactory();
        return factory.createAddress(address);
    };
    Address.parse = function (address) {
        if (!address) {
            return null;
        } else {
            if (ns.Interface.conforms(address, Address)) {
                return address;
            }
        }
        address = ns.type.Wrapper.fetchString(address);
        var factory = Address.getFactory();
        return factory.parseAddress(address);
    };
    ns.protocol.Address = Address;
    ns.protocol.registers("Address");
})(MingKeMing);
(function (ns) {
    var Stringer = ns.type.Stringer;
    var Address = ns.protocol.Address;
    var ID = function () {};
    ns.Interface(ID, [Stringer]);
    ID.ANYONE = null;
    ID.EVERYONE = null;
    ID.FOUNDER = null;
    ID.prototype.getName = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ID.prototype.getAddress = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ID.prototype.getTerminal = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    ID.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    ID.prototype.isBroadcast = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    ID.prototype.isUser = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    ID.prototype.isGroup = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    ID.convert = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = ID.parse(members[i]);
            if (id) {
                array.push(id);
            }
        }
        return array;
    };
    ID.revert = function (members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = members[i];
            if (ns.Interface.conforms(id, Stringer)) {
                array.push(id.toString());
            } else {
                if (typeof id === "string") {
                    array.push(id);
                }
            }
        }
        return array;
    };
    var IDFactory = function () {};
    ns.Interface(IDFactory, null);
    IDFactory.prototype.generateID = function (meta, network, terminal) {
        ns.assert(false, "implement me!");
        return null;
    };
    IDFactory.prototype.createID = function (name, address, terminal) {
        ns.assert(false, "implement me!");
        return null;
    };
    IDFactory.prototype.parseID = function (identifier) {
        ns.assert(false, "implement me!");
        return null;
    };
    ID.Factory = IDFactory;
    var s_factory;
    ID.setFactory = function (factory) {
        s_factory = factory;
    };
    ID.getFactory = function () {
        return s_factory;
    };
    ID.generate = function (meta, network, terminal) {
        var factory = ID.getFactory();
        return factory.generateID(meta, network, terminal);
    };
    ID.create = function (name, address, terminal) {
        var factory = ID.getFactory();
        return factory.createID(name, address, terminal);
    };
    ID.parse = function (identifier) {
        if (!identifier) {
            return null;
        } else {
            if (ns.Interface.conforms(identifier, ID)) {
                return identifier;
            }
        }
        identifier = ns.type.Wrapper.fetchString(identifier);
        var factory = ID.getFactory();
        return factory.parseID(identifier);
    };
    ns.protocol.ID = ID;
    ns.protocol.registers("ID");
})(MingKeMing);
(function (ns) {
    var Mapper = ns.type.Mapper;
    var Base64 = ns.format.Base64;
    var UTF8 = ns.format.UTF8;
    var PublicKey = ns.crypto.PublicKey;
    var Address = ns.protocol.Address;
    var MetaType = ns.protocol.MetaType;
    var ID = ns.protocol.ID;
    var Meta = function () {};
    ns.Interface(Meta, [Mapper]);
    Meta.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    Meta.prototype.getKey = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Meta.prototype.getSeed = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Meta.prototype.getFingerprint = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Meta.prototype.generateAddress = function (network) {
        ns.assert(false, "implement me!");
        return null;
    };
    Meta.getType = function (meta) {
        var version = meta["type"];
        if (!version) {
            version = meta["version"];
        }
        return version;
    };
    Meta.getKey = function (meta) {
        var key = meta["key"];
        if (!key) {
            throw new TypeError("meta key not found: " + meta);
        }
        return PublicKey.parse(key);
    };
    Meta.getSeed = function (meta) {
        return meta["seed"];
    };
    Meta.getFingerprint = function (meta) {
        var base64 = meta["fingerprint"];
        if (!base64) {
            return null;
        }
        return Base64.decode(base64);
    };
    Meta.check = function (meta) {
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
    Meta.matches = function (meta, id_or_key) {
        if (ns.Interface.conforms(id_or_key, ID)) {
            return match_id(meta, id_or_key);
        } else {
            if (ns.Interface.conforms(id_or_key, PublicKey)) {
                return match_key(meta, id_or_key);
            } else {
                return false;
            }
        }
    };
    var match_id = function (meta, id) {
        if (MetaType.hasSeed(meta.getType())) {
            if (meta.getSeed() !== id.getName()) {
                return false;
            }
        }
        var address = Address.generate(meta, id.getType());
        return id.getAddress().equals(address);
    };
    var match_key = function (meta, key) {
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
    var EnumToUint = function (type) {
        if (typeof type === "number") {
            return type;
        } else {
            return type.valueOf();
        }
    };
    var MetaFactory = function () {};
    ns.Interface(MetaFactory, null);
    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
        ns.assert(false, "implement me!");
        return null;
    };
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
        ns.assert(false, "implement me!");
        return null;
    };
    MetaFactory.prototype.parseMeta = function (meta) {
        ns.assert(false, "implement me!");
        return null;
    };
    Meta.Factory = MetaFactory;
    var s_factories = {};
    Meta.setFactory = function (type, factory) {
        s_factories[EnumToUint(type)] = factory;
    };
    Meta.getFactory = function (type) {
        return s_factories[EnumToUint(type)];
    };
    Meta.create = function (type, key, seed, fingerprint) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError("meta type not support: " + type);
        }
        return factory.createMeta(key, seed, fingerprint);
    };
    Meta.generate = function (type, sKey, seed) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError("meta type not support: " + type);
        }
        return factory.generateMeta(sKey, seed);
    };
    Meta.parse = function (meta) {
        if (!meta) {
            return null;
        } else {
            if (ns.Interface.conforms(meta, Meta)) {
                return meta;
            }
        }
        meta = ns.type.Wrapper.fetchMap(meta);
        var type = Meta.getType(meta);
        var factory = Meta.getFactory(type);
        if (!factory) {
            factory = Meta.getFactory(0);
        }
        return factory.parseMeta(meta);
    };
    ns.protocol.Meta = Meta;
    ns.protocol.registers("Meta");
})(MingKeMing);
(function (ns) {
    var TAI = function () {};
    ns.Interface(TAI, null);
    TAI.prototype.isValid = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    TAI.prototype.verify = function (publicKey) {
        ns.assert(false, "implement me!");
        return false;
    };
    TAI.prototype.sign = function (privateKey) {
        ns.assert(false, "implement me!");
        return null;
    };
    TAI.prototype.allProperties = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    TAI.prototype.getProperty = function (name) {
        ns.assert(false, "implement me!");
        return null;
    };
    TAI.prototype.setProperty = function (name, value) {
        ns.assert(false, "implement me!");
    };
    ns.protocol.TAI = TAI;
    ns.protocol.registers("TAI");
})(MingKeMing);
(function (ns) {
    var Mapper = ns.type.Mapper;
    var TAI = ns.protocol.TAI;
    var ID = ns.protocol.ID;
    var Document = function () {};
    ns.Interface(Document, [TAI, Mapper]);
    Document.VISA = "visa";
    Document.PROFILE = "profile";
    Document.BULLETIN = "bulletin";
    Document.prototype.getType = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Document.prototype.getIdentifier = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Document.prototype.getTime = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Document.prototype.getName = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Document.prototype.setName = function (name) {
        ns.assert(false, "implement me!");
    };
    Document.getType = function (doc) {
        return doc["type"];
    };
    Document.getIdentifier = function (doc) {
        return ID.parse(doc["ID"]);
    };
    var DocumentFactory = function () {};
    ns.Interface(DocumentFactory, null);
    DocumentFactory.prototype.createDocument = function (
        identifier,
        data,
        signature
    ) {
        ns.assert(false, "implement me!");
        return null;
    };
    DocumentFactory.prototype.parseDocument = function (doc) {
        ns.assert(false, "implement me!");
        return null;
    };
    Document.Factory = DocumentFactory;
    var s_factories = {};
    Document.setFactory = function (type, factory) {
        s_factories[type] = factory;
    };
    Document.getFactory = function (type) {
        return s_factories[type];
    };
    Document.create = function (type, identifier, data, signature) {
        var factory = Document.getFactory(type);
        if (!factory) {
            throw new ReferenceError("document type not support: " + type);
        }
        return factory.createDocument(identifier, data, signature);
    };
    Document.parse = function (doc) {
        if (!doc) {
            return null;
        } else {
            if (ns.Interface.conforms(doc, Document)) {
                return doc;
            }
        }
        doc = ns.type.Wrapper.fetchMap(doc);
        var type = Document.getType(doc);
        var factory = Document.getFactory(type);
        if (!factory) {
            factory = Document.getFactory("*");
        }
        return factory.parseDocument(doc);
    };
    ns.protocol.Document = Document;
    ns.protocol.registers("Document");
})(MingKeMing);
(function (ns) {
    var Document = ns.protocol.Document;
    var Visa = function () {};
    ns.Interface(Visa, [Document]);
    Visa.prototype.getKey = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Visa.prototype.setKey = function (publicKey) {
        ns.assert(false, "implement me!");
    };
    Visa.prototype.getAvatar = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Visa.prototype.setAvatar = function (url) {
        ns.assert(false, "implement me!");
    };
    ns.protocol.Visa = Visa;
    ns.protocol.registers("Visa");
})(MingKeMing);
(function (ns) {
    var Document = ns.protocol.Document;
    var Bulletin = function () {};
    ns.Interface(Bulletin, [Document]);
    Bulletin.prototype.getAssistants = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Bulletin.prototype.setAssistants = function (assistants) {
        ns.assert(false, "implement me!");
    };
    ns.protocol.Bulletin = Bulletin;
    ns.protocol.registers("Bulletin");
})(MingKeMing);
(function (ns) {
    var ConstantString = ns.type.ConstantString;
    var ID = ns.protocol.ID;
    var Identifier = function (identifier, name, address, terminal) {
        ConstantString.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal;
    };
    ns.Class(Identifier, ConstantString, [ID], null);
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
        return this.getAddress().getNetwork();
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
    ns.mkm.Identifier = Identifier;
    ns.mkm.registers("Identifier");
})(MingKeMing);
(function (ns) {
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Identifier = ns.mkm.Identifier;
    var concat = function (name, address, terminal) {
        var string = address.toString();
        if (name && name.length > 0) {
            string = name + "@" + string;
        }
        if (terminal && terminal.length > 0) {
            string = string + "/" + terminal;
        }
        return string;
    };
    var parse = function (string) {
        var name, address, terminal;
        var pair = string.split("/");
        if (pair.length === 1) {
            terminal = null;
        } else {
            terminal = pair[1];
        }
        pair = pair[0].split("@");
        if (pair.length === 1) {
            name = null;
            address = Address.parse(pair[0]);
        } else {
            name = pair[0];
            address = Address.parse(pair[1]);
        }
        if (!address) {
            return null;
        }
        return new Identifier(string, name, address, terminal);
    };
    var IDFactory = function () {
        Object.call(this);
        this.__identifiers = {};
    };
    ns.Class(IDFactory, Object, [ID.Factory], null);
    IDFactory.prototype.generateID = function (meta, network, terminal) {
        var address = Address.generate(meta, network);
        return ID.create(meta.getSeed(), address, terminal);
    };
    IDFactory.prototype.createID = function (name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.__identifiers[string];
        if (!id) {
            id = new Identifier(string, name, address, terminal);
            this.__identifiers[string] = id;
        }
        return id;
    };
    IDFactory.prototype.parseID = function (identifier) {
        var id = this.__identifiers[identifier];
        if (!id) {
            id = parse(identifier);
            if (id) {
                this.__identifiers[identifier] = id;
            }
        }
        return id;
    };
    ns.mkm.IDFactory = IDFactory;
    ns.mkm.registers("IDFactory");
})(MingKeMing);
(function (ns) {
    var Address = ns.protocol.Address;
    var AddressFactory = function () {
        Object.call(this);
        this.__addresses = {};
        this.__addresses[Address.ANYWHERE.toString()] = Address.ANYWHERE;
        this.__addresses[Address.EVERYWHERE.toString()] = Address.EVERYWHERE;
    };
    ns.Class(AddressFactory, Object, [Address.Factory], null);
    AddressFactory.prototype.generateAddress = function (meta, network) {
        var address = meta.generateAddress(network);
        if (address) {
            this.__addresses[address.toString()] = address;
        }
        return address;
    };
    AddressFactory.prototype.parseAddress = function (string) {
        var address = this.__addresses[string];
        if (!address) {
            address = Address.create(string);
            if (address) {
                this.__addresses[string] = address;
            }
        }
        return address;
    };
    ns.mkm.AddressFactory = AddressFactory;
    ns.mkm.registers("AddressFactory");
})(MingKeMing);
(function (ns) {
    var ConstantString = ns.type.ConstantString;
    var NetworkType = ns.protocol.NetworkType;
    var Address = ns.protocol.Address;
    var BroadcastAddress = function (string, network) {
        ConstantString.call(this, string);
        if (network instanceof NetworkType) {
            network = network.valueOf();
        }
        this.__network = network;
    };
    ns.Class(BroadcastAddress, ConstantString, [Address], null);
    BroadcastAddress.prototype.getNetwork = function () {
        return this.__network;
    };
    BroadcastAddress.prototype.isBroadcast = function () {
        return true;
    };
    BroadcastAddress.prototype.isUser = function () {
        return NetworkType.isUser(this.__network);
    };
    BroadcastAddress.prototype.isGroup = function () {
        return NetworkType.isGroup(this.__network);
    };
    Address.ANYWHERE = new BroadcastAddress("anywhere", NetworkType.MAIN);
    Address.EVERYWHERE = new BroadcastAddress("everywhere", NetworkType.GROUP);
    ns.mkm.BroadcastAddress = BroadcastAddress;
    ns.mkm.registers("BroadcastAddress");
})(MingKeMing);
(function (ns) {
    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var IDFactory = ns.mkm.IDFactory;
    var factory = new IDFactory();
    ID.setFactory(factory);
    ID.ANYONE = factory.createID("anyone", Address.ANYWHERE, null);
    ID.EVERYONE = factory.createID("everyone", Address.EVERYWHERE, null);
    ID.FOUNDER = factory.createID("moky", Address.ANYWHERE, null);
})(MingKeMing);
(function (ns) {
    var Base64 = ns.format.Base64;
    var Dictionary = ns.type.Dictionary;
    var Meta = ns.protocol.Meta;
    var EnumToUint = function (type) {
        if (typeof type === "number") {
            return type;
        } else {
            return type.valueOf();
        }
    };
    var BaseMeta = function () {
        var type, key, seed, fingerprint;
        var meta;
        if (arguments.length === 1) {
            meta = arguments[0];
            type = Meta.getType(meta);
            key = Meta.getKey(meta);
            seed = Meta.getSeed(meta);
            fingerprint = Meta.getFingerprint(meta);
        } else {
            if (arguments.length === 2) {
                type = EnumToUint(arguments[0]);
                key = arguments[1];
                seed = null;
                fingerprint = null;
                meta = { type: type, key: key.toMap() };
            } else {
                if (arguments.length === 4) {
                    type = EnumToUint(arguments[0]);
                    key = arguments[1];
                    seed = arguments[2];
                    fingerprint = arguments[3];
                    meta = {
                        type: type,
                        key: key.toMap(),
                        seed: seed,
                        fingerprint: Base64.encode(fingerprint)
                    };
                } else {
                    throw new SyntaxError("meta arguments error: " + arguments);
                }
            }
        }
        Dictionary.call(this, meta);
        this.__type = type;
        this.__key = key;
        this.__seed = seed;
        this.__fingerprint = fingerprint;
    };
    ns.Class(BaseMeta, Dictionary, [Meta], null);
    BaseMeta.prototype.getType = function () {
        return this.__type;
    };
    BaseMeta.prototype.getKey = function () {
        return this.__key;
    };
    BaseMeta.prototype.getSeed = function () {
        return this.__seed;
    };
    BaseMeta.prototype.getFingerprint = function () {
        return this.__fingerprint;
    };
    ns.mkm.BaseMeta = BaseMeta;
    ns.mkm.registers("BaseMeta");
})(MingKeMing);
(function (ns) {
    var UTF8 = ns.format.UTF8;
    var Base64 = ns.format.Base64;
    var JsON = ns.format.JSON;
    var Dictionary = ns.type.Dictionary;
    var Document = ns.protocol.Document;
    var BaseDocument = function () {
        var map, status;
        var identifier, data;
        var properties;
        if (arguments.length === 1) {
            map = arguments[0];
            status = 0;
            identifier = null;
            data = null;
            properties = null;
        } else {
            if (arguments.length === 2) {
                identifier = arguments[0];
                var type = arguments[1];
                map = { ID: identifier.toString() };
                status = 0;
                data = null;
                if (type && type.length > 1) {
                    properties = { type: type };
                } else {
                    properties = null;
                }
            } else {
                if (arguments.length === 3) {
                    identifier = arguments[0];
                    data = arguments[1];
                    var signature = arguments[2];
                    map = { ID: identifier.toString(), data: data, signature: signature };
                    status = 1;
                    properties = null;
                } else {
                    throw new SyntaxError("document arguments error: " + arguments);
                }
            }
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__json = data;
        this.__sig = null;
        this.__properties = properties;
        this.__status = status;
    };
    ns.Class(BaseDocument, Dictionary, [Document], {
        isValid: function () {
            return this.__status > 0;
        },
        getType: function () {
            var type = this.getProperty("type");
            if (!type) {
                var dict = this.toMap();
                type = Document.getType(dict);
            }
            return type;
        },
        getIdentifier: function () {
            if (this.__identifier === null) {
                var dict = this.toMap();
                this.__identifier = Document.getIdentifier(dict);
            }
            return this.__identifier;
        },
        getData: function () {
            if (this.__json === null) {
                this.__json = this.getValue("data");
            }
            return this.__json;
        },
        getSignature: function () {
            if (this.__sig === null) {
                var base64 = this.getValue("signature");
                if (base64) {
                    this.__sig = Base64.decode(base64);
                }
            }
            return this.__sig;
        },
        allProperties: function () {
            if (this.__status < 0) {
                return null;
            }
            if (this.__properties === null) {
                var data = this.getData();
                if (data) {
                    var json = UTF8.decode(data);
                    this.__properties = JsON.decode(json);
                } else {
                    this.__properties = {};
                }
            }
            return this.__properties;
        },
        getProperty: function (name) {
            var dict = this.allProperties();
            if (!dict) {
                return null;
            }
            return dict[name];
        },
        setProperty: function (name, value) {
            this.__status = 0;
            var dict = this.allProperties();
            dict[name] = value;
            this.removeValue("data");
            this.removeValue("signature");
            this.__json = null;
            this.__sig = null;
        },
        verify: function (publicKey) {
            if (this.__status > 0) {
                return true;
            }
            var data = this.getData();
            var signature = this.getSignature();
            if (!data) {
                if (!signature) {
                    this.__status = 0;
                } else {
                    this.__status = -1;
                }
            } else {
                if (!signature) {
                    this.__status = -1;
                } else {
                    if (publicKey.verify(UTF8.encode(data), signature)) {
                        this.__status = 1;
                    }
                }
            }
            return this.__status > 0;
        },
        sign: function (privateKey) {
            if (this.__status > 0) {
                return this.getSignature();
            }
            var now = new Date();
            this.setProperty("time", now.getTime() / 1000);
            this.__status = 1;
            var dict = this.allProperties();
            var json = JsON.encode(dict);
            var data = UTF8.encode(json);
            var sig = privateKey.sign(data);
            var b64 = Base64.encode(sig);
            this.__json = json;
            this.__sig = sig;
            this.setValue("data", json);
            this.setValue("signature", b64);
            return this.__sig;
        },
        getTime: function () {
            var timestamp = this.getProperty("time");
            if (timestamp) {
                return new Date(timestamp * 1000);
            } else {
                return null;
            }
        },
        getName: function () {
            return this.getProperty("name");
        },
        setName: function (name) {
            this.setProperty("name", name);
        }
    });
    ns.mkm.BaseDocument = BaseDocument;
    ns.mkm.registers("BaseDocument");
})(MingKeMing);
(function (ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseVisa = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.VISA);
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0]);
                }
            }
        }
        this.__key = null;
    };
    ns.Class(BaseVisa, BaseDocument, [Visa], {
        getKey: function () {
            if (this.__key === null) {
                var key = this.getProperty("key");
                if (key) {
                    key = PublicKey.parse(key);
                    if (ns.Interface.conforms(key, EncryptKey)) {
                        this.__key = key;
                    }
                }
            }
            return this.__key;
        },
        setKey: function (publicKey) {
            this.setProperty("key", publicKey.toMap());
            this.__key = publicKey;
        },
        getAvatar: function () {
            return this.getProperty("avatar");
        },
        setAvatar: function (url) {
            this.setProperty("avatar", url);
        }
    });
    ns.mkm.BaseVisa = BaseVisa;
    ns.mkm.registers("BaseVisa");
})(MingKeMing);
(function (ns) {
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseBulletin = function () {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2]);
        } else {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.BULLETIN);
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0]);
                }
            }
        }
        this.__assistants = null;
    };
    ns.Class(BaseBulletin, BaseDocument, [Bulletin], {
        getAssistants: function () {
            if (!this.__assistants) {
                var assistants = this.getProperty("assistants");
                if (assistants) {
                    this.__assistants = ID.convert(assistants);
                }
            }
            return this.__assistants;
        },
        setAssistants: function (assistants) {
            if (assistants && assistants.length > 0) {
                this.setProperty("assistants", ID.revert(assistants));
            } else {
                this.setProperty("assistants", null);
            }
        }
    });
    ns.mkm.BaseBulletin = BaseBulletin;
    ns.mkm.registers("BaseBulletin");
})(MingKeMing);
