/**
 * Cryptography JavaScript Library (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Feb. 10, 2020
 * @copyright (c) 2020 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(ns) {
    var is_space = function(space) {
        if (typeof space.exports !== "function") {
            return false
        }
        if (typeof space.register !== "function") {
            return false
        }
        return space.__all__ instanceof Array
    };
    var register = function(name) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name);
            return true
        } else {
            return false
        }
    };
    var exports = function(outerSpace) {
        if (!is_space(outerSpace)) {
            namespace(outerSpace)
        }
        var all = this.__all__;
        var name, inner;
        for (var i = 0; i < all.length; ++i) {
            name = all[i];
            inner = this[name];
            if (!inner) {
                throw Error("empty object: " + name)
            }
            if (is_space(inner)) {
                if (typeof outerSpace[name] !== "object") {
                    outerSpace[name] = {}
                }
                inner.exports(outerSpace[name])
            } else {
                if (outerSpace.hasOwnProperty(name)) {} else {
                    outerSpace[name] = inner
                }
            }
            outerSpace.register(name)
        }
        return outerSpace
    };
    var namespace = function(space) {
        if (!space) {
            space = {}
        }
        if (!(space.__all__ instanceof Array)) {
            space.__all__ = []
        }
        space.register = register;
        space.exports = exports;
        return space
    };
    if (typeof ns.type !== "object") {
        ns.type = {}
    }
    if (typeof ns.format !== "object") {
        ns.format = {}
    }
    if (typeof ns.digest !== "object") {
        ns.digest = {}
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = {}
    }
    namespace(ns);
    namespace(ns.type);
    namespace(ns.format);
    namespace(ns.digest);
    namespace(ns.crypto);
    ns.namespace = namespace;
    ns.register("type");
    ns.register("format");
    ns.register("digest");
    ns.register("crypto")
}(DIMP);
! function(ns) {
    var is_instance = function(object, clazz) {
        if (object instanceof clazz) {
            return true
        }
        var child = Object.getPrototypeOf(object);
        var names = Object.getOwnPropertyNames(clazz.prototype);
        for (var i = 0; i < names.length; ++i) {
            if (!child.hasOwnProperty(names[i])) {
                return false
            }
        }
        return true
    };
    var inherit = function(clazz, protocol) {
        var prototype = protocol.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        for (var i = 0; i < names.length; ++i) {
            var key = names[i];
            if (clazz.prototype.hasOwnProperty(key)) {
                continue
            }
            var fn = prototype[key];
            if (typeof fn !== "function") {
                continue
            }
            clazz.prototype[key] = fn
        }
        return clazz
    };
    var inherits = function(clazz, interfaces) {
        for (var i = 0; i < interfaces.length; ++i) {
            clazz = inherit(clazz, interfaces[i])
        }
        return clazz
    };
    var face = function(child, parent) {
        if (!child) {
            child = function() {}
        }
        if (parent) {
            if (!(parent instanceof Array)) {
                var list = [];
                for (var i = 1; i < arguments.length; ++i) {
                    list.push(arguments[i])
                }
                parent = list
            }
            child = inherits(child, parent)
        }
        return child
    };
    var clazz = function(child, parent, interfaces) {
        if (!child) {
            child = function() {}
        }
        if (!parent) {
            parent = Object
        }
        child.prototype = Object.create(parent.prototype);
        inherit(child, parent);
        if (interfaces) {
            if (!(interfaces instanceof Array)) {
                var list = [];
                for (var i = 2; i < arguments.length; ++i) {
                    list.push(arguments[i])
                }
                interfaces = list
            }
            child = inherits(child, interfaces)
        }
        child.prototype.constructor = child;
        return child
    };
    var obj = clazz();
    obj.prototype.equals = function(other) {
        return this === other
    };
    obj.isinstance = is_instance;
    ns.type.Interface = face;
    ns.type.Class = clazz;
    ns.type.Object = obj;
    ns.type.register("Interface");
    ns.type.register("Class");
    ns.type.register("Object")
}(DIMP);
! function(ns) {
    var base_enum = function(value, alias) {
        ns.type.Object.call(this);
        if (value instanceof base_enum) {
            this.value = value.value
        } else {
            this.value = value
        }
        this.alias = alias
    };
    ns.type.Class(base_enum, ns.type.Object);
    base_enum.prototype.equals = function(other) {
        if (!other) {
            return !this.value
        } else {
            if (other instanceof base_enum) {
                return this.value === other.value
            } else {
                return this.value === other
            }
        }
    };
    base_enum.prototype.valueOf = function() {
        return this.value
    };
    base_enum.prototype.toString = function() {
        return "<" + this.alias.toString() + ": " + this.value.toString() + ">"
    };
    base_enum.prototype.toLocaleString = function() {
        return "<" + this.alias.toLocaleString() + ": " + this.value.toLocaleString() + ">"
    };
    base_enum.prototype.toJSON = function() {
        return this.value
    };
    var enu = function(elements) {
        var enumeration = function(value, alias) {
            if (!alias) {
                alias = get_name(value, enumeration);
                if (!alias) {
                    throw RangeError("enum error: " + value)
                }
            }
            base_enum.call(this, value, alias)
        };
        ns.type.Class(enumeration, base_enum);
        var e, v;
        for (var name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue
            }
            v = elements[name];
            if (typeof v === "function") {
                continue
            }
            e = new enumeration(v, name);
            enumeration[name] = e
        }
        return enumeration
    };
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
    ns.type.Enum = enu;
    ns.type.register("Enum")
}(DIMP);
! function(ns) {
    var bytes = function(length) {
        ns.type.Object.call(this);
        var value = length ? arguments[0] : 0;
        if (typeof value === "number") {
            if (value < 1) {
                value = 1
            }
            this.array = new Uint8Array(value);
            this.length = 0
        } else {
            if (value instanceof bytes) {
                this.array = value.array;
                this.length = value.length
            } else {
                if (value instanceof Uint8Array) {
                    this.array = value;
                    this.length = value.length
                } else {
                    value = new Uint8Array(value);
                    this.array = value;
                    this.length = value.length
                }
            }
        }
    };
    ns.type.Class(bytes, ns.type.Object);
    bytes.prototype.equals = function(other) {
        if (!other) {
            return this.length === 0
        } else {
            if (other instanceof bytes) {
                if (this.length !== other.length) {
                    return false
                } else {
                    if (this.array === other.array) {
                        return true
                    }
                }
                return ns.type.Arrays.equals(this.getBytes(), other.getBytes())
            } else {
                return ns.type.Arrays.equals(this.getBytes(), other)
            }
        }
    };
    bytes.prototype.getBytes = function(copy) {
        if (this.length < 1) {
            return null
        }
        var view;
        if (this.length === this.array.length) {
            view = this.array
        } else {
            view = this.array.subarray(0, this.length)
        }
        if (copy) {
            var array = new Uint8Array(this.length);
            array.set(view);
            return array
        } else {
            return view
        }
    };
    bytes.prototype.getByte = function(index) {
        if (index < this.length) {
            return this.array[index]
        } else {
            return 0
        }
    };
    bytes.prototype.setByte = function(index, value) {
        if (index >= this.array.length) {
            expand.call(this, index + 1)
        }
        this.array[index] = value;
        if (index >= this.length) {
            this.length = index + 1
        }
    };
    var expand = function(size) {
        var bigger = new Uint8Array(size);
        bigger.set(this.array);
        this.array = bigger
    };
    var add_item = function(value) {
        if (this.length >= this.array.length) {
            expand.call(this, this.length << 1)
        }
        this.array[this.length] = value;
        ++this.length
    };
    var add_array = function(array) {
        if (!array) {
            return
        }
        var size = array.length;
        if (size < 1) {
            return
        }
        size += this.length;
        var capacity = this.array.length;
        if (size > capacity) {
            while (capacity < size) {
                capacity = capacity << 1
            }
            expand.call(this, capacity)
        }
        this.array.set(array, this.length);
        this.length = size
    };
    bytes.prototype.push = function(items) {
        if (typeof items === "number") {
            add_item.call(this, items)
        } else {
            var array;
            if (items instanceof Uint8Array) {
                array = items
            } else {
                if (items instanceof bytes) {
                    array = items.getBytes()
                } else {
                    array = new Uint8Array(items)
                }
            }
            add_array.call(this, array)
        }
        return this.length
    };
    bytes.prototype.pop = function() {
        if (this.length < 1) {
            throw RangeError("bytes empty")
        }
        this.length -= 1;
        var last = this.array[this.length];
        this.array[this.length] = 0;
        return last
    };
    bytes.prototype.copy = function() {
        return new bytes(this.getBytes(true))
    };
    bytes.prototype.concat = function(items) {
        var clone = this.copy();
        for (var i = 0; i < arguments.length; ++i) {
            clone.push(arguments[i])
        }
        return clone
    };
    bytes.prototype.toArray = function() {
        var array = this.getBytes();
        if (typeof Array.from === "function") {
            return Array.from(array)
        } else {
            return [].slice.call(array)
        }
    };
    bytes.from = function(array) {
        return new bytes(array)
    };
    ns.type.Data = bytes;
    ns.type.register("Data")
}(DIMP);
! function(ns) {
    var Data = ns.type.Data;
    var UTF8 = {
        encode: function(str) {
            var len = str.length;
            var array = new Data(len);
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
            return array.getBytes()
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
    var str = function(value, charset) {
        if (!value) {
            value = ""
        } else {
            if (value instanceof Uint8Array) {
                if (!charset || charset === "UTF-8") {
                    value = UTF8.decode(value)
                } else {
                    throw Error("only UTF-8 now")
                }
            } else {
                if (value instanceof str) {
                    value = value.string
                } else {
                    if (typeof value !== "string") {
                        throw Error("string value error: " + value)
                    }
                }
            }
        }
        ns.type.Object.call(this);
        this.string = value
    };
    ns.type.Class(str, ns.type.Object);
    str.prototype.getBytes = function(charset) {
        if (!charset || charset === "UTF-8") {
            return UTF8.encode(this.string)
        }
        throw Error("unknown charset: " + charset)
    };
    str.prototype.equals = function(other) {
        if (!other) {
            return !this.string
        } else {
            if (other instanceof str) {
                return this.string === other.string
            } else {
                return this.string === other
            }
        }
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
            return !this.string
        } else {
            if (other instanceof str) {
                return equalsIgnoreCase(this.string, other.string)
            } else {
                return equalsIgnoreCase(this.string, other)
            }
        }
    };
    str.prototype.valueOf = function() {
        return this.string
    };
    str.prototype.toString = function() {
        return this.string
    };
    str.prototype.toLocaleString = function() {
        return this.string.toLocaleString()
    };
    str.prototype.toJSON = function() {
        return this.string
    };
    str.prototype.getLength = function() {
        return this.string.length
    };
    str.from = function(string) {
        if (string instanceof Array) {
            string = new Uint8Array(string)
        }
        return new str(string)
    };
    ns.type.String = str;
    ns.type.register("String")
}(DIMP);
! function(ns) {
    var arrays = {
        remove: function(array, item) {
            var index = array.indexOf(item);
            if (index < 0) {
                return null
            }
            return array.splice(index, 1)
        },
        equals: function(a1, a2) {
            if (a1 === a2) {
                return true
            }
            if (a1.length !== a2.length) {
                return false
            }
            var v1, v2;
            for (var k in a1) {
                if (!a1.hasOwnProperty(k)) {
                    continue
                }
                v1 = a1[k];
                v2 = a2[k];
                if (typeof v1["equals"] === "function") {
                    if (!v1.equals(v2)) {
                        return false
                    }
                } else {
                    if (typeof v2["equals"] === "function") {
                        if (!v2.equals(v1)) {
                            return false
                        }
                    } else {
                        if (v1 !== v2) {
                            return false
                        }
                    }
                }
            }
            return true
        }
    };
    var map = function(value) {
        if (!value) {
            value = {}
        } else {
            if (value instanceof map) {
                value = value.dictionary
            } else {
                if (value instanceof ns.type.String) {
                    value = ns.format.JSON.decode(value.toString())
                } else {
                    if (typeof value === "string") {
                        value = ns.format.JSON.decode(value)
                    }
                }
            }
        }
        ns.type.Object.call(this);
        this.dictionary = value
    };
    ns.type.Class(map, ns.type.Object);
    map.prototype.equals = function(other) {
        if (!other) {
            return !this.dictionary
        } else {
            if (other instanceof map) {
                return arrays.equals(this.dictionary, other.dictionary)
            } else {
                return arrays.equals(this.dictionary, other)
            }
        }
    };
    map.prototype.valueOf = function() {
        return this.dictionary
    };
    map.prototype.toString = function() {
        return this.dictionary.toString()
    };
    map.prototype.toLocaleString = function() {
        return this.dictionary.toLocaleString()
    };
    map.prototype.toJSON = function() {
        return this.dictionary
    };
    map.prototype.getMap = function(copy) {
        if (copy) {
            var json = ns.format.JSON.encode(this.dictionary);
            return ns.format.JSON.decode(json)
        } else {
            return this.dictionary
        }
    };
    map.prototype.allKeys = function() {
        return Object.keys(this.dictionary)
    };
    map.prototype.getValue = function(key) {
        return this.dictionary[key]
    };
    map.prototype.setValue = function(key, value) {
        if (value) {
            this.dictionary[key] = value
        } else {
            if (this.dictionary.hasOwnProperty(key)) {
                delete this.dictionary[key]
            }
        }
    };
    map.from = function(dict) {
        return new map(dict)
    };
    ns.type.Dictionary = map;
    ns.type.Arrays = arrays;
    ns.type.register("Dictionary");
    ns.type.register("Arrays")
}(DIMP);
! function(ns) {
    var Data = ns.type.Data;
    var hex_chars = "0123456789abcdef";
    var hex_values = new Int8Array(128);
    ! function(chars, values) {
        for (var i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i
        }
        values["A".charCodeAt(0)] = 10;
        values["B".charCodeAt(0)] = 11;
        values["C".charCodeAt(0)] = 12;
        values["D".charCodeAt(0)] = 13;
        values["E".charCodeAt(0)] = 14;
        values["F".charCodeAt(0)] = 15
    }(hex_chars, hex_values);
    var hex_encode = function(data) {
        var len = data.length;
        var str = "";
        var byt;
        for (var i = 0; i < len; ++i) {
            byt = data[i];
            str += hex_chars[byt >> 4];
            str += hex_chars[byt & 15]
        }
        return str
    };
    var hex_decode = function(str) {
        var i = 0;
        var len = str.length;
        if (len > 2) {
            if (str[0] === "0") {
                if (str[1] === "x" || str[1] === "X") {
                    i += 2
                }
            }
        }
        var size = Math.floor(len / 2);
        var data = new Data(size);
        --len;
        var hi, lo;
        for (; i < len; i += 2) {
            hi = hex_values[str.charCodeAt(i)];
            lo = hex_values[str.charCodeAt(i + 1)];
            data.push((hi << 4) | lo)
        }
        return data.getBytes()
    };
    var base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64_values = new Int8Array(128);
    ! function(chars, values) {
        for (var i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i
        }
    }(base64_chars, base64_values);
    var base64_encode = function(data) {
        var base64 = "";
        var length = data.length;
        var tail = "";
        var remainder = length % 3;
        if (remainder === 1) {
            length -= 1;
            tail = "=="
        } else {
            if (remainder === 2) {
                length -= 2;
                tail = "="
            }
        }
        var x1, x2, x3;
        var i;
        for (i = 0; i < length; i += 3) {
            x1 = data[i];
            x2 = data[i + 1];
            x3 = data[i + 2];
            base64 += base64_chars.charAt((x1 & 252) >> 2);
            base64 += base64_chars.charAt(((x1 & 3) << 4) | ((x2 & 240) >> 4));
            base64 += base64_chars.charAt(((x2 & 15) << 2) | ((x3 & 192) >> 6));
            base64 += base64_chars.charAt(x3 & 63)
        }
        if (remainder === 1) {
            x1 = data[i];
            base64 += base64_chars.charAt((x1 & 252) >> 2);
            base64 += base64_chars.charAt((x1 & 3) << 4)
        } else {
            if (remainder === 2) {
                x1 = data[i];
                x2 = data[i + 1];
                base64 += base64_chars.charAt((x1 & 252) >> 2);
                base64 += base64_chars.charAt(((x1 & 3) << 4) | ((x2 & 240) >> 4));
                base64 += base64_chars.charAt((x2 & 15) << 2)
            }
        }
        return base64 + tail
    };
    var base64_decode = function(string) {
        var str = string.replace(/[^A-Za-z0-9+\/=]/g, "");
        var length = str.length;
        if ((length % 4) !== 0 || !/^[A-Za-z0-9+\/]+={0,2}$/.test(str)) {
            throw Error("base64 string error: " + string)
        }
        var array = new Data(length * 3 / 4);
        var ch1, ch2, ch3, ch4;
        var i;
        for (i = 0; i < length; i += 4) {
            ch1 = base64_values[str.charCodeAt(i)];
            ch2 = base64_values[str.charCodeAt(i + 1)];
            ch3 = base64_values[str.charCodeAt(i + 2)];
            ch4 = base64_values[str.charCodeAt(i + 3)];
            array.push(((ch1 & 63) << 2) | ((ch2 & 48) >> 4));
            array.push(((ch2 & 15) << 4) | ((ch3 & 60) >> 2));
            array.push(((ch3 & 3) << 6) | ((ch4 & 63) >> 0))
        }
        while (str[--i] === "=") {
            array.pop()
        }
        return array.getBytes()
    };
    var coder = function() {};
    ns.type.Interface(coder);
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
    ns.type.Class(hex, null, coder);
    hex.prototype.encode = function(data) {
        return hex_encode(data)
    };
    hex.prototype.decode = function(str) {
        return hex_decode(str)
    };
    var base64 = function() {};
    ns.type.Class(base64, null, coder);
    base64.prototype.encode = function(data) {
        return base64_encode(data)
    };
    base64.prototype.decode = function(string) {
        return base64_decode(string)
    };
    var base58 = function() {};
    ns.type.Class(base58, null, coder);
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
    var C = function(lib) {
        this.coder = lib
    };
    ns.type.Class(C, null, coder);
    C.prototype.encode = function(data) {
        return this.coder.encode(data)
    };
    C.prototype.decode = function(string) {
        return this.coder.decode(string)
    };
    ns.format.BaseCoder = coder;
    ns.format.Hex = new C(new hex());
    ns.format.Base58 = new C(new base58());
    ns.format.Base64 = new C(new base64());
    ns.format.register("BaseCoder");
    ns.format.register("Hex");
    ns.format.register("Base58");
    ns.format.register("Base64")
}(DIMP);
! function(ns) {
    var hash = function() {};
    ns.type.Interface(hash);
    hash.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var md5 = function() {};
    ns.type.Class(md5, null, hash);
    md5.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "MD5 not implemented");
        return null
    };
    var sha256 = function() {};
    ns.type.Class(sha256, null, hash);
    sha256.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "SHA256 not implemented");
        return null
    };
    var ripemd160 = function() {};
    ns.type.Class(ripemd160, null, hash);
    ripemd160.prototype.digest = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "RIPEMD160 not implemented");
        return null
    };
    var H = function(lib) {
        this.hash = lib
    };
    ns.type.Class(H, null, hash);
    H.prototype.digest = function(data) {
        return this.hash.digest(data)
    };
    ns.digest.Hash = hash;
    ns.digest.MD5 = new H(new md5());
    ns.digest.SHA256 = new H(new sha256());
    ns.digest.RIPEMD160 = new H(new ripemd160());
    ns.digest.register("Hash");
    ns.digest.register("MD5");
    ns.digest.register("SHA256");
    ns.digest.register("RIPEMD160")
}(DIMP);
! function(ns) {
    var parser = function() {};
    ns.type.Interface(parser);
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
    ns.type.Class(json, null, parser);
    json.prototype.encode = function(container) {
        return JSON.stringify(container)
    };
    json.prototype.decode = function(string) {
        return JSON.parse(string)
    };
    var P = function(lib) {
        this.parser = lib
    };
    ns.type.Class(P, null, parser);
    P.prototype.encode = function(container) {
        return this.parser.encode(container)
    };
    P.prototype.decode = function(string) {
        return this.parser.decode(string)
    };
    ns.format.DataParser = parser;
    ns.format.JSON = new P(new json());
    ns.format.register("DataParser");
    ns.format.register("JSON")
}(DIMP);
! function(ns) {
    var parser = function() {};
    ns.type.Interface(parser);
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
    ns.type.Class(pem, null, parser);
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
    ns.type.Class(P, null, parser);
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
    ns.format.KeyParser = parser;
    ns.format.PEM = new P(new pem());
    ns.format.register("KeyParser");
    ns.format.register("PEM")
}(DIMP);
! function(ns) {
    var CryptographyKey = function() {};
    ns.type.Interface(CryptographyKey);
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
    ns.type.Interface(EncryptKey, CryptographyKey);
    EncryptKey.prototype.encrypt = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var DecryptKey = function() {};
    ns.type.Interface(DecryptKey, CryptographyKey);
    DecryptKey.prototype.decrypt = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var SignKey = function() {};
    ns.type.Interface(SignKey, CryptographyKey);
    SignKey.prototype.sign = function(data) {
        console.assert(data != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var VerifyKey = function() {};
    ns.type.Interface(VerifyKey, CryptographyKey);
    VerifyKey.prototype.verify = function(data, signature) {
        console.assert(data != null, "data empty");
        console.assert(signature != null, "signature empty");
        console.assert(false, "implement me!");
        return false
    };
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;
    ns.crypto.register("EncryptKey");
    ns.crypto.register("DecryptKey");
    ns.crypto.register("SignKey");
    ns.crypto.register("VerifyKey")
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var promise = new ns.type.String("Moky loves May Lee forever!");
    promise = promise.getBytes();
    var SymmetricKey = function() {};
    ns.type.Interface(SymmetricKey, EncryptKey, DecryptKey);
    SymmetricKey.prototype.equals = function(other) {
        var ciphertext = other.encrypt(promise);
        var plaintext = this.decrypt(ciphertext);
        return ns.type.Arrays.equals(promise, plaintext)
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
            if (ns.type.Object.isinstance(key, SymmetricKey)) {
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
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.register("SymmetricKey")
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = function() {};
    ns.type.Interface(AsymmetricKey, CryptographyKey);
    AsymmetricKey.RSA = "RSA";
    AsymmetricKey.ECC = "ECC";
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.register("AsymmetricKey")
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var promise = new ns.type.String("Moky loves May Lee forever!");
    promise = promise.getBytes();
    var PublicKey = function() {};
    ns.type.Interface(PublicKey, AsymmetricKey, VerifyKey);
    PublicKey.prototype.matches = function(privateKey) {
        if (!privateKey) {
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
        if (!key) {
            return null
        } else {
            if (ns.type.Object.isinstance(key, PublicKey)) {
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
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.register("PublicKey")
}(DIMP);
! function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = function() {};
    ns.type.Interface(PrivateKey, AsymmetricKey, SignKey);
    PrivateKey.prototype.equals = function(other) {
        var publicKey = this.getPublicKey();
        if (!publicKey) {
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
        if (!key) {
            return null
        } else {
            if (ns.type.Object.isinstance(key, PrivateKey)) {
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
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.register("PrivateKey")
}(DIMP);
