/**
 * Cryptography JavaScript Library (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Jan. 27, 2020
 * @copyright (c) 2020 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */
if (typeof DIMP !== "object") {
    DIMP = {}
}! function() {
    var is_instanceof = function(clazz) {
        if (this instanceof clazz) {
            return true
        }
        var me = Object.getPrototypeOf(this);
        var prototype = clazz.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        for (var j = 0; j < names.length; ++j) {
            var key = names[j];
            if (!me.hasOwnProperty(key)) {
                return false
            }
        }
        return true
    };
    var implement = function(protocol) {
        var prototype = protocol.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        for (var j = 0; j < names.length; ++j) {
            var key = names[j];
            if (this.prototype.hasOwnProperty(key)) {
                continue
            }
            var fn = prototype[key];
            if (typeof fn !== "function") {
                continue
            }
            this.prototype[key] = fn
        }
        return this
    };
    var extend = function(base) {
        this.prototype = Object.create(base.prototype);
        this.prototype.constructor = this;
        return this
    };
    var inherits = function() {
        extend.call(this, arguments[0]);
        for (var i = 0; i < arguments.length; ++i) {
            implement.call(this, arguments[i])
        }
        return this
    };
    if (typeof Object.prototype.isinstanceof !== "function") {
        Object.prototype.isinstanceof = is_instanceof
    }
    if (typeof Function.prototype.inherits !== "function") {
        Function.prototype.inherits = inherits
    }
}();
! function(ns) {
    var coder = function() {};
    coder.prototype.encode = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    coder.prototype.decode = function(string) {
        console.assert(string != null, "string empty");
        console.assert(false, "implement me!");
        return null
    };
    var hex = function() {};
    hex.inherits(coder);
    hex.prototype.encode = function(data) {
        var i = 0;
        var len = data.length;
        var num;
        var str = "";
        for (; i < len; ++i) {
            num = Number(data[i]);
            str += num.toString(16)
        }
        return str
    };
    hex.prototype.decode = function(str) {
        var i = 0;
        var len = str.length;
        if (len > 2) {
            if (str[0] === "0") {
                if (str[1] === "x" || str[1] === "X") {
                    i += 2
                }
            }
        }
        var ch;
        var data = [];
        for (;
            (i + 1) < len; i += 2) {
            ch = str.substring(i, i + 2);
            data.push(parseInt(ch, 16))
        }
        return data
    };
    var base58 = function() {};
    base58.inherits(coder);
    base58.prototype.encode = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "Base58 encode not implemented");
        return null
    };
    base58.prototype.decode = function(string) {
        console.assert(string != null, "string empty");
        console.assert(false, "Base58 decode not implemented");
        return null
    };
    var base64 = function() {};
    base64.inherits(coder);
    base64.prototype.encode = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "Base64 encode not implemented");
        return null
    };
    base64.prototype.decode = function(string) {
        console.assert(string != null, "string empty");
        console.assert(false, "Base64 decode not implemented");
        return null
    };
    var C = function(lib) {
        this.coder = lib
    };
    C.prototype.encode = function(data) {
        return this.coder.encode(data)
    };
    C.prototype.decode = function(string) {
        return this.coder.decode(string)
    };
    if (typeof ns.format !== "object") {
        ns.format = {}
    }
    ns.format.BaseCoder = coder;
    ns.format.Hex = new C(new hex());
    ns.format.Base58 = new C(new base58());
    ns.format.Base64 = new C(new base64())
}(DIMP);
! function(ns) {
    var hash = function() {};
    hash.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var md5 = function() {};
    md5.inherits(hash);
    md5.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "MD5 not implemented");
        return null
    };
    var sha256 = function() {};
    sha256.inherits(hash);
    sha256.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "SHA256 not implemented");
        return null
    };
    var ripemd160 = function() {};
    ripemd160.inherits(hash);
    ripemd160.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "RIPEMD160 not implemented");
        return null
    };
    var H = function(lib) {
        this.hash = lib
    };
    H.prototype.digest = function(data) {
        return this.hash.digest(data)
    };
    if (typeof ns.digest !== "object") {
        ns.digest = {}
    }
    ns.digest.Hash = hash;
    ns.digest.MD5 = new H(new md5());
    ns.digest.SHA256 = new H(new sha256());
    ns.digest.RIPEMD160 = new H(new ripemd160())
}(DIMP);
! function(ns) {
    var parser = function() {};
    parser.prototype.encode = function(container) {
        console.assert(container != null, "container empty");
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.decode = function(string) {
        console.assert(string != null, "string empty");
        console.assert(false, "implement me!");
        return null
    };
    var json = function() {};
    json.inherits(parser);
    json.prototype.encode = function(container) {
        return JSON.stringify(container)
    };
    json.prototype.decode = function(string) {
        return JSON.parse(string)
    };
    var P = function(lib) {
        this.parser = lib
    };
    P.prototype.encode = function(container) {
        return this.parser.encode(container)
    };
    P.prototype.decode = function(string) {
        return this.parser.decode(string)
    };
    if (typeof ns.format !== "object") {
        ns.format = {}
    }
    ns.format.DataParser = parser;
    ns.format.JSON = new P(new json())
}(DIMP);
! function(ns) {
    var parser = function() {};
    parser.prototype.encodePublicKey = function(key) {
        console.assert(key != null, "public key empty");
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.encodePrivateKey = function(key) {
        console.assert(key != null, "private key empty");
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.decodePublicKey = function(pem) {
        console.assert(pem != null, "pem content empty");
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.decodePrivateKey = function(pem) {
        console.assert(pem != null, "pem content empty");
        console.assert(false, "implement me!");
        return null
    };
    var pem = function() {};
    pem.inherits(parser);
    pem.prototype.encodePublicKey = function(key) {
        console.assert(key != null, "public key content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    pem.prototype.encodePrivateKey = function(key) {
        console.assert(key != null, "private key content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    pem.prototype.decodePublicKey = function(pem) {
        console.assert(pem != null, "pem content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    pem.prototype.decodePrivateKey = function(pem) {
        console.assert(pem != null, "pem content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    var P = function(lib) {
        this.parser = lib
    };
    P.prototype.encodePublicKey = function(key) {
        return this.parser.encodePublicKey(key)
    };
    P.prototype.encodePrivateKey = function(key) {
        return this.parser.encodePrivateKey(key)
    };
    P.prototype.decodePublicKey = function(pem) {
        return this.parser.decodePublicKey(pem)
    };
    P.prototype.decodePrivateKey = function(pem) {
        return this.parser.decodePrivateKey(pem)
    };
    if (typeof ns.format !== "object") {
        ns.format = {}
    }
    ns.format.KeyParser = parser;
    ns.format.PEM = new P(new pem())
}(DIMP);
! function(ns) {
    var UTF8 = {
        encode: function(str) {
            var array = [];
            var len = str.length;
            var c;
            for (var i = 0; i < len; ++i) {
                c = str.charCodeAt(i);
                if (c <= 0) {
                    break
                } else {
                    if (c < 128) {
                        array.push(c)
                    } else {
                        if (c < 2048) {
                            array.push(192 | ((c >> 6) & 31));
                            array.push(128 | ((c >> 0) & 63))
                        } else {
                            array.push(224 | ((c >> 12) & 15));
                            array.push(128 | ((c >> 6) & 63));
                            array.push(128 | ((c >> 0) & 63))
                        }
                    }
                }
            }
            return array
        },
        decode: function(array) {
            var string = "";
            var len = array.length;
            var c, c2, c3;
            for (var i = 0; i < len; ++i) {
                c = array[i];
                switch (c >> 4) {
                    case 12:
                    case 13:
                        c2 = array[++i];
                        c = ((c & 31) << 6) | (c2 & 63);
                        break;
                    case 14:
                        c2 = array[++i];
                        c3 = array[++i];
                        c = ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63);
                        break
                }
                string += String.fromCharCode(c)
            }
            return string
        }
    };
    var obj = function(value) {
        if (value instanceof obj) {
            this.value = value.value
        } else {
            this.value = value
        }
    };
    obj.prototype.equals = function(other) {
        if (other instanceof obj) {
            return this.value === other.value
        } else {
            return this.value === other
        }
    };
    obj.prototype.valueOf = function() {
        return this.value.valueOf()
    };
    obj.prototype.toString = function() {
        return this.value.toString()
    };
    obj.prototype.toLocaleString = function() {
        return this.value.toLocaleString()
    };
    obj.prototype.toJSON = function() {
        return ns.format.JSON.encode(this.value)
    };
    var str = function(data, charset) {
        if (data instanceof Array) {
            if (!charset || charset === "UTF-8") {
                data = UTF8.decode(data)
            } else {
                throw Error("only UTF-8 now")
            }
        }
        obj.call(this, data)
    };
    str.inherits(obj);
    str.prototype.getBytes = function(charset) {
        if (!charset || charset === "UTF-8") {
            return UTF8.encode(this.value)
        }
        return this.value
    };
    str.prototype.equals = function(other) {
        if (!other) {
            return !this.value
        } else {
            if (other instanceof str) {
                return this.value === other.value
            }
        }
        return this.value === other
    };
    var equalsIgnoreCase = function(str1, str2) {
        if (str1.length !== str2.length) {
            return false
        }
        var low1 = str1.toLowerCase();
        var low2 = str2.toLowerCase();
        return low1 === low2
    };
    str.prototype.equalsIgnoreCase = function(other) {
        if (!other) {
            return !this.value
        } else {
            if (other instanceof str) {
                return equalsIgnoreCase(this.value, other.value)
            }
        }
        return equalsIgnoreCase(this.value, other)
    };
    str.prototype.getLength = function() {
        return this.value.length
    };
    var arrays = {
        equals: function(a1, a2) {
            if (a1 === a2) {
                return true
            }
            if (a1.length !== a2.length) {
                return false
            }
            for (var k in a1) {
                if (a1[k] !== a2[k]) {
                    return false
                }
            }
            return true
        }
    };
    var map = function(map) {
        obj.call(this, map)
    };
    map.inherits(obj);
    map.prototype.equals = function(other) {
        if (!other) {
            return !this.value
        } else {
            if (other instanceof map) {
                return arrays.equals(this.value, other.value)
            }
        }
        return arrays.equals(this.value, other)
    };
    map.prototype.toString = function() {
        return this.toJSON()
    };
    map.prototype.toLocaleString = function() {
        return this.toJSON()
    };
    map.prototype.getMap = function(copy) {
        if (copy) {
            var json = ns.format.JSON.encode(this.value);
            return ns.format.JSON.decode(json)
        } else {
            return this.value
        }
    };
    map.prototype.allKeys = function() {
        return Object.keys(this.value)
    };
    map.prototype.getValue = function(key) {
        return this.value[key]
    };
    map.prototype.setValue = function(key, value) {
        if (value !== null) {
            this.value[key] = value
        } else {
            if (this.value.hasOwnProperty(key)) {
                delete this.value[key]
            }
        }
    };
    var enu = function(elements) {
        var get_name = function(value, enumeration) {
            if (value instanceof enumeration) {
                return value.alias
            }
            var e;
            for (var k in enumeration) {
                e = enumeration[k];
                if (e instanceof enumeration) {
                    if (e.equals(value)) {
                        return e.alias
                    }
                }
            }
            return null
        };
        var enumeration = function(value, alias) {
            if (!alias) {
                alias = get_name(value, enumeration);
                if (!alias) {
                    throw RangeError("enum error: " + value)
                }
            }
            obj.call(this, value);
            this.alias = alias
        };
        enumeration.inherits(obj);
        enumeration.prototype.toString = function() {
            return "<" + this.alias.toString() + ": " + this.value.toString() + ">"
        };
        enumeration.prototype.toLocaleString = function() {
            return "<" + this.alias.toLocaleString() + ": " + this.value.toLocaleString() + ">"
        };
        var e, v;
        for (var name in elements) {
            v = elements[name];
            if (typeof v === "function") {
                continue
            }
            e = new enumeration(v, name);
            enumeration[name] = e
        }
        return enumeration
    };
    if (typeof ns.type !== "object") {
        ns.type = {}
    }
    ns.type.Object = obj;
    ns.type.String = str;
    ns.type.Dictionary = map;
    ns.type.Arrays = arrays;
    ns.type.Enum = enu
}(DIMP);
! function(ns) {
    var CryptographyKey = function() {};
    CryptographyKey.prototype.equals = function(other) {
        console.assert(other != null, "other key empty");
        console.assert(false, "implement me!");
        return false
    };
    CryptographyKey.prototype.getData = function() {
        console.assert(false, "implement me!");
        return null
    };
    CryptographyKey.prototype.getSize = function() {
        console.assert(false, "implement me!");
        return 0
    };
    CryptographyKey.createInstance = function(clazz, map) {
        if (typeof clazz.getInstance === "function") {
            return clazz.getInstance(map)
        } else {
            return new clazz(map)
        }
    };
    var EncryptKey = function() {};
    EncryptKey.inherits(CryptographyKey);
    EncryptKey.prototype.encrypt = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var DecryptKey = function() {};
    DecryptKey.inherits(CryptographyKey);
    DecryptKey.prototype.decrypt = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var SignKey = function() {};
    SignKey.inherits(CryptographyKey);
    SignKey.prototype.sign = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var VerifyKey = function() {};
    VerifyKey.inherits(CryptographyKey);
    VerifyKey.prototype.verify = function(data, signature) {
        console.assert(data != null, "data empty");
        console.assert(signature != null, "signature empty");
        console.assert(false, "implement me!");
        return false
    };
    if (typeof ns.crypto !== "object") {
        ns.crypto = {}
    }
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var Arrays = ns.type.Arrays;
    var promise = new ns.type.String("Moky loves May Lee forever!");
    promise = promise.getBytes();
    var SymmetricKey = function() {};
    SymmetricKey.inherits(EncryptKey, DecryptKey);
    SymmetricKey.prototype.equals = function(other) {
        var ciphertext = other.encrypt(promise);
        var plaintext = this.decrypt(ciphertext);
        return Arrays.equals(promise, plaintext)
    };
    SymmetricKey.generate = function(algorithm) {
        return this.getInstance({
            algorithm: algorithm
        })
    };
    var key_classes = {};
    SymmetricKey.register = function(algorithm, clazz) {
        key_classes[algorithm] = clazz
    };
    SymmetricKey.getInstance = function(key) {
        if (!key) {
            return null
        } else {
            if (key.isinstanceof(SymmetricKey)) {
                return key
            }
        }
        var algorithm = key["algorithm"];
        var clazz = key_classes[algorithm];
        if (typeof clazz === "function") {
            return CryptographyKey.createInstance(clazz, key)
        }
        throw TypeError("key algorithm error: " + algorithm)
    };
    SymmetricKey.AES = "AES";
    SymmetricKey.DES = "DES";
    ns.crypto.SymmetricKey = SymmetricKey
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = function() {};
    AsymmetricKey.inherits(CryptographyKey);
    AsymmetricKey.RSA = "RSA";
    AsymmetricKey.ECC = "ECC";
    ns.crypto.AsymmetricKey = AsymmetricKey
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var promise = new ns.type.String("Moky loves May Lee forever!");
    promise = promise.getBytes();
    var PublicKey = function() {};
    PublicKey.inherits(AsymmetricKey, VerifyKey);
    PublicKey.prototype.matches = function(privateKey) {
        if (privateKey === null) {
            return false
        }
        var publicKey = privateKey.getPublicKey();
        if (this.equals(publicKey)) {
            return true
        }
        var signature = privateKey.sign(promise);
        return this.verify(promise, signature)
    };
    var public_key_classes = {};
    PublicKey.register = function(algorithm, clazz) {
        public_key_classes[algorithm] = clazz
    };
    PublicKey.getInstance = function(key) {
        if (key === null) {
            return null
        } else {
            if (key.isinstanceof(PublicKey)) {
                return key
            }
        }
        var algorithm = key["algorithm"];
        var clazz = public_key_classes[algorithm];
        if (typeof clazz === "function") {
            return CryptographyKey.createInstance(clazz, key)
        }
        throw TypeError("key algorithm error: " + algorithm)
    };
    ns.crypto.PublicKey = PublicKey
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = function() {};
    PrivateKey.inherits(AsymmetricKey, SignKey);
    PrivateKey.prototype.equals = function(other) {
        var publicKey = this.getPublicKey();
        if (publicKey === null) {
            return false
        }
        return publicKey.matches(other)
    };
    PrivateKey.prototype.getPublicKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    PrivateKey.generate = function(algorithm) {
        return this.getInstance({
            algorithm: algorithm
        })
    };
    var private_key_classes = {};
    PrivateKey.register = function(algorithm, clazz) {
        private_key_classes[algorithm] = clazz
    };
    PrivateKey.getInstance = function(key) {
        if (key === null) {
            return null
        } else {
            if (key.isinstanceof(PrivateKey)) {
                return key
            }
        }
        var algorithm = key["algorithm"];
        var clazz = private_key_classes[algorithm];
        if (typeof clazz === "function") {
            return CryptographyKey.createInstance(clazz, key)
        }
        throw TypeError("key algorithm error: " + algorithm)
    };
    ns.crypto.PrivateKey = PrivateKey
}(DIMP);
