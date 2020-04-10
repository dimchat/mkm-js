/**
 * Cryptography JavaScript Library (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Apr. 10, 2020
 * @copyright (c) 2020 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(ns) {
    var namespacefy = function(space) {
        if (!space) {
            space = new namespace()
        } else {
            if (!is_space(space)) {
                space.__all__ = [];
                space.register = namespace.prototype.register;
                space.exports = namespace.prototype.exports
            }
        }
        return space
    };
    var is_space = function(space) {
        if (space instanceof namespace) {
            return true
        }
        if (typeof space.exports !== "function") {
            return false
        }
        if (typeof space.register !== "function") {
            return false
        }
        return space.__all__ instanceof Array
    };
    var namespace = function() {
        this.__all__ = []
    };
    namespace.prototype.register = function(name) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name);
            return true
        } else {
            return false
        }
    };
    namespace.prototype.exports = function(outerSpace) {
        namespacefy(outerSpace);
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
                    outerSpace[name] = new namespace()
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
    ns.Namespace = namespacefy;
    namespacefy(ns);
    ns.register("Namespace")
}(DIMP);
! function(ns) {
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
    ns.Namespace(ns.type);
    ns.Namespace(ns.format);
    ns.Namespace(ns.digest);
    ns.Namespace(ns.crypto);
    ns.register("type");
    ns.register("format");
    ns.register("digest");
    ns.register("crypto")
}(DIMP);
! function(ns) {
    var conforms = function(object, protocol) {
        if (!object) {
            return false
        }
        if (object instanceof protocol) {
            return true
        }
        var child = Object.getPrototypeOf(object);
        var names = Object.getOwnPropertyNames(protocol.prototype);
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
    var interfacefy = function(child, parent) {
        if (!child) {
            child = function() {}
        }
        if (parent) {
            var ancestors;
            if (parent instanceof Array) {
                ancestors = parent
            } else {
                ancestors = [];
                for (var i = 1; i < arguments.length; ++i) {
                    ancestors.push(arguments[i])
                }
            }
            child = inherits(child, ancestors)
        }
        return child
    };
    interfacefy.conforms = conforms;
    var classify = function(child, parent, interfaces) {
        if (!child) {
            child = function() {}
        }
        if (!parent) {
            parent = Object
        }
        child.prototype = Object.create(parent.prototype);
        inherit(child, parent);
        if (interfaces) {
            var ancestors;
            if (interfaces instanceof Array) {
                ancestors = interfaces
            } else {
                ancestors = [];
                for (var i = 2; i < arguments.length; ++i) {
                    ancestors.push(arguments[i])
                }
            }
            child = inherits(child, ancestors)
        }
        child.prototype.constructor = child;
        return child
    };
    ns.Interface = interfacefy;
    ns.Class = classify;
    ns.register("Interface");
    ns.register("Class")
}(DIMP);
! function(ns) {
    var obj = function() {};
    ns.Class(obj, Object, null);
    obj.prototype.equals = function(other) {
        return this === other
    };
    ns.type.Object = obj;
    ns.type.register("Object")
}(DIMP);
! function(ns) {
    var is_array = function(obj) {
        if (obj instanceof Array) {
            return true
        } else {
            if (obj instanceof Uint8Array) {
                return true
            } else {
                if (obj instanceof Int8Array) {
                    return true
                } else {
                    if (obj instanceof Uint8ClampedArray) {
                        return true
                    } else {
                        if (obj instanceof Uint16Array) {
                            return true
                        } else {
                            if (obj instanceof Int16Array) {
                                return true
                            } else {
                                if (obj instanceof Uint32Array) {
                                    return true
                                } else {
                                    if (obj instanceof Int32Array) {
                                        return true
                                    } else {
                                        if (obj instanceof Float32Array) {
                                            return true
                                        } else {
                                            if (obj instanceof Float64Array) {
                                                return true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false
    };
    var is_arrays_equal = function(array1, array2) {
        if (array1.length !== array2.length) {
            return false
        }
        for (var i = 0; i < array1.length; ++i) {
            if (!is_objects_equal(array1[i], array2[i])) {
                return false
            }
        }
        return true
    };
    var is_dictionary_equal = function(dict1, dict2) {
        var keys1 = Object.keys(dict1);
        var keys2 = Object.keys(dict2);
        if (keys1.length !== keys2.length) {
            return false
        }
        var k;
        for (var i = 0; i < keys1.length; ++i) {
            k = keys1[i];
            if (!is_objects_equal(dict1[k], dict2[k])) {
                return false
            }
        }
        return true
    };
    var is_objects_equal = function(obj1, obj2) {
        if (obj1 === obj2) {
            return true
        } else {
            if (!obj1) {
                return !obj2
            } else {
                if (!obj2) {
                    return false
                } else {
                    if (typeof obj1 === "string" || typeof obj2 === "string") {
                        return false
                    } else {
                        if (typeof obj1["equals"] === "function") {
                            return obj1.equals(obj2)
                        } else {
                            if (typeof obj2["equals"] === "function") {
                                return obj2.equals(obj1)
                            }
                        }
                    }
                }
            }
        }
        if (is_array(obj1)) {
            if (is_array(obj2)) {
                return is_arrays_equal(obj1, obj2)
            } else {
                return false
            }
        } else {
            if (is_array(obj2)) {
                return false
            }
        }
        return is_dictionary_equal(obj1, obj2)
    };
    var arrays = {
        remove: function(array, item) {
            var index = array.indexOf(item);
            if (index < 0) {
                return false
            } else {
                if (index === 0) {
                    array.shift()
                } else {
                    if ((index + 1) === array.length) {
                        array.pop()
                    } else {
                        array.splice(index, 1)
                    }
                }
            }
            return true
        },
        update: function(array, index, item) {
            if (index < 0) {
                index += array.length;
                if (index < 0) {
                    return false
                }
            }
            array[index] = item;
            return true
        },
        insert: function(array, index, item) {
            if (index < 0) {
                index += array.length + 1;
                if (index < 0) {
                    return false
                }
            }
            if (index === 0) {
                array.unshift(item)
            } else {
                if (index === array.length) {
                    array.push(item)
                } else {
                    if (index > array.length) {
                        array[index] = item
                    } else {
                        array.splice(index, 0, item)
                    }
                }
            }
            return true
        },
        equals: is_objects_equal
    };
    ns.type.Arrays = arrays;
    ns.type.register("Arrays")
}(DIMP);
! function(ns) {
    var get_alias = function(value) {
        var enumeration = this.constructor;
        var e;
        for (var k in enumeration) {
            if (!enumeration.hasOwnProperty(k)) {
                continue
            }
            e = enumeration[k];
            if (e instanceof enumeration) {
                if (e.equals(value)) {
                    return e.alias
                }
            }
        }
        return null
    };
    var base_enum = function(value, alias) {
        ns.type.Object.call(this);
        if (!alias) {
            if (value instanceof base_enum) {
                alias = value.alias
            } else {
                alias = get_alias.call(this, value)
            }
        }
        if (value instanceof base_enum) {
            value = value.value
        }
        this.value = value;
        this.alias = alias
    };
    ns.Class(base_enum, ns.type.Object, null);
    base_enum.prototype.equals = function(other) {
        if (!other) {
            return !this.value
        } else {
            if (other instanceof base_enum) {
                return this.value === other.valueOf()
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
    var enumify = function(enumeration, elements) {
        if (!enumeration) {
            enumeration = function(value, alias) {
                base_enum.call(this, value, alias)
            }
        }
        ns.Class(enumeration, base_enum, null);
        var e, v;
        for (var name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue
            }
            v = elements[name];
            if (v instanceof base_enum) {
                v = v.value
            } else {
                if (typeof v !== "number") {
                    throw TypeError("Enum value must be a number!")
                }
            }
            e = new enumeration(v, name);
            enumeration[name] = e
        }
        return enumeration
    };
    ns.type.BaseEnum = base_enum;
    ns.type.Enum = enumify;
    ns.type.register("BaseEnum");
    ns.type.register("Enum")
}(DIMP);
! function(ns) {
    var bytes = function(capacity) {
        ns.type.Object.call(this);
        var value = capacity ? arguments[0] : 0;
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
    ns.Class(bytes, ns.type.Object, null);
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
                return ns.type.Arrays.equals(this.getBytes(false), other.getBytes(false))
            } else {
                return ns.type.Arrays.equals(this.getBytes(false), other)
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
                    array = items.getBytes(false)
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
        var array = this.getBytes(false);
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
    var str = function(value) {
        if (!value) {
            value = ""
        } else {
            if (value instanceof str) {
                value = value.valueOf()
            } else {
                if (value instanceof Uint8Array) {
                    if (arguments.length === 1 || arguments[1] === "UTF-8") {
                        value = ns.format.UTF8.decode(value)
                    } else {
                        throw Error("unknown charset: " + arguments[1])
                    }
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
    ns.Class(str, ns.type.Object, null);
    str.prototype.getBytes = function(charset) {
        if (!charset || charset === "UTF-8") {
            return ns.format.UTF8.encode(this.string)
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
    str.from = function(array) {
        if (array instanceof Array) {
            array = new Uint8Array(array)
        }
        if (arguments.length === 1) {
            return new str(array)
        } else {
            return new str(array, arguments[1])
        }
    };
    ns.type.String = str;
    ns.type.register("String")
}(DIMP);
! function(ns) {
    var Arrays = ns.type.Arrays;
    var map = function(entries) {
        if (!entries) {
            entries = {}
        } else {
            if (entries instanceof map) {
                entries = entries.getMap(false)
            } else {
                if (entries instanceof ns.type.String) {
                    entries = ns.format.JSON.decode(entries.toString())
                } else {
                    if (typeof entries === "string") {
                        entries = ns.format.JSON.decode(entries)
                    }
                }
            }
        }
        ns.type.Object.call(this);
        this.dictionary = entries
    };
    ns.Class(map, ns.type.Object, null);
    map.prototype.equals = function(other) {
        if (!other) {
            return !this.dictionary
        } else {
            if (other instanceof map) {
                return Arrays.equals(this.dictionary, other.getMap(false))
            } else {
                return Arrays.equals(this.dictionary, other)
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
    ns.type.register("Dictionary")
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
    var hex_decode = function(string) {
        var i = 0;
        var len = string.length;
        if (len > 2) {
            if (string[0] === "0") {
                if (string[1] === "x" || string[1] === "X") {
                    i += 2
                }
            }
        }
        var size = Math.floor(len / 2);
        var data = new Data(size);
        --len;
        var hi, lo;
        for (; i < len; i += 2) {
            hi = hex_values[string.charCodeAt(i)];
            lo = hex_values[string.charCodeAt(i + 1)];
            data.push((hi << 4) | lo)
        }
        return data.getBytes(false)
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
        return array.getBytes(false)
    };
    var coder = function() {};
    ns.Interface(coder, null);
    coder.prototype.encode = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    coder.prototype.decode = function(string) {
        console.assert(false, "implement me!");
        return null
    };
    var hex = function() {};
    ns.Class(hex, ns.type.Object, [coder]);
    hex.prototype.encode = function(data) {
        return hex_encode(data)
    };
    hex.prototype.decode = function(str) {
        return hex_decode(str)
    };
    var base64 = function() {};
    ns.Class(base64, ns.type.Object, [coder]);
    base64.prototype.encode = function(data) {
        return base64_encode(data)
    };
    base64.prototype.decode = function(string) {
        return base64_decode(string)
    };
    var base58 = function() {};
    ns.Class(base58, ns.type.Object, [coder]);
    base58.prototype.encode = function(data) {
        console.assert(false, "Base58 encode not implemented");
        return null
    };
    base58.prototype.decode = function(string) {
        console.assert(false, "Base58 decode not implemented");
        return null
    };
    var Lib = function(coder) {
        this.coder = coder
    };
    ns.Class(Lib, ns.type.Object, [coder]);
    Lib.prototype.encode = function(data) {
        return this.coder.encode(data)
    };
    Lib.prototype.decode = function(string) {
        return this.coder.decode(string)
    };
    ns.format.BaseCoder = coder;
    ns.format.Hex = new Lib(new hex());
    ns.format.Base58 = new Lib(new base58());
    ns.format.Base64 = new Lib(new base64());
    ns.format.register("BaseCoder");
    ns.format.register("Hex");
    ns.format.register("Base58");
    ns.format.register("Base64")
}(DIMP);
! function(ns) {
    var utf8_encode = function(string) {
        var len = string.length;
        var array = new ns.type.Data(len);
        var c, l;
        for (var i = 0; i < len; ++i) {
            c = string.charCodeAt(i);
            if (55296 <= c && c <= 56319) {
                l = string.charCodeAt(++i);
                c = ((c - 55296) << 10) + 65536 + l - 56320
            }
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
                        if (c < 65536) {
                            array.push(224 | ((c >> 12) & 15));
                            array.push(128 | ((c >> 6) & 63));
                            array.push(128 | ((c >> 0) & 63))
                        } else {
                            array.push(240 | ((c >> 18) & 7));
                            array.push(128 | ((c >> 12) & 63));
                            array.push(128 | ((c >> 6) & 63));
                            array.push(128 | ((c >> 0) & 63))
                        }
                    }
                }
            }
        }
        return array.getBytes(false)
    };
    var utf8_decode = function(array) {
        var string = "";
        var len = array.length;
        var c, c2, c3, c4;
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
                    break;
                case 15:
                    c2 = array[++i];
                    c3 = array[++i];
                    c4 = array[++i];
                    c = ((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
                    break
            }
            if (c < 65536) {
                string += String.fromCharCode(c)
            } else {
                c -= 65536;
                string += String.fromCharCode((c >> 10) + 55296);
                string += String.fromCharCode((c & 1023) + 56320)
            }
        }
        return string
    };
    var parser = function() {};
    ns.Interface(parser, null);
    parser.prototype.encode = function(object) {
        console.assert(false, "implement me!");
        return null
    };
    parser.prototype.decode = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    var json = function() {};
    ns.Class(json, ns.type.Object, [parser]);
    json.prototype.encode = function(container) {
        var string = JSON.stringify(container);
        if (!string) {
            throw TypeError("failed to encode JSON object: " + container)
        }
        return ns.format.UTF8.encode(string)
    };
    json.prototype.decode = function(json) {
        var string;
        if (typeof json === "string") {
            string = json
        } else {
            string = ns.format.UTF8.decode(json)
        }
        if (!string) {
            throw TypeError("failed to decode JSON data: " + json)
        }
        return JSON.parse(string)
    };
    var utf8 = function() {};
    ns.Class(utf8, ns.type.Object, [parser]);
    utf8.prototype.encode = utf8_encode;
    utf8.prototype.decode = utf8_decode;
    var Lib = function(parser) {
        this.parser = parser
    };
    ns.Class(Lib, ns.type.Object, [parser]);
    Lib.prototype.encode = function(object) {
        return this.parser.encode(object)
    };
    Lib.prototype.decode = function(data) {
        return this.parser.decode(data)
    };
    ns.format.DataParser = parser;
    ns.format.JSON = new Lib(new json());
    ns.format.UTF8 = new Lib(new utf8());
    ns.format.register("DataParser");
    ns.format.register("JSON");
    ns.format.register("UTF8")
}(DIMP);
! function(ns) {
    var hash = function() {};
    ns.Interface(hash, null);
    hash.prototype.digest = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    var md5 = function() {};
    ns.Class(md5, ns.type.Object, [hash]);
    md5.prototype.digest = function(data) {
        console.assert(false, "MD5 not implemented");
        return null
    };
    var sha256 = function() {};
    ns.Class(sha256, ns.type.Object, [hash]);
    sha256.prototype.digest = function(data) {
        console.assert(false, "SHA256 not implemented");
        return null
    };
    var ripemd160 = function() {};
    ns.Class(ripemd160, ns.type.Object, [hash]);
    ripemd160.prototype.digest = function(data) {
        console.assert(false, "RIPEMD160 not implemented");
        return null
    };
    var Lib = function(hash) {
        this.hash = hash
    };
    ns.Class(Lib, ns.type.Object, [hash]);
    Lib.prototype.digest = function(data) {
        return this.hash.digest(data)
    };
    ns.digest.Hash = hash;
    ns.digest.MD5 = new Lib(new md5());
    ns.digest.SHA256 = new Lib(new sha256());
    ns.digest.RIPEMD160 = new Lib(new ripemd160());
    ns.digest.register("Hash");
    ns.digest.register("MD5");
    ns.digest.register("SHA256");
    ns.digest.register("RIPEMD160")
}(DIMP);
! function(ns) {
    var Dictionary = ns.type.Dictionary;
    var CryptographyKey = function(key) {
        Dictionary.call(this, key)
    };
    ns.Class(CryptographyKey, Dictionary, null);
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
    ns.crypto.CryptographyKey = CryptographyKey
}(DIMP);
! function(ns) {
    var EncryptKey = function() {};
    ns.Interface(EncryptKey, null);
    EncryptKey.prototype.encrypt = function(plaintext) {
        console.assert(false, "implement me!");
        return null
    };
    var DecryptKey = function() {};
    ns.Interface(DecryptKey, null);
    DecryptKey.prototype.decrypt = function(ciphertext) {
        console.assert(false, "implement me!");
        return null
    };
    var SignKey = function() {};
    ns.Interface(SignKey, null);
    SignKey.prototype.sign = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    var VerifyKey = function() {};
    ns.Interface(VerifyKey, null);
    VerifyKey.prototype.verify = function(data, signature) {
        console.assert(false, "implement me!");
        return false
    };
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
    var UTF8 = ns.format.UTF8;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var promise = UTF8.encode("Moky loves May Lee forever!");
    var SymmetricKey = function(key) {
        CryptographyKey.call(this, key)
    };
    ns.Class(SymmetricKey, CryptographyKey, [EncryptKey, DecryptKey]);
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
            if (key instanceof SymmetricKey) {
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
    var AsymmetricKey = function(key) {
        CryptographyKey.call(this, key)
    };
    ns.Class(AsymmetricKey, CryptographyKey, null);
    AsymmetricKey.RSA = "RSA";
    AsymmetricKey.ECC = "ECC";
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.register("AsymmetricKey")
}(DIMP);
! function(ns) {
    var UTF8 = ns.format.UTF8;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var promise = UTF8.encode("Moky loves May Lee forever!");
    var PublicKey = function(key) {
        AsymmetricKey.call(this, key)
    };
    ns.Class(PublicKey, AsymmetricKey, [VerifyKey]);
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
            if (key instanceof PublicKey) {
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
    var PrivateKey = function(key) {
        AsymmetricKey.call(this, key)
    };
    ns.Class(PrivateKey, AsymmetricKey, [SignKey]);
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
            if (key instanceof PrivateKey) {
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
