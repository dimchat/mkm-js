/**
 * MingKeMing - User Module (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Jan. 28, 2020
 * @copyright (c) 2020 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */
! function(ns) {
    var NetworkType = ns.type.Enum({
        BTCMain: (0),
        Main: (8),
        Group: (16),
        Polylogue: (16),
        Chatroom: (48),
        Provider: (118),
        Station: (136),
        Thing: (128),
        Robot: (200)
    });
    NetworkType.prototype.toByte = function() {
        return String.fromCharCode(this.value)
    };
    NetworkType.prototype.isPerson = function() {
        return (this.value === NetworkType.Main.value) || (this.value === NetworkType.BTCMain.value)
    };
    NetworkType.prototype.isUser = function() {
        return ((this.value & NetworkType.Main.value) === NetworkType.Main.value) || (this.value === NetworkType.BTCMain.value)
    };
    NetworkType.prototype.isGroup = function() {
        return (this.value & NetworkType.Group.value) === NetworkType.Group.value
    };
    NetworkType.prototype.isStation = function() {
        return this.value === NetworkType.Station.value
    };
    NetworkType.prototype.isProvider = function() {
        return this.value === NetworkType.Provider.value
    };
    NetworkType.prototype.isThing = function() {
        return (this.value & NetworkType.Thing.value) === NetworkType.Thing.value
    };
    NetworkType.prototype.isRobot = function() {
        return this.value === NetworkType.Robot.value
    };
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    ns.protocol.NetworkType = NetworkType
}(DIMP);
! function(ns) {
    var MetaType = ns.type.Enum({
        Default: (1),
        MKM: (1),
        BTC: (2),
        ExBTC: (3),
        ETH: (4),
        ExETH: (5)
    });
    MetaType.prototype.hasSeed = function() {
        return (this.value & MetaType.MKM.value) === MetaType.MKM.value
    };
    if (typeof ns.protocol !== "object") {
        ns.protocol = {}
    }
    ns.protocol.MetaType = MetaType
}(DIMP);
! function(ns) {
    var NetworkType = ns.protocol.NetworkType;
    var Address = function(string) {
        ns.type.String.call(this, string)
    };
    Address.inherits(ns.type.String);
    Address.prototype.getNetwork = function() {
        console.assert(false, "implement me!");
        return null
    };
    Address.prototype.getCode = function() {
        console.assert(false, "implement me!");
        return 0
    };
    Address.prototype.isBroadcast = function() {
        var network = this.getNetwork();
        if (Address.EVERYWHERE.getNetwork().equals(network)) {
            return this.equals(Address.EVERYWHERE)
        }
        if (Address.ANYWHERE.getNetwork().equals(network)) {
            return this.equals(Address.ANYWHERE)
        }
        return false
    };
    var address_classes = [];
    Address.register = function(clazz) {
        address_classes.push(clazz)
    };
    Address.getInstance = function(string) {
        if (!string) {
            return null
        } else {
            if (string instanceof Address) {
                return string
            }
        }
        if (Address.ANYWHERE.equalsIgnoreCase(string)) {
            return Address.ANYWHERE
        }
        if (Address.EVERYWHERE.equalsIgnoreCase(string)) {
            return Address.EVERYWHERE
        }
        var clazz;
        for (var i = address_classes.length - 1; i >= 0; --i) {
            clazz = address_classes[i];
            try {
                var addr = new clazz(string);
                if (addr) {
                    return addr
                }
            } catch (e) {}
        }
        throw TypeError("unrecognized address: " + string)
    };
    var ConstantAddress = function(string, network, number) {
        Address.call(this, string);
        this.network = network;
        this.number = number
    };
    ConstantAddress.inherits(Address);
    ConstantAddress.prototype.getNetwork = function() {
        return this.network
    };
    ConstantAddress.prototype.getCode = function() {
        return this.number
    };
    Address.ANYWHERE = new ConstantAddress("anywhere", ns.protocol.NetworkType.Main, 9527);
    Address.EVERYWHERE = new ConstantAddress("everywhere", ns.protocol.NetworkType.Group, 9527);
    ns.Address = Address
}(DIMP);
! function(ns) {
    var Address = ns.Address;
    var ID = function(name, address, terminal) {
        var string;
        if (name instanceof ID) {
            string = name.toString();
            address = name.address;
            terminal = name.terminal;
            name = name.name
        } else {
            if (!address) {
                string = name;
                var pair = string.split("/");
                if (pair.length === 1) {
                    terminal = null
                } else {
                    terminal = pair[1]
                }
                pair = pair[0].split("@");
                if (pair.length === 1) {
                    name = null;
                    address = Address.getInstance(pair[0])
                } else {
                    name = pair[0];
                    address = Address.getInstance(pair[1])
                }
            } else {
                address = Address.getInstance(address);
                string = address.toString();
                if (name && name.length > 0) {
                    string = name + "@" + string
                }
                if (terminal && terminal.length > 0) {
                    string = string + "/" + terminal
                }
            }
        }
        ns.type.String.call(this, string);
        this.name = name;
        this.address = address;
        this.terminal = terminal
    };
    ID.inherits(ns.type.String);
    ID.prototype.equals = function(other) {
        if (!other) {
            return false
        } else {
            if (ns.type.String.prototype.equals.call(this, other)) {
                return true
            } else {
                if (other instanceof ID) {
                    if (!this.address.equals(other.address)) {
                        return false
                    }
                    if (!this.name) {
                        return !other.name
                    } else {
                        return this.name === other.name
                    }
                }
            }
        }
        var pair = other.split("/");
        if (!this.terminal) {
            return pair[0] === this.value
        } else {
            return pair[0] === this.value.split("/")[0]
        }
    };
    ID.prototype.getType = function() {
        return this.address.getNetwork()
    };
    ID.prototype.getNumber = function() {
        return this.address.getCode()
    };
    ID.prototype.isValid = function() {
        return this.getNumber() > 0
    };
    ID.prototype.isBroadcast = function() {
        return this.address.isBroadcast()
    };
    ID.ANYONE = new ID("anyone", Address.ANYWHERE);
    ID.EVERYONE = new ID("everyone", Address.EVERYWHERE);
    ID.getInstance = function(string) {
        if (!string) {
            return null
        } else {
            if (string instanceof ID) {
                return string
            }
        }
        return new ID(string)
    };
    ns.ID = ID
}(DIMP);
! function(ns) {
    var Dictionary = ns.type.Dictionary;
    var PublicKey = ns.crypto.PublicKey;
    var Base64 = ns.format.Base64;
    var MetaType = ns.protocol.MetaType;
    var NetworkType = ns.protocol.NetworkType;
    var Address = ns.Address;
    var ID = ns.ID;
    var Meta = function(map) {
        Dictionary.call(this, map);
        this.version = new MetaType(map["version"]);
        this.key = PublicKey.getInstance(map["key"]);
        if (this.version.hasSeed()) {
            this.seed = map["seed"];
            this.fingerprint = Base64.decode(map["fingerprint"])
        } else {
            this.seed = null;
            this.fingerprint = null
        }
        this.status = 0
    };
    Meta.inherits(Dictionary);
    Meta.prototype.equals = function(other) {
        if (!other) {
            return false
        } else {
            if (Dictionary.prototype.equals.call(this, other)) {
                return true
            }
        }
        other = Meta.getInstance(other);
        var identifier = other.generateIdentifier(NetworkType.Main);
        return this.matches(identifier)
    };
    Meta.prototype.isValid = function() {
        if (this.status === 0) {
            if (!this.key) {
                this.status = -1
            } else {
                if (this.version.hasSeed()) {
                    if (!this.seed || !this.fingerprint) {
                        this.status = -1
                    } else {
                        var data = (new ns.type.String(this.seed)).getBytes();
                        var signature = this.fingerprint;
                        if (this.key.verify(data, signature)) {
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
    var match_public_key = function(publicKey) {
        if (this.key.equals(publicKey)) {
            return true
        }
        if (this.version.hasSeed()) {
            var data = (new ns.type.String(this.seed)).getBytes();
            var signature = this.fingerprint;
            return publicKey.verify(data, signature)
        } else {
            return false
        }
    };
    var match_identifier = function(identifier) {
        return this.generateIdentifier(identifier.getType()).equals(identifier)
    };
    var match_address = function(address) {
        return this.generateAddress(address.getNetwork()).equals(address)
    };
    Meta.prototype.matches = function(key_id_addr) {
        if (!this.isValid()) {
            return false
        }
        if (key_id_addr instanceof ID) {
            return match_identifier.call(this, key_id_addr)
        } else {
            if (key_id_addr instanceof Address) {
                return match_address.call(this, key_id_addr)
            } else {
                if (key_id_addr.isinstanceof(PublicKey)) {
                    return match_public_key.call(this, key_id_addr)
                }
            }
        }
        return false
    };
    Meta.prototype.generateIdentifier = function(network) {
        if (!(network instanceof NetworkType)) {
            network = new NetworkType(network)
        }
        var address = this.generateAddress(network);
        return new ID(this.seed, address)
    };
    Meta.prototype.generateAddress = function(network) {
        console.assert(network instanceof NetworkType, "network error: " + network);
        console.assert(false, "implement me!");
        return null
    };
    Meta.generate = function(version, privateKey, seed) {
        var meta = {
            "version": version,
            "key": privateKey.getPublicKey()
        };
        if (!(version instanceof MetaType)) {
            version = new MetaType(version)
        }
        if (version.hasSeed()) {
            var data = (new ns.type.String(seed)).getBytes();
            var fingerprint = privateKey.sign(data);
            meta["seed"] = seed;
            meta["fingerprint"] = Base64.encode(fingerprint)
        }
        return Meta.getInstance(meta)
    };
    var meta_classes = {};
    Meta.register = function(version, clazz) {
        meta_classes[version] = clazz
    };
    Meta.getInstance = function(meta) {
        if (!meta) {
            return null
        } else {
            if (meta instanceof Meta) {
                return meta
            }
        }
        var version = meta["version"];
        var clazz = meta_classes[version];
        if (typeof clazz !== "function") {
            throw TypeError("meta not supported: " + meta)
        }
        if (typeof clazz.getInstance === "function") {
            return clazz.getInstance(meta)
        }
        return new clazz(meta)
    };
    ns.Meta = Meta
}(DIMP);
! function(ns) {
    var TAI = function() {};
    TAI.prototype.isValid = function() {
        console.assert(false, "implement me!");
        return false
    };
    TAI.prototype.getIdentifier = function() {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.getKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.allPropertyNames = function() {
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.getProperty = function(name) {
        console.assert(name !== null, "property name empty");
        console.assert(false, "implement me!");
        return null
    };
    TAI.prototype.setProperty = function(name, value) {
        console.assert(name !== null, "property name empty");
        console.assert(value !== null, "property value empty");
        console.assert(false, "implement me!")
    };
    TAI.prototype.verify = function(publicKey) {
        console.assert(publicKey !== null, "public key empty");
        console.assert(false, "implement me!");
        return false
    };
    TAI.prototype.sign = function(privateKey) {
        console.assert(privateKey !== null, "private key empty");
        console.assert(false, "implement me!");
        return null
    };
    var Dictionary = ns.type.Dictionary;
    var Base64 = ns.format.Base64;
    var JSON = ns.format.JSON;
    var PublicKey = ns.crypto.PublicKey;
    var Profile = function(dict) {
        Dictionary.call(this, dict);
        this.identifier = null;
        this.key = null;
        this.data = null;
        this.signature = null;
        this.properties = null;
        this.status = 0
    };
    Profile.inherits(Dictionary, TAI);
    Profile.prototype.isValid = function() {
        return this.status >= 0
    };
    Profile.prototype.getIdentifier = function() {
        if (!this.identifier) {
            this.identifier = this.getValue("ID")
        }
        return this.identifier
    };
    Profile.prototype.getData = function() {
        if (!this.data) {
            var string = this.getValue("data");
            if (string) {
                var str = new ns.type.String(string);
                this.data = str.getBytes()
            }
        }
        return this.data
    };
    Profile.prototype.getSignature = function() {
        if (!this.signature) {
            var base64 = this.getValue("signature");
            if (base64) {
                this.signature = Base64.decode(base64)
            }
        }
        return this.signature
    };
    Profile.prototype.getProperties = function() {
        if (this.status < 0) {
            return null
        }
        if (!this.properties) {
            var string = this.getValue("data");
            if (string) {
                this.properties = JSON.decode(string)
            } else {
                this.properties = {}
            }
        }
        return this.properties
    };
    Profile.prototype.allPropertyNames = function() {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return Object.keys(dict)
    };
    Profile.prototype.getProperty = function(name) {
        var dict = this.getProperties();
        if (!dict) {
            return null
        }
        return dict[name]
    };
    Profile.prototype.setProperty = function(name, value) {
        this.status = 0;
        var dict = this.getProperties();
        dict[name] = value;
        this.setValue("data", null);
        this.setValue("signature", null);
        this.data = null;
        this.signature = null
    };
    Profile.prototype.verify = function(publicKey) {
        if (this.status > 0) {
            return true
        }
        var data = this.getData();
        var signature = this.getSignature();
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
    Profile.prototype.sign = function(privateKey) {
        if (this.status > 0) {
            return this.signature
        }
        this.status = 1;
        var string = JSON.encode(this.getProperties());
        var str = new ns.type.String(string);
        this.data = str.getBytes();
        this.signature = privateKey.sign(this.data);
        this.setValue("data", string);
        this.setValue("signature", Base64.encode(this.signature));
        return this.signature
    };
    Profile.prototype.getName = function() {
        return this.getProperty("name")
    };
    Profile.prototype.setName = function(name) {
        this.setProperty("name", name)
    };
    Profile.prototype.getKey = function() {
        if (!this.key) {
            var key = this.getProperty("key");
            if (key) {
                this.key = PublicKey.getInstance(key)
            }
        }
        return this.key
    };
    Profile.prototype.setKey = function(publicKey) {
        this.key = publicKey;
        this.setProperty("key", publicKey)
    };
    var tai_classes = [];
    Profile.register = function(clazz) {
        tai_classes.push(clazz)
    };
    Profile.getInstance = function(dict) {
        if (!dict) {
            return null
        } else {
            if (dict instanceof Profile) {
                return dict
            }
        }
        var clazz;
        for (var i = tai_classes.length - 1; i >= 0; --i) {
            clazz = tai_classes[i];
            try {
                var tai = new clazz(dict);
                if (tai) {
                    return tai
                }
            } catch (e) {}
        }
        return new Profile(dict)
    };
    ns.Profile = Profile
}(DIMP);
! function(ns) {
    var Delegate = function() {};
    Delegate.prototype.getMeta = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    Delegate.prototype.getProfile = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    var Entity = function(identifier) {
        this.identifier = identifier;
        this.delegate = null
    };
    Entity.prototype.equals = function(other) {
        if (this === other) {
            return true
        } else {
            if (other instanceof Entity) {
                return this.identifier.equals(other.identifier)
            } else {
                return false
            }
        }
    };
    Entity.prototype.toString = function() {
        var clazz = Object.getPrototypeOf(this).constructor;
        return "<" + clazz.name + "|" + this.getType() + " " + this.identifier + " (" + this.getNumber() + ")" + ' "' + this.getName() + '">'
    };
    Entity.prototype.getType = function() {
        return this.identifier.getType()
    };
    Entity.prototype.getNumber = function() {
        return this.identifier.getNumber()
    };
    Entity.prototype.getName = function() {
        var profile = this.getProfile();
        if (profile) {
            var name = profile.getName();
            if (name) {
                return name
            }
        }
        return this.identifier.name
    };
    Entity.prototype.getMeta = function() {
        return this.delegate.getMeta(this.identifier)
    };
    Entity.prototype.getProfile = function() {
        return this.delegate.getProfile(this.identifier)
    };
    ns.EntityDataSource = Delegate;
    ns.Entity = Entity
}(DIMP);
! function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var EntityDataSource = ns.EntityDataSource;
    var Entity = ns.Entity;
    var UserDataSource = function() {};
    UserDataSource.inherits(EntityDataSource);
    UserDataSource.prototype.getContacts = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPublicKeyForEncryption = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPrivateKeysForDecryption = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPrivateKeyForSignature = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    UserDataSource.prototype.getPublicKeysForVerification = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    var User = function(identifier) {
        Entity.call(this, identifier)
    };
    User.inherits(Entity);
    User.prototype.getContacts = function() {
        return this.delegate.getContacts(this.identifier)
    };
    var meta_key = function() {
        var meta = this.getMeta();
        return meta.key
    };
    var profile_key = function() {
        var profile = this.getProfile();
        if (!profile || !profile.isValid()) {
            return null
        }
        return profile.getKey()
    };
    var encrypt_key = function() {
        var key = this.delegate.getPublicKeyForEncryption(this.identifier);
        if (key) {
            return key
        }
        key = profile_key.call(this);
        if (key) {
            return key
        }
        key = meta_key.call(this);
        if (key && key.isinstanceof(EncryptKey)) {
            return key
        }
        throw Error("failed to get encrypt key for user: " + this.identifier)
    };
    var verify_keys = function() {
        var keys = this.delegate.getPublicKeysForVerification(this.identifier);
        if (keys && keys.length > 0) {
            return keys
        }
        keys = [];
        var key = profile_key.call(this);
        if (key && key.isinstanceof(VerifyKey)) {
            keys.push(key)
        }
        key = meta_key.call(this);
        keys.push(key);
        return keys
    };
    User.prototype.verify = function(data, signature) {
        var keys = verify_keys.call(this);
        if (keys) {
            for (var i = 0; i < keys.length; ++i) {
                if (keys[i].verify(data, signature)) {
                    return true
                }
            }
        }
        return false
    };
    User.prototype.encrypt = function(plaintext) {
        var key = encrypt_key.call(this);
        if (!key) {
            throw Error("failed to get encrypt key for user: " + this.identifier)
        }
        return key.encrypt(plaintext)
    };
    var sign_key = function() {
        return this.delegate.getPrivateKeyForSignature(this.identifier)
    };
    var decrypt_keys = function() {
        return this.delegate.getPrivateKeysForDecryption(this.identifier)
    };
    User.prototype.sign = function(data) {
        var key = sign_key.call(this);
        return key.sign(data)
    };
    User.prototype.decrypt = function(ciphertext) {
        var plaintext;
        var keys = decrypt_keys.call(this);
        for (var i = 0; i < keys.length; ++i) {
            try {
                plaintext = keys[i].decrypt(ciphertext);
                if (plaintext && plaintext.length > 0) {
                    return plaintext
                }
            } catch (e) {}
        }
        return null
    };
    ns.UserDataSource = UserDataSource;
    ns.User = User
}(DIMP);
! function(ns) {
    var EntityDataSource = ns.EntityDataSource;
    var Entity = ns.Entity;
    var GroupDataSource = function() {};
    GroupDataSource.inherits(EntityDataSource);
    GroupDataSource.prototype.getFounder = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getOwner = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    GroupDataSource.prototype.getMembers = function(identifier) {
        console.assert(identifier !== null, "ID empty");
        console.assert(false, "implement me!");
        return null
    };
    var Group = function(identifier) {
        Entity.call(this, identifier);
        this.founder = null
    };
    Group.inherits(Entity);
    Group.prototype.getFounder = function() {
        if (!this.founder) {
            this.founder = this.delegate.getFounder(this.identifier)
        }
        return this.founder
    };
    Group.prototype.getOwner = function() {
        return this.delegate.getOwner(this.identifier)
    };
    Group.prototype.getMembers = function() {
        return this.delegate.getMembers(this.identifier)
    };
    ns.GroupDataSource = GroupDataSource;
    ns.Group = Group
}(DIMP);
