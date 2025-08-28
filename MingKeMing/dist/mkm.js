/**
 * MingKeMing - User Module (v2.0.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Aug. 20, 2025
 * @copyright (c) 2020-2025 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MingKeMing !== 'object') {
    MingKeMing = {}
}
(function (mkm, mk) {
    if (typeof mkm.protocol !== 'object') {
        mkm.protocol = {}
    }
    if (typeof mkm.mkm !== 'object') {
        mkm.mkm = {}
    }
    if (typeof mkm.ext !== 'object') {
        mkm.ext = {}
    }
    var Interface = mk.type.Interface;
    var Class = mk.type.Class;
    var IObject = mk.type.Object;
    var Stringer = mk.type.Stringer;
    var Mapper = mk.type.Mapper;
    var Enum = mk.type.Enum;
    var ConstantString = mk.type.ConstantString;
    mkm.protocol.EntityType = {
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
    };
    var EntityType = mkm.protocol.EntityType;
    EntityType.isUser = function (network) {
        var user = 0x00;
        var group = 0x01;
        return (network & group) === user
    };
    EntityType.isGroup = function (network) {
        var group = 0x01;
        return (network & group) === group
    };
    EntityType.isBroadcast = function (network) {
        var any = 0x80;
        return (network & any) === any
    };
    mkm.protocol.Address = Interface(null, [Stringer]);
    var Address = mkm.protocol.Address;
    Address.prototype.getType = function () {
    };
    Address.ANYWHERE = null;
    Address.EVERYWHERE = null;
    Address.generate = function (meta, network) {
        var helper = AccountExtensions.getAddressHelper();
        return helper.generateAddress(meta, network)
    };
    Address.parse = function (address) {
        var helper = AccountExtensions.getAddressHelper();
        return helper.parseAddress(address)
    };
    Address.setFactory = function (factory) {
        var helper = AccountExtensions.getAddressHelper();
        helper.setAddressFactory(factory)
    };
    Address.getFactory = function () {
        var helper = AccountExtensions.getAddressHelper();
        return helper.getAddressFactory()
    };
    Address.Factory = Interface(null, null);
    var AddressFactory = Address.Factory;
    AddressFactory.prototype.generateAddress = function (meta, network) {
    };
    AddressFactory.prototype.parseAddress = function (address) {
    };
    mkm.protocol.ID = Interface(null, [Stringer]);
    var ID = mkm.protocol.ID;
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
    ID.convert = function (array) {
        var members = [];
        var did;
        for (var i = 0; i < array.length; ++i) {
            did = ID.parse(array[i]);
            if (did) {
                members.push(did)
            }
        }
        return members
    };
    ID.revert = function (identifiers) {
        var array = [];
        var did;
        for (var i = 0; i < identifiers.length; ++i) {
            did = identifiers[i];
            if (Interface.conforms(did, Stringer)) {
                array.push(did.toString())
            } else if (IObject.isString(did)) {
                array.push(did)
            }
        }
        return array
    };
    ID.generate = function (meta, network, terminal) {
        var helper = AccountExtensions.getIdentifierHelper();
        return helper.generateIdentifier(meta, network, terminal)
    };
    ID.create = function (name, address, terminal) {
        var helper = AccountExtensions.getIdentifierHelper();
        return helper.createIdentifier(name, address, terminal)
    };
    ID.parse = function (identifier) {
        var helper = AccountExtensions.getIdentifierHelper();
        return helper.parseIdentifier(identifier)
    };
    ID.setFactory = function (factory) {
        var helper = AccountExtensions.getIdentifierHelper();
        helper.setIdentifierFactory(factory)
    };
    ID.getFactory = function () {
        var helper = AccountExtensions.getIdentifierHelper();
        return helper.getIdentifierFactory()
    };
    ID.Factory = Interface(null, null);
    var IDFactory = ID.Factory;
    IDFactory.prototype.generateIdentifier = function (meta, network, terminal) {
    };
    IDFactory.prototype.createIdentifier = function (name, address, terminal) {
    };
    IDFactory.prototype.parseIdentifier = function (identifier) {
    };
    mkm.protocol.Meta = Interface(null, [Mapper]);
    var Meta = mkm.protocol.Meta;
    Meta.prototype.getType = function () {
    };
    Meta.prototype.getPublicKey = function () {
    };
    Meta.prototype.getSeed = function () {
    };
    Meta.prototype.getFingerprint = function () {
    };
    Meta.prototype.isValid = function () {
    };
    Meta.prototype.generateAddress = function (network) {
    };
    Meta.create = function (type, key, seed, fingerprint) {
        var helper = AccountExtensions.getMetaHelper();
        return helper.createMeta(type, key, seed, fingerprint)
    };
    Meta.generate = function (type, sKey, seed) {
        var helper = AccountExtensions.getMetaHelper();
        return helper.generateMeta(type, sKey, seed)
    };
    Meta.parse = function (meta) {
        var helper = AccountExtensions.getMetaHelper();
        return helper.parseMeta(meta)
    };
    Meta.setFactory = function (type, factory) {
        var helper = AccountExtensions.getMetaHelper();
        helper.setMetaFactory(type, factory)
    };
    Meta.getFactory = function (type) {
        var helper = AccountExtensions.getMetaHelper();
        return helper.getMetaFactory(type)
    };
    Meta.Factory = Interface(null, null);
    var MetaFactory = Meta.Factory;
    MetaFactory.prototype.createMeta = function (pKey, seed, fingerprint) {
    };
    MetaFactory.prototype.generateMeta = function (sKey, seed) {
    };
    MetaFactory.prototype.parseMeta = function (meta) {
    };
    mkm.protocol.TAI = Interface(null, null);
    var TAI = mkm.protocol.TAI;
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
    mkm.protocol.Document = Interface(null, [TAI, Mapper]);
    var Document = mkm.protocol.Document;
    Document.prototype.getIdentifier = function () {
    };
    Document.prototype.getTime = function () {
    };
    Document.prototype.setName = function (name) {
    };
    Document.prototype.getName = function () {
    };
    Document.convert = function (array) {
        var documents = [];
        var doc;
        for (var i = 0; i < array.length; ++i) {
            doc = Document.parse(array[i]);
            if (doc) {
                documents.push(doc)
            }
        }
        return documents
    };
    Document.revert = function (documents) {
        var array = [];
        var doc;
        for (var i = 0; i < documents.length; ++i) {
            doc = documents[i];
            if (Interface.conforms(doc, Mapper)) {
                array.push(doc.toMap())
            } else {
                array.push(doc)
            }
        }
        return array
    };
    Document.create = function (type, identifier, data, signature) {
        var helper = AccountExtensions.getDocumentHelper();
        return helper.createDocument(type, identifier, data, signature)
    };
    Document.parse = function (doc) {
        var helper = AccountExtensions.getDocumentHelper();
        return helper.parseDocument(doc)
    };
    Document.setFactory = function (type, factory) {
        var helper = AccountExtensions.getDocumentHelper();
        helper.setDocumentFactory(type, factory)
    };
    Document.getFactory = function (type) {
        var helper = AccountExtensions.getDocumentHelper();
        return helper.getDocumentFactory(type)
    };
    Document.Factory = Interface(null, null);
    var DocumentFactory = Document.Factory;
    DocumentFactory.prototype.createDocument = function (identifier, data, signature) {
    };
    DocumentFactory.prototype.parseDocument = function (doc) {
    };
    mkm.mkm.BroadcastAddress = function (string, network) {
        ConstantString.call(this, string);
        this.__network = Enum.getInt(network)
    };
    var BroadcastAddress = mkm.mkm.BroadcastAddress;
    Class(BroadcastAddress, ConstantString, [Address], {
        getType: function () {
            return this.__network
        }
    });
    Address.ANYWHERE = new BroadcastAddress('anywhere', EntityType.ANY);
    Address.EVERYWHERE = new BroadcastAddress('everywhere', EntityType.EVERY);
    mkm.mkm.Identifier = function (identifier, name, address, terminal) {
        ConstantString.call(this, identifier);
        this.__name = name;
        this.__address = address;
        this.__terminal = terminal
    };
    var Identifier = mkm.mkm.Identifier;
    Class(Identifier, ConstantString, [ID], {
        getName: function () {
            return this.__name
        }, getAddress: function () {
            return this.__address
        }, getTerminal: function () {
            return this.__terminal
        }, getType: function () {
            var address = this.__address;
            return address.getType()
        }, isBroadcast: function () {
            var network = this.getType();
            return EntityType.isBroadcast(network)
        }, isUser: function () {
            var network = this.getType();
            return EntityType.isUser(network)
        }, isGroup: function () {
            var network = this.getType();
            return EntityType.isGroup(network)
        }
    });
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
    mkm.ext.AddressHelper = Interface(null, null);
    var AddressHelper = mkm.ext.AddressHelper;
    AddressHelper.prototype = {
        setAddressFactory: function (factory) {
        }, getAddressFactory: function () {
        }, parseAddress: function (address) {
        }, generateAddress: function (meta, network) {
        }
    };
    mkm.ext.IdentifierHelper = Interface(null, null);
    var IdentifierHelper = mkm.ext.IdentifierHelper;
    IdentifierHelper.prototype = {
        setIdentifierFactory: function (factory) {
        }, getIdentifierFactory: function () {
        }, parseIdentifier: function (identifier) {
        }, createIdentifier: function (name, address, terminal) {
        }, generateIdentifier: function (meta, network, terminal) {
        }
    };
    mkm.ext.MetaHelper = Interface(null, null);
    var MetaHelper = mkm.ext.MetaHelper;
    MetaHelper.prototype = {
        setMetaFactory: function (type, factory) {
        }, getMetaFactory: function (type) {
        }, createMeta: function (type, key, seed, fingerprint) {
        }, generateMeta: function (type, sKey, seed) {
        }, parseMeta: function (meta) {
        }
    };
    mkm.ext.DocumentHelper = Interface(null, null);
    var DocumentHelper = mkm.ext.DocumentHelper;
    DocumentHelper.prototype = {
        setDocumentFactory: function (type, factory) {
        }, getDocumentFactory: function (type) {
        }, createDocument: function (type, identifier, data, signature) {
        }, parseDocument: function (doc) {
        }
    };
    mkm.ext.AccountExtensions = {
        setAddressHelper: function (helper) {
            addressHelper = helper
        }, getAddressHelper: function () {
            return addressHelper
        }, setIdentifierHelper: function (helper) {
            idHelper = helper
        }, getIdentifierHelper: function () {
            return idHelper
        }, setMetaHelper: function (helper) {
            metaHelper = helper
        }, getMetaHelper: function () {
            return metaHelper
        }, setDocumentHelper: function (helper) {
            docHelper = helper
        }, getDocumentHelper: function () {
            return docHelper
        }
    };
    var AccountExtensions = mkm.ext.AccountExtensions;
    var addressHelper = null;
    var idHelper = null;
    var metaHelper = null;
    var docHelper = null;
    mkm.ext.GeneralAccountHelper = Interface(null, null);
    var GeneralAccountHelper = mkm.ext.GeneralAccountHelper;
    GeneralAccountHelper.prototype = {
        getMetaType: function (meta, defaultValue) {
        }, getDocumentType: function (doc, defaultValue) {
        }
    };
    mkm.ext.SharedAccountExtensions = {
        setAddressHelper: function (helper) {
            AccountExtensions.setAddressHelper(helper)
        }, getAddressHelper: function () {
            return AccountExtensions.getAddressHelper()
        }, setIdentifierHelper: function (helper) {
            AccountExtensions.setIdentifierHelper(helper)
        }, getIdentifierHelper: function () {
            return AccountExtensions.getIdentifierHelper()
        }, setMetaHelper: function (helper) {
            AccountExtensions.setMetaHelper(helper)
        }, getMetaHelper: function () {
            return AccountExtensions.getMetaHelper()
        }, setDocumentHelper: function (helper) {
            AccountExtensions.setDocumentHelper(helper)
        }, getDocumentHelper: function () {
            return AccountExtensions.getDocumentHelper()
        }, setHelper: function (helper) {
            generalAccountHelper = helper
        }, getHelper: function () {
            return generalAccountHelper
        }
    };
    var SharedAccountExtensions = mkm.ext.SharedAccountExtensions;
    var generalAccountHelper = null
})(MingKeMing, MONKEY);
