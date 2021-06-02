/**
 * MingKeMing - User Module (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      June. 2, 2021
 * @copyright (c) 2021 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MingKeMing !== "object") {
    MingKeMing = {}
}
(function(ns, base) {
    base.exports(ns);
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    base.Namespace(ns.protocol);
    ns.register("protocol")
})(MingKeMing, DIMP);
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
    ns.protocol.register("NetworkType")
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
    ns.protocol.register("MetaType")
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
    Address.parse = function(address) {
        if (!address) {
            return null
        } else {
            if (address instanceof Address) {
                return address
            } else {
                if (address instanceof ns.type.String) {
                    address = address.toString()
                }
            }
        }
        return Address.getFactory().parseAddress(address)
    };
    Address.getFactory = function() {
        return s_factory
    };
    Address.setFactory = function(factory) {
        s_factory = factory
    };
    var s_factory = null;
    var AddressFactory = function() {};
    ns.Interface(AddressFactory, null);
    AddressFactory.prototype.parseAddress = function(address) {
        console.assert(false, "implement me!");
        return null
    };
    ns.protocol.Address = Address;
    ns.protocol.AddressFactory = AddressFactory;
    ns.protocol.register("Address");
    ns.protocol.register("AddressFactory")
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
        for (var item in members) {
            id = ID.parse(item);
            if (!id) {
                continue
            }
            array.push(id)
        }
        return array
    };
    ID.revert = function(members) {
        var array = [];
        for (var id in members) {
            array.push(id.toString())
        }
        return array
    };
    ID.create = function(name, address, terminal) {
        return ID.getFactory().create(name, address, terminal)
    };
    ID.parse = function(identifier) {
        if (!identifier) {
            return null
        } else {
            if (identifier instanceof ID) {
                return identifier
            } else {
                if (identifier instanceof ns.type.String) {
                    identifier = identifier.toString()
                }
            }
        }
        return ID.getFactory().parseID(identifier)
    };
    ID.getFactory = function() {
        return s_factory
    };
    ID.setFactory = function(factory) {
        s_factory = factory
    };
    var s_factory;
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
    ns.protocol.ID = ID;
    ns.protocol.IDFactory = IDFactory;
    ns.protocol.register("ID");
    ns.protocol.register("IDFactory")
})(MingKeMing);
(function(ns) {
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;
    var Meta = function() {};
    ns.Interface(Meta, null);
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
            throw TypeError("meta key not found: " + meta)
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
    Meta.create = function(type, key, seed, fingerprint) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw ReferenceError("meta type not support: " + type)
        }
        return factory.createMeta(key, seed, fingerprint)
    };
    Meta.generate = function(type, sKey, seed) {
        var factory = Meta.getFactory(type);
        if (!factory) {
            throw ReferenceError("meta type not support: " + type)
        }
        return factory.generateMeta(sKey, seed)
    };
    Meta.parse = function(meta) {
        if (!meta) {
            return null
        } else {
            if (meta instanceof Meta) {
                return meta
            } else {
                if (meta instanceof ns.type.Dictionary) {
                    meta = meta.getMap()
                }
            }
        }
        var version = Meta.getType(meta);
        var factory = Meta.getFactory(version);
        if (!factory) {
            factory = Meta.getFactory(0)
        }
        return factory.parseMeta(meta)
    };
    Meta.getFactory = function(type) {
        if (type instanceof MetaType) {
            type = type.valueOf()
        }
        return s_factories[type]
    };
    Meta.register = function(type, factory) {
        if (type instanceof MetaType) {
            type = type.valueOf()
        }
        s_factories[type] = factory
    };
    var s_factories = {};
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
    ns.protocol.Meta = Meta;
    ns.protocol.MetaFactory = MetaFactory;
    ns.protocol.register("Meta");
    ns.protocol.register("MetaFactory")
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
    ns.protocol.register("TAI")
})(MingKeMing);
(function(ns) {
    var TAI = ns.protocol.TAI;
    var ID = ns.protocol.ID;
    var Document = function() {};
    ns.Interface(Document, [TAI]);
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
    Document.create = function(type, identifier, data, signature) {
        var factory = Document.getFactory(type);
        if (!factory) {
            throw ReferenceError("document type not support: " + type)
        }
        return factory.createDocument(identifier, data, signature)
    };
    Document.parse = function(doc) {
        if (!doc) {
            return null
        } else {
            if (doc instanceof Document) {
                return doc
            } else {
                if (doc instanceof ns.type.Dictionary) {
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
    };
    Document.register = function(type, factory) {
        s_factories[type] = factory
    };
    Document.getFactory = function(type) {
        return s_factories[type]
    };
    var s_factories = {};
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
    ns.protocol.Document = Document;
    ns.protocol.DocumentFactory = DocumentFactory;
    ns.protocol.register("Document");
    ns.protocol.register("DocumentFactory")
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
    ns.protocol.register("Visa")
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
    ns.protocol.register("Bulletin")
})(MingKeMing);
(function(ns) {
    var str = ns.type.String;
    var ID = ns.protocol.ID;
    var Identifier = function(identifier, name, address, terminal) {
        str.call(this, identifier);
        this.name = name;
        this.address = address;
        this.terminal = terminal
    };
    ns.Class(Identifier, str, [ID]);
    Identifier.prototype.getName = function() {
        return this.name
    };
    Identifier.prototype.getAddress = function() {
        return this.address
    };
    Identifier.prototype.getTerminal = function() {
        return this.terminal
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
    ns.Identifier = Identifier;
    ns.register("Identifier")
})(MingKeMing);
(function(ns) {
    var Address = ns.protocol.Address;
    var IDFactory = ns.protocol.IDFactory;
    var Identifier = ns.Identifier;
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
    var GeneralFactory = function() {
        this.identifiers = {}
    };
    ns.Class(GeneralFactory, null, [IDFactory]);
    GeneralFactory.prototype.createID = function(name, address, terminal) {
        var string = concat(name, address, terminal);
        var id = this.identifiers[string];
        if (!id) {
            id = new Identifier(string, name, address, terminal);
            this.identifiers[string] = id
        }
        return id
    };
    GeneralFactory.prototype.parseID = function(identifier) {
        var id = this.identifiers[identifier];
        if (!id) {
            id = parse(identifier);
            if (id) {
                this.identifiers[identifier] = id
            }
        }
        return id
    };
    ns.IDFactory = GeneralFactory;
    ns.register("IDFactory")
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
        this.network = network
    };
    ns.Class(BroadcastAddress, str, [Address]);
    BroadcastAddress.prototype.getNetwork = function() {
        return this.network
    };
    BroadcastAddress.prototype.isBroadcast = function() {
        return true
    };
    BroadcastAddress.prototype.isUser = function() {
        return NetworkType.isUser(this.network)
    };
    BroadcastAddress.prototype.isGroup = function() {
        return NetworkType.isGroup(this.network)
    };
    Address.ANYWHERE = new BroadcastAddress("anywhere", NetworkType.MAIN);
    Address.EVERYWHERE = new BroadcastAddress("everywhere", NetworkType.GROUP);
    ns.BroadcastAddress = BroadcastAddress;
    ns.register("BroadcastAddress")
})(MingKeMing);
(function(ns) {
    var Address = ns.protocol.Address;
    var AddressFactory = ns.protocol.AddressFactory;
    var BaseFactory = function() {
        this.addresses = {};
        this.addresses[Address.ANYWHERE.toString()] = Address.ANYWHERE;
        this.addresses[Address.EVERYWHERE.toString()] = Address.EVERYWHERE
    };
    ns.Interface(BaseFactory, [AddressFactory]);
    BaseFactory.prototype.parseAddress = function(string) {
        var address = this.addresses[string];
        if (!address) {
            address = this.createAddress(string);
            if (address) {
                this.addresses[string] = address
            }
        }
        return address
    };
    BaseFactory.prototype.createAddress = function(address) {
        console.assert(false, "implement me!");
        return null
    };
    ns.AddressFactory = BaseFactory;
    ns.register("AddressFactory")
})(MingKeMing);
(function(ns) {
    var ID = ns.protocol.ID;
    var Address = ns.protocol.Address;
    var IDFactory = ns.IDFactory;
    var factory = new IDFactory();
    ID.setFactory(factory);
    ID.ANYONE = factory.createID("anyone", Address.ANYWHERE, null);
    ID.EVERYONE = factory.createID("everyone", Address.EVERYWHERE, null)
})(MingKeMing);
(function(ns) {
    var Dictionary = ns.type.Dictionary;
    var PublicKey = ns.crypto.PublicKey;
    var MetaType = ns.protocol.MetaType;
    var NetworkType = ns.protocol.NetworkType;
    var ID = ns.protocol.ID;
    var Meta = ns.protocol.Meta;
    var Address = ns.protocol.Address;
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
                    throw SyntaxError("meta arguments error: " + arguments)
                }
            }
        }
        Dictionary.call(this, meta);
        this.type = type;
        this.key = key;
        this.seed = seed;
        this.fingerprint = fingerprint;
        this.status = status
    };
    ns.Class(BaseMeta, Dictionary, [Meta]);
    BaseMeta.prototype.getType = function() {
        return this.type
    };
    BaseMeta.prototype.getKey = function() {
        return this.key
    };
    BaseMeta.prototype.getSeed = function() {
        return this.seed
    };
    BaseMeta.prototype.getFingerprint = function() {
        return this.fingerprint
    };
    BaseMeta.prototype.isValid = function() {
        if (this.status === 0) {
            if (!this.key) {
                this.status = -1
            } else {
                if (MetaType.hasSeed(this.type)) {
                    if (!this.seed || !this.fingerprint) {
                        this.status = -1
                    } else {
                        if (this.key.verify(ns.format.UTF8.encode(this.seed), this.fingerprint)) {
                            this.status = 1
                        } else {
                            this.status = -1
                        }
                    }
                } else {
                    this.status = 1
                }
            }
        }
        return this.status === 1
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
        if (id_or_key instanceof ID) {
            return match_identifier.call(this, id_or_key)
        } else {
            if (id_or_key instanceof PublicKey) {
                return match_public_key.call(this, id_or_key)
            }
        }
        return false
    };
    var match_identifier = function(identifier) {
        if (MetaType.hasSeed(this.type)) {
            if (identifier.getName() !== this.seed) {
                return false
            }
        }
        var address = this.generateAddress(identifier.getType());
        return identifier.getAddress().equals(address)
    };
    var match_public_key = function(publicKey) {
        if (this.key.equals(publicKey)) {
            return true
        }
        if (MetaType.hasSeed(this.type)) {
            var data = ns.format.UTF8.encode(this.seed);
            var signature = this.fingerprint;
            return publicKey.verify(data, signature)
        } else {
            return false
        }
    };
    ns.BaseMeta = BaseMeta;
    ns.register("BaseMeta")
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
                    throw SyntaxError("document arguments error: " + arguments)
                }
            }
        }
        Dictionary.call(this, map);
        this.identifier = identifier;
        this.data = data;
        this.signature = signature;
        this._properties = properties;
        this.status = status
    };
    ns.Class(BaseDocument, Dictionary, [Document]);
    BaseDocument.prototype.isValid = function() {
        return this.status > 0
    };
    BaseDocument.prototype.getType = function() {
        var type = this.getProperty("type");
        if (!type) {
            type = Document.getType(this.getMap())
        }
        return type
    };
    BaseDocument.prototype.getIdentifier = function() {
        return this.identifier
    };
    BaseDocument.prototype.allPropertyNames = function() {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return Object.keys(dict)
    };
    BaseDocument.prototype.getProperties = function() {
        if (this.status < 0) {
            return null
        }
        if (!this.properties) {
            var data = this.data;
            if (data) {
                this.properties = ns.format.JSON.decode(data)
            } else {
                this.properties = {}
            }
        }
        return this.properties
    };
    BaseDocument.prototype.getProperty = function(name) {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return dict[name]
    };
    BaseDocument.prototype.setProperty = function(name, value) {
        this.status = 0;
        var dict = this.getProperties();
        dict[name] = value;
        this.setValue("data", null);
        this.setValue("signature", null);
        this.data = null;
        this.signature = null
    };
    BaseDocument.prototype.verify = function(publicKey) {
        if (this.status > 0) {
            return true
        }
        var data = this.data;
        var signature = this.signature;
        if (!data) {
            if (!signature) {
                this.status = 0
            } else {
                this.status = -1
            }
        } else {
            if (!signature) {
                this.status = -1
            } else {
                if (publicKey.verify(data, signature)) {
                    this.status = 1
                }
            }
        }
        return this.status > 0
    };
    BaseDocument.prototype.sign = function(privateKey) {
        if (this.status > 0) {
            return this.signature
        }
        var now = new Date();
        this.setProperty("time", now.getTime() / 1000);
        this.status = 1;
        this.data = ns.format.JSON.encode(this.getProperties());
        this.signature = privateKey.sign(this.data);
        this.setValue("data", ns.format.UTF8.decode(this.data));
        this.setValue("signature", ns.format.Base64.encode(this.signature));
        return this.signature
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
    ns.BaseDocument = BaseDocument;
    ns.register("BaseDocument")
})(MingKeMing);
(function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var PublicKey = ns.crypto.PublicKey;
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Visa = ns.protocol.Visa;
    var BaseDocument = ns.BaseDocument;
    var BaseVisa = function() {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else {
            if (arguments[0] instanceof ID) {
                BaseDocument.call(this, arguments[0], Document.VISA)
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0])
                }
            }
        }
        this.key = null
    };
    ns.Class(BaseVisa, BaseDocument, [Visa]);
    BaseVisa.prototype.getKey = function() {
        if (!this.key) {
            var key = this.getProperty("key");
            if (key) {
                key = PublicKey.parse(key);
                if (key instanceof EncryptKey) {
                    this.key = key
                }
            }
        }
        return this.key
    };
    BaseVisa.prototype.setKey = function(publicKey) {
        this.setProperty("key", publicKey.getMap());
        this.key = publicKey
    };
    BaseVisa.prototype.getAvatar = function() {
        return this.getProperty("avatar")
    };
    BaseVisa.prototype.setAvatar = function(url) {
        this.setProperty("avatar", url)
    };
    ns.BaseVisa = BaseVisa;
    ns.register("BaseVisa")
})(MingKeMing);
(function(ns) {
    var ID = ns.protocol.ID;
    var Document = ns.protocol.Document;
    var Bulletin = ns.protocol.Bulletin;
    var BaseDocument = ns.BaseDocument;
    var BaseBulletin = function() {
        if (arguments.length === 3) {
            BaseDocument.call(this, arguments[0], arguments[1], arguments[2])
        } else {
            if (arguments[0] instanceof ID) {
                BaseDocument.call(this, arguments[0], Document.BULLETIN)
            } else {
                if (arguments.length === 1) {
                    BaseDocument.call(this, arguments[0])
                }
            }
        }
        this.assistants = null
    };
    ns.Class(BaseBulletin, BaseDocument, [Bulletin]);
    BaseBulletin.prototype.getAssistants = function() {
        if (!this.assistants) {
            var assistants = this.getProperty("assistants");
            if (assistants) {
                this.assistants = ID.convert(assistants)
            }
        }
        return this.assistants
    };
    BaseBulletin.prototype.setAssistants = function(assistants) {
        if (assistants && assistants.length > 0) {
            this.setProperty("assistants", ID.revert(assistants))
        } else {
            this.setProperty("assistants", null)
        }
    };
    ns.BaseBulletin = BaseBulletin;
    ns.register("BaseBulletin")
})(MingKeMing);
