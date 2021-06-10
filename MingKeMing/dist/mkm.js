/**
 * MingKeMing - User Module (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      June. 2, 2021
 * @copyright (c) 2021 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MingKeMing !== "object") {
    MingKeMing = new MONKEY.Namespace()
}
(function(ns, base) {
    base.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = new ns.Namespace()
    }
    if (typeof ns.mkm !== "object") {
        ns.mkm = new ns.Namespace()
    }
    ns.registers("protocol");
    ns.registers("mkm")
})(MingKeMing, MONKEY);
(function(ns) {
    var NetworkType = ns.type.Enum(null, {
        BTC_MAIN: (0),
        MAIN: (8),
        GROUP: (16),
        POLYLOGUE: (16),
        CHATROOM: (48),
        PROVIDER: (118),
        STATION: (136),
        THING: (128),
        ROBOT: (200)
    });
    NetworkType.isUser = function(network) {
        var main = NetworkType.MAIN.valueOf();
        var btcMain = NetworkType.BTC_MAIN.valueOf();
        return ((network & main) === main) || (network === btcMain)
    };
    NetworkType.isGroup = function(network) {
        var group = NetworkType.GROUP.valueOf();
        return (network & group) === group
    };
    ns.protocol.NetworkType = NetworkType;
    ns.protocol.registers("NetworkType")
})(MingKeMing);
(function(ns) {
    var MetaType = ns.type.Enum(null, {
        DEFAULT: (1),
        MKM: (1),
        BTC: (2),
        ExBTC: (3),
        ETH: (4),
        ExETH: (5)
    });
    MetaType.hasSeed = function(version) {
        var mkm = MetaType.MKM.valueOf();
        return (version & mkm) === mkm
    };
    ns.protocol.MetaType = MetaType;
    ns.protocol.registers("MetaType")
})(MingKeMing);
(function(ns) {
    var Address = function() {};
    ns.Interface(Address, null);
    Address.prototype.getNetwork = function() {
        console.assert(false, "implement me!");
        return 0
    };
    Address.prototype.isBroadcast = function() {
        console.assert(false, "implement me!");
        return false
    };
    Address.prototype.isUser = function() {
        console.assert(false, "implement me!");
        return false
    };
    Address.prototype.isGroup = function() {
        console.assert(false, "implement me!");
        return false
    };
    Address.ANYWHERE = null;
    Address.EVERYWHERE = null;
    ns.protocol.Address = Address;
    ns.protocol.registers("Address")
})(MingKeMing);
(function(ns) {
    var str = ns.type.String;
    var Address = ns.protocol.Address;
    var AddressFactory = function() {};
    ns.Interface(AddressFactory, null);
    AddressFactory.prototype.parseAddress = function(address) {
        console.assert(false, "implement me!");
        return null
    };
    Address.Factory = AddressFactory;
    var s_factory = null;
    Address.getFactory = function() {
        return s_factory
    };
    Address.setFactory = function(factory) {
        s_factory = factory
    };
    Address.parse = function(address) {
        if (!address) {
            return null
        } else {
            if (ns.Interface.conforms(address, Address)) {
                return address
            } else {
                if (address instanceof str) {
                    address = address.toString()
                }
            }
        }
        return Address.getFactory().parseAddress(address)
    }
})(MingKeMing);
(function(ns) {
    var Address = ns.protocol.Address;
    var ID = function() {};
    ns.Interface(ID, null);
    ID.prototype.getName = function() {
        console.assert(false, "implement me!");
        return null
    };
    ID.prototype.getAddress = function() {
        console.assert(false, "implement me!");
        return null
    };
    ID.prototype.getTerminal = function() {
        console.assert(false, "implement me!");
        return null
    };
    ID.prototype.getType = function() {
        console.assert(false, "implement me!");
        return 0
    };
    ID.prototype.isBroadcast = function() {
        console.assert(false, "implement me!");
        return false
    };
    ID.prototype.isUser = function() {
        console.assert(false, "implement me!");
        return false
    };
    ID.prototype.isGroup = function() {
        console.assert(false, "implement me!");
        return false
    };
    ID.ANYONE = null;
    ID.EVERYONE = null;
    ID.FOUNDER = null;
    ID.convert = function(members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = ID.parse(members[i]);
            if (id) {
                array.push(id)
            }
        }
        return array
    };
    ID.revert = function(members) {
        var array = [];
        var id;
        for (var i = 0; i < members.length; ++i) {
            id = members[i];
            if (typeof id === "string") {
                array.push(id)
            } else {
                array.push(id.toString())
            }
        }
        return array
    };
    ns.protocol.ID = ID;
    ns.protocol.registers("ID")
})(MingKeMing);
(function(ns) {
    var str = ns.type.String;
    var ID = ns.protocol.ID;
    var IDFactory = function() {};
    ns.Interface(IDFactory, null);
    IDFactory.prototype.createID = function(name, address, terminal) {
        console.assert(false, "implement me!");
        return null
    };
    IDFactory.prototype.parseID = function(identifier) {
        console.assert(false, "implement me!");
        return null
    };
    ID.Factory = IDFactory;
    var s_factory;
    ID.getFactory = function() {
        return s_factory
    };
    ID.setFactory = function(factory) {
        s_factory = factory
    };
    ID.create = function(name, address, terminal) {
        return ID.getFactory().createID(name, address, terminal)
    };
    ID.parse = function(identifier) {
        if (!identifier) {
            return null
        } else {
            if (ns.Interface.conforms(identifier, ID)) {
                return identifier
            } else {
                if (identifier instanceof str) {
                    identifier = identifier.toString()
                }
            }
        }
        return ID.getFactory().parseID(identifier)
    }
})(MingKeMing);
(function(ns) {
    var map = ns.type.Map;
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;
    var Meta = function() {};
    ns.Interface(Meta, [map]);
    Meta.prototype.getType = function() {
        console.assert(false, "implement me!");
        return 0
    };
    Meta.getType = function(meta) {
        var version = meta["type"];
        if (!version) {
            version = meta["version"]
        }
        return version
    };
    Meta.prototype.getKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    Meta.getKey = function(meta) {
        var key = meta["key"];
        if (!key) {
            throw new TypeError("meta key not found: " + meta)
        }
        return PublicKey.parse(key)
    };
    Meta.prototype.getSeed = function() {
        console.assert(false, "implement me!");
        return null
    };
    Meta.getSeed = function(meta) {
        return meta["seed"]
    };
    Meta.prototype.getFingerprint = function() {
        console.assert(false, "implement me!");
        return null
    };
    Meta.getFingerprint = function(meta) {
        var base64 = meta["fingerprint"];
        if (!base64) {
            return null
        }
        return ns.format.Base64.decode(base64)
    };
    Meta.prototype.isValid = function() {
        console.assert(false, "implement me!");
        return false
    };
    Meta.prototype.generateID = function(type, terminal) {
        console.assert(false, "implement me!");
        return null
    };
    Meta.prototype.matches = function(id_or_key) {
        console.assert(false, "implement me!");
        return false
    };
    ns.protocol.Meta = Meta;
    ns.protocol.registers("Meta")
})(MingKeMing);
(function(ns) {
    var map = ns.type.Map;
    var MetaType = ns.protocol.MetaType;
    var Meta = ns.protocol.Meta;
    var MetaFactory = function() {};
    ns.Interface(MetaFactory, null);
    MetaFactory.prototype.createMeta = function(key, seed, fingerprint) {
        console.assert(false, "implement me!");
        return null
    };
    MetaFactory.prototype.generateMeta = function(sKey, seed) {
        console.assert(false, "implement me!");
        return null
    };
    MetaFactory.prototype.parseMeta = function(meta) {
        console.assert(false, "implement me!");
        return null
    };
    Meta.Factory = MetaFactory;
    var s_factories = {};
    Meta.register = function(type, factory) {
        if (type instanceof MetaType) {
            type = type.valueOf()
        }
        s_factories[type] = factory
    };
    Meta.getFactory = function(type) {
        if (type instanceof MetaType) {
            type = type.valueOf()
        }
        return s_factories[type]
    };
    Meta.create = function(type, key, seed, fingerprint) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError("meta type not support: " + type)
        }
        return factory.createMeta(key, seed, fingerprint)
    };
    Meta.generate = function(type, sKey, seed) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw new ReferenceError("meta type not support: " + type)
        }
        return factory.generateMeta(sKey, seed)
    };
    Meta.parse = function(meta) {
        if (!meta) {
            return null
        } else {
            if (ns.Interface.conforms(meta, Meta)) {
                return meta
            } else {
                if (ns.Interface.conforms(meta, map)) {
                    meta = meta.getMap()
                }
            }
        }
        var type = Meta.getType(meta);
        var factory = Meta.getFactory(type);
        if (!factory) {
            factory = Meta.getFactory(0)
        }
        return factory.parseMeta(meta)
    }
})(MingKeMing);
(function(ns) {
    var TAI = function() {};
    ns.Interface(TAI, null);
    TAI.prototype.isValid = function() {
        console.assert(false, "implement me!");
        return false
    };
    TAI.prototype.verify = function(publicKey) {
        console.assert(false, "implement me!");
        return false
    };
    TAI.prototype.sign = function(privateKey) {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.allPropertyNames = function() {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.getProperty = function(name) {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.setProperty = function(name, value) {
        console.assert(false, "implement me!")
    };
    ns.protocol.TAI = TAI;
    ns.protocol.registers("TAI")
})(MingKeMing);
(function(ns) {
    var map = ns.type.Map;
    var TAI = ns.protocol.TAI;
    var ID = ns.protocol.ID;
    var Document = function() {};
    ns.Interface(Document, [TAI, map]);
    Document.VISA = "visa";
    Document.PROFILE = "profile";
    Document.BULLETIN = "bulletin";
    Document.prototype.getType = function() {
        console.assert(false, "implement me!");
        return null
    };
    Document.getType = function(doc) {
        return doc["type"]
    };
    Document.prototype.getIdentifier = function() {
        console.assert(false, "implement me!");
        return null
    };
    Document.getIdentifier = function(doc) {
        return ID.parse(doc["ID"])
    };
    Document.getData = function(doc) {
        var utf8 = doc["data"];
        if (utf8) {
            return ns.format.UTF8.encode(utf8)
        } else {
            return null
        }
    };
    Document.getSignature = function(doc) {
        var base64 = doc["signature"];
        if (base64) {
            return ns.format.Base64.decode(base64)
        } else {
            return null
        }
    };
    Document.prototype.getTime = function() {
        console.assert(false, "implement me!");
        return null
    };
    Document.prototype.getName = function() {
        console.assert(false, "implement me!");
        return null
    };
    Document.prototype.setName = function(name) {
        console.assert(false, "implement me!")
    };
    ns.protocol.Document = Document;
    ns.protocol.registers("Document")
})(MingKeMing);
(function(ns) {
    var map = ns.type.Map;
    var Document = ns.protocol.Document;
    var DocumentFactory = function() {};
    ns.Interface(DocumentFactory, null);
    DocumentFactory.prototype.createDocument = function(identifier, data, signature) {
        console.assert(false, "implement me!");
        return null
    };
    DocumentFactory.prototype.parseDocument = function(doc) {
        console.assert(false, "implement me!");
        return null
    };
    Document.Factory = DocumentFactory;
    var s_factories = {};
    Document.register = function(type, factory) {
        s_factories[type] = factory
    };
    Document.getFactory = function(type) {
        return s_factories[type]
    };
    Document.create = function(type, identifier, data, signature) {
        var factory = Document.getFactory(type);
        if (!factory) {
            throw new ReferenceError("document type not support: " + type)
        }
        return factory.createDocument(identifier, data, signature)
    };
    Document.parse = function(doc) {
        if (!doc) {
            return null
        } else {
            if (ns.Interface.conforms(doc, Document)) {
                return doc
            } else {
                if (ns.Interface.conforms(doc, map)) {
                    doc = doc.getMap()
                }
            }
        }
        var type = Document.getType(doc);
        var factory = Document.getFactory(type);
        if (!factory) {
            factory = Document.getFactory("*")
        }
        return factory.parseDocument(doc)
    }
})(MingKeMing);
(function(ns) {
    var Document = ns.protocol.Document;
    var Visa = function() {};
    ns.Interface(Visa, [Document]);
    Visa.prototype.getKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    Visa.prototype.setKey = function(publicKey) {
        console.assert(false, "implement me!")
    };
    Visa.prototype.getAvatar = function() {
        console.assert(false, "implement me!");
        return null
    };
    Visa.prototype.setAvatar = function(url) {
        console.assert(false, "implement me!")
    };
    ns.protocol.Visa = Visa;
    ns.protocol.registers("Visa")
})(MingKeMing);
(function(ns) {
    var Document = ns.protocol.Document;
    var Bulletin = function() {};
    ns.Interface(Bulletin, [Document]);
    Bulletin.prototype.getAssistants = function() {
        console.assert(false, "implement me!");
        return null
    };
    Bulletin.prototype.setAssistants = function(assistants) {
        console.assert(false, "implement me!")
    };
    ns.protocol.Bulletin = Bulletin;
    ns.protocol.registers("Bulletin")
})(MingKeMing);
(function(ns) {
    var str = ns.type.String;
    var ID = ns.protocol.ID;
    var Identifier = function(identifier, name, address, terminal) {
        str.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal
    };
    ns.Class(Identifier, str, [ID]);
    Identifier.prototype.getName = function() {
        return this.__name
    };
    Identifier.prototype.getAddress = function() {
        return this.__address
    };
    Identifier.prototype.getTerminal = function() {
        return this.__terminal
    };
    Identifier.prototype.getType = function() {
        return this.getAddress().getNetwork()
    };
    Identifier.prototype.isBroadcast = function() {
        return this.getAddress().isBroadcast()
    };
    Identifier.prototype.isUser = function() {
        return this.getAddress().isUser()
    };
    Identifier.prototype.isGroup = function() {
        return this.getAddress().isGroup()
    };
    ns.mkm.Identifier = Identifier;
    ns.mkm.registers("Identifier")
})(MingKeMing);
(function(ns) {
    var obj = ns.type.Object;
    var Address = ns.protocol.Address;
    var ID = ns.protocol.ID;
    var Identifier = ns.mkm.Identifier;
    var concat = function(name, address, terminal) {
        var string = address.toString();
        if (name && name.length > 0) {
            string = name + "@" + string
        }
        if (terminal && terminal.length > 0) {
            string = string + "/" + terminal
        }
        return string
    };
    var parse = function(string) {
        var name, address, terminal;
        var pair = string.split("/");
        if (pair.length === 1) {
            terminal = null
        } else {
            terminal = pair[1]
        }
        pair = pair[0].split("@");
        if (pair.length === 1) {
            name = null;
            address = Address.parse(pair[0])
        } else {
            name = pair[0];
            address = Address.parse(pair[1])
        }
        return new Identifier(string, name, address, terminal)
    };
    var IDFactory = function() {
        obj.call(this);
        this.__identifiers = {}
    };
    ns.Class(IDFactory, obj, [ID.Factory]);
    IDFactory.prototype.createID = function(name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.__identifiers[string];
        if (!id) {
            id = new Identifier(string, name, address, terminal);
            this.__identifiers[string] = id
        }
        return id
    };
    IDFactory.prototype.parseID = function(identifier) {
        var id = this.__identifiers[identifier];
        if (!id) {
            id = parse(identifier);
            if (id) {
                this.__identifiers[identifier] = id
            }
        }
        return id
    };
    ns.mkm.IDFactory = IDFactory;
    ns.mkm.registers("IDFactory")
})(MingKeMing);
(function(ns) {
    var str = ns.type.String;
    var NetworkType = ns.protocol.NetworkType;
    var Address = ns.protocol.Address;
    var BroadcastAddress = function(string, network) {
        str.call(this, string);
        if (network instanceof NetworkType) {
            network = network.valueOf()
        }
        this.__network = network
    };
    ns.Class(BroadcastAddress, str, [Address]);
    BroadcastAddress.prototype.getNetwork = function() {
        return this.__network
    };
    BroadcastAddress.prototype.isBroadcast = function() {
        return true
    };
    BroadcastAddress.prototype.isUser = function() {
        return NetworkType.isUser(this.__network)
    };
    BroadcastAddress.prototype.isGroup = function() {
        return NetworkType.isGroup(this.__network)
    };
    Address.ANYWHERE = new BroadcastAddress("anywhere", NetworkType.MAIN);
    Address.EVERYWHERE = new BroadcastAddress("everywhere", NetworkType.GROUP);
    ns.mkm.BroadcastAddress = BroadcastAddress;
    ns.mkm.registers("BroadcastAddress")
})(MingKeMing);
(function(ns) {
    var obj = ns.type.Object;
    var Address = ns.protocol.Address;
    var AddressFactory = function() {
        obj.call(this);
        this.__addresses = {};
        this.__addresses[Address.ANYWHERE.toString()] = Address.ANYWHERE;
        this.__addresses[Address.EVERYWHERE.toString()] = Address.EVERYWHERE
    };
    ns.Class(AddressFactory, obj, [Address.Factory]);
    AddressFactory.prototype.parseAddress = function(string) {
        var address = this.__addresses[string];
        if (!address) {
            address = this.createAddress(string);
            if (address) {
                this.__addresses[string] = address
            }
        }
        return address
    };
    AddressFactory.prototype.createAddress = function(address) {
        console.assert(false, "implement me!");
        return null
    };
    ns.mkm.AddressFactory = AddressFactory;
    ns.mkm.registers("AddressFactory")
})(MingKeMing);
(function(ns) {
    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var IDFactory = ns.mkm.IDFactory;
    var factory = new IDFactory();
    ID.setFactory(factory);
    ID.ANYONE = factory.createID("anyone", Address.ANYWHERE, null);
    ID.EVERYONE = factory.createID("everyone", Address.EVERYWHERE, null);
    ID.FOUNDER = factory.createID("moky", Address.ANYWHERE, null)
})(MingKeMing);
(function(ns) {
    var Dictionary = ns.type.Dictionary;
    var PublicKey = ns.crypto.PublicKey;
    var MetaType = ns.protocol.MetaType;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var BaseMeta = function() {
        var type, key, seed, fingerprint;
        var meta, status;
        if (arguments.length === 1) {
            meta = arguments[0];
            type = Meta.getType(meta);
            key = Meta.getKey(meta);
            seed = Meta.getSeed(meta);
            fingerprint = Meta.getFingerprint(meta);
            status = 0
        } else {
            if (arguments.length === 2) {
                type = arguments[0];
                key = arguments[1];
                seed = null;
                fingerprint = null;
                if (type instanceof MetaType) {
                    type = type.valueOf()
                }
                meta = {
                    "type": type,
                    "key": key.getMap()
                };
                status = 1
            } else {
                if (arguments.length === 4) {
                    type = arguments[0];
                    key = arguments[1];
                    seed = arguments[2];
                    fingerprint = arguments[3];
                    if (type instanceof MetaType) {
                        type = type.valueOf()
                    }
                    meta = {
                        "type": type,
                        "key": key.getMap(),
                        "seed": seed,
                        "fingerprint": ns.format.Base64.encode(fingerprint)
                    };
                    status = 1
                } else {
                    throw new SyntaxError("meta arguments error: " + arguments)
                }
            }
        }
        Dictionary.call(this, meta);
        this.__type = type;
        this.__key = key;
        this.__seed = seed;
        this.__fingerprint = fingerprint;
        this.__status = status
    };
    ns.Class(BaseMeta, Dictionary, [Meta]);
    BaseMeta.prototype.getType = function() {
        return this.__type
    };
    BaseMeta.prototype.getKey = function() {
        return this.__key
    };
    BaseMeta.prototype.getSeed = function() {
        return this.__seed
    };
    BaseMeta.prototype.getFingerprint = function() {
        return this.__fingerprint
    };
    BaseMeta.prototype.isValid = function() {
        if (this.__status === 0) {
            if (!this.__key) {
                this.__status = -1
            } else {
                if (MetaType.hasSeed(this.__type)) {
                    if (!this.__seed || !this.__fingerprint) {
                        this.__status = -1
                    } else {
                        if (this.__key.verify(ns.format.UTF8.encode(this.__seed), this.__fingerprint)) {
                            this.__status = 1
                        } else {
                            this.__status = -1
                        }
                    }
                } else {
                    this.__status = 1
                }
            }
        }
        return this.__status === 1
    };
    BaseMeta.prototype.generateAddress = function(network) {
        console.assert(false, "implement me!");
        return null
    };
    BaseMeta.prototype.generateID = function(type, terminal) {
        var address = this.generateAddress(type);
        if (!address) {
            return null
        }
        return ID.create(this.getSeed(), address, terminal)
    };
    BaseMeta.prototype.matches = function(id_or_key) {
        if (!this.isValid()) {
            return false
        }
        if (ns.Interface.conforms(id_or_key, ID)) {
            return match_identifier.call(this, id_or_key)
        } else {
            if (ns.Interface.conforms(id_or_key, PublicKey)) {
                return match_public_key.call(this, id_or_key)
            }
        }
        return false
    };
    var match_identifier = function(identifier) {
        if (MetaType.hasSeed(this.__type)) {
            if (identifier.getName() !== this.__seed) {
                return false
            }
        }
        var address = this.generateAddress(identifier.getType());
        return identifier.getAddress().equals(address)
    };
    var match_public_key = function(publicKey) {
        if (this.__key.equals(publicKey)) {
            return true
        }
        if (MetaType.hasSeed(this.__type)) {
            var data = ns.format.UTF8.encode(this.__seed);
            var signature = this.__fingerprint;
            return publicKey.verify(data, signature)
        } else {
            return false
        }
    };
    ns.mkm.BaseMeta = BaseMeta;
    ns.mkm.registers("BaseMeta")
})(MingKeMing);
(function(ns) {
    var Dictionary = ns.type.Dictionary;
    var Document = ns.protocol.Document;
    var BaseDocument = function() {
        var identifier, data, signature;
        var map, status;
        var properties;
        if (arguments.length === 1) {
            map = arguments[0];
            identifier = Document.getIdentifier(map);
            data = Document.getData(map);
            signature = Document.getSignature(map);
            properties = null;
            status = 0
        } else {
            if (arguments.length === 2) {
                identifier = arguments[0];
                var type = arguments[1];
                data = null;
                signature = null;
                map = {
                    "ID": identifier.toString()
                };
                if (type && type.length > 1) {
                    properties = {
                        "type": type
                    }
                } else {
                    properties = null
                }
                status = 0
            } else {
                if (arguments.length === 3) {
                    identifier = arguments[0];
                    data = arguments[1];
                    signature = arguments[2];
                    map = {
                        "ID": identifier.toString(),
                        "data": ns.format.UTF8.decode(data),
                        "signature": ns.format.Base64.encode(signature)
                    };
                    properties = null;
                    status = 1
                } else {
                    throw new SyntaxError("document arguments error: " + arguments)
                }
            }
        }
        Dictionary.call(this, map);
        this.__identifier = identifier;
        this.__data = data;
        this.__signature = signature;
        this.__properties = properties;
        this.__status = status
    };
    ns.Class(BaseDocument, Dictionary, [Document]);
    BaseDocument.prototype.isValid = function() {
        return this.__status > 0
    };
    BaseDocument.prototype.getType = function() {
        var type = this.getProperty("type");
        if (!type) {
            type = Document.getType(this.getMap())
        }
        return type
    };
    BaseDocument.prototype.getIdentifier = function() {
        return this.__identifier
    };
    BaseDocument.prototype.allPropertyNames = function() {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return Object.keys(dict)
    };
    BaseDocument.prototype.getProperties = function() {
        if (this.__status < 0) {
            return null
        }
        if (!this.__properties) {
            var data = this.__data;
            if (data) {
                this.__properties = ns.format.JSON.decode(data)
            } else {
                this.__properties = {}
            }
        }
        return this.__properties
    };
    BaseDocument.prototype.getProperty = function(name) {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return dict[name]
    };
    BaseDocument.prototype.setProperty = function(name, value) {
        this.__status = 0;
        var dict = this.getProperties();
        dict[name] = value;
        this.setValue("data", null);
        this.setValue("signature", null);
        this.__data = null;
        this.__signature = null
    };
    BaseDocument.prototype.verify = function(publicKey) {
        if (this.__status > 0) {
            return true
        }
        var data = this.__data;
        var signature = this.__signature;
        if (!data) {
            if (!signature) {
                this.__status = 0
            } else {
                this.__status = -1
            }
        } else {
            if (!signature) {
                this.__status = -1
            } else {
                if (publicKey.verify(data, signature)) {
                    this.__status = 1
                }
            }
        }
        return this.__status > 0
    };
    BaseDocument.prototype.sign = function(privateKey) {
        if (this.__status > 0) {
            return this.__signature
        }
        var now = new Date();
        this.setProperty("time", now.getTime() / 1000);
        this.__status = 1;
        this.__data = ns.format.JSON.encode(this.getProperties());
        this.__signature = privateKey.sign(this.__data);
        this.setValue("data", ns.format.UTF8.decode(this.__data));
        this.setValue("signature", ns.format.Base64.encode(this.__signature));
        return this.__signature
    };
    BaseDocument.prototype.getTime = function() {
        var timestamp = this.getProperty("time");
        if (timestamp) {
            return new Date(timestamp * 1000)
        } else {
            return null
        }
    };
    BaseDocument.prototype.getName = function() {
        return this.getProperty("name")
    };
    BaseDocument.prototype.setName = function(name) {
        this.setProperty("name", name)
    };
    ns.mkm.BaseDocument = BaseDocument;
    ns.mkm.registers("BaseDocument")
})(MingKeMing);
(function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseVisa = function() {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.VISA)
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0])
                }
            }
        }
        this.__key = null
    };
    ns.Class(BaseVisa, BaseDocument, [Visa]);
    BaseVisa.prototype.getKey = function() {
        if (!this.__key) {
            var key = this.getProperty("key");
            if (key) {
                key = PublicKey.parse(key);
                if (ns.Interface.conforms(key, EncryptKey)) {
                    this.__key = key
                }
            }
        }
        return this.__key
    };
    BaseVisa.prototype.setKey = function(publicKey) {
        this.setProperty("key", publicKey.getMap());
        this.__key = publicKey
    };
    BaseVisa.prototype.getAvatar = function() {
        return this.getProperty("avatar")
    };
    BaseVisa.prototype.setAvatar = function(url) {
        this.setProperty("avatar", url)
    };
    ns.mkm.BaseVisa = BaseVisa;
    ns.mkm.registers("BaseVisa")
})(MingKeMing);
(function(ns) {
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.mkm.BaseDocument;
    var BaseBulletin = function() {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else {
            if (ns.Interface.conforms(arguments[0], ID)) {
                BaseDocument.call(this, arguments[0], Document.BULLETIN)
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0])
                }
            }
        }
        this.__assistants = null
    };
    ns.Class(BaseBulletin, BaseDocument, [Bulletin]);
    BaseBulletin.prototype.getAssistants = function() {
        if (!this.__assistants) {
            var assistants = this.getProperty("assistants");
            if (assistants) {
                this.__assistants = ID.convert(assistants)
            }
        }
        return this.__assistants
    };
    BaseBulletin.prototype.setAssistants = function(assistants) {
        if (assistants && assistants.length > 0) {
            this.setProperty("assistants", ID.revert(assistants))
        } else {
            this.setProperty("assistants", null)
        }
    };
    ns.mkm.BaseBulletin = BaseBulletin;
    ns.mkm.registers("BaseBulletin")
})(MingKeMing);
