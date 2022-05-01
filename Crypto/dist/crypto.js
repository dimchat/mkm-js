/**
 * Cryptography JavaScript Library (v0.2.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Apr. 18, 2022
 * @copyright (c) 2022 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MONKEY !== "object") {
    MONKEY = {};
}
(function (ns) {
    var namespacefy = function (space) {
        space.__all__ = [];
        space.registers = namespace.prototype.registers;
        space.exports = namespace.prototype.exports;
        return space;
    };
    var is_space = function (space) {
        if (space instanceof namespace) {
            return true;
        }
        if (typeof space.exports !== "function") {
            return false;
        }
        if (typeof space.registers !== "function") {
            return false;
        }
        return space.__all__ instanceof Array;
    };
    var namespace = function () {
        this.__all__ = [];
    };
    namespace.prototype.registers = function (name) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name);
        }
    };
    namespace.prototype.exports = function (to) {
        var names = this.__all__;
        var name;
        for (var i = 0; i < names.length; ++i) {
            name = names[i];
            export_one(this, to, name);
            to.registers(name);
        }
        return to;
    };
    var export_one = function (from, to, name) {
        var source = from[name];
        var target = to[name];
        if (source === target) {
        } else {
            if (typeof target === "undefined") {
                to[name] = source;
            } else {
                if (is_space(source)) {
                    if (!is_space(target)) {
                        namespacefy(target);
                    }
                    source.exports(target);
                } else {
                    export_all(source, target);
                }
            }
        }
    };
    var export_all = function (from, to) {
        var names = Object.getOwnPropertyNames(from);
        for (var i = 0; i < names.length; ++i) {
            export_one(from, to, names[i]);
        }
    };
    ns.Namespace = namespace;
    namespacefy(ns);
    ns.registers("Namespace");
})(MONKEY);
(function (ns) {
    ns.assert = console.assert;
    if (typeof ns.type !== "object") {
        ns.type = new ns.Namespace();
    }
    if (typeof ns.format !== "object") {
        ns.format = new ns.Namespace();
    }
    if (typeof ns.digest !== "object") {
        ns.digest = new ns.Namespace();
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = new ns.Namespace();
    }
    ns.registers("type");
    ns.registers("format");
    ns.registers("digest");
    ns.registers("crypto");
})(MONKEY);
(function (ns) {
    var conforms = function (object, protocol) {
        if (!object) {
            return false;
        } else {
            if (object instanceof protocol) {
                return true;
            }
        }
        return check_class(object.constructor, protocol);
    };
    var check_class = function (child, protocol) {
        var interfaces = child._mk_interfaces;
        if (!interfaces) {
            return false;
        } else {
            if (check_interfaces(interfaces, protocol)) {
                return true;
            }
        }
        var parent = child._mk_parent;
        return parent && check_class(parent, protocol);
    };
    var check_interfaces = function (interfaces, protocol) {
        var child, parents;
        for (var i = 0; i < interfaces.length; ++i) {
            child = interfaces[i];
            if (child === protocol) {
                return true;
            }
            parents = child._mk_parents;
            if (parents && check_interfaces(parents, protocol)) {
                return true;
            }
        }
        return false;
    };
    var get_interfaces = function (interfaces) {
        if (!interfaces) {
            return [];
        } else {
            if (interfaces instanceof Array) {
                return interfaces;
            } else {
                return [interfaces];
            }
        }
    };
    var set_functions = function (child, functions) {
        if (functions) {
            var names = Object.getOwnPropertyNames(functions);
            var key, fn;
            for (var idx = 0; idx < names.length; ++idx) {
                key = names[idx];
                if (key === "constructor") {
                    continue;
                }
                fn = functions[key];
                if (typeof fn === "function") {
                    child.prototype[key] = fn;
                }
            }
        }
        return child;
    };
    var interfacefy = function (child, parents) {
        if (!child) {
            child = function () {};
        }
        child._mk_parents = get_interfaces(parents);
        return child;
    };
    interfacefy.conforms = conforms;
    var classify = function (child, parent, interfaces, functions) {
        if (!child) {
            child = function () {};
        }
        if (parent) {
            child._mk_parent = parent;
        } else {
            parent = Object;
        }
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        child._mk_interfaces = get_interfaces(interfaces);
        set_functions(child, functions);
        return child;
    };
    ns.Interface = interfacefy;
    ns.Class = classify;
    ns.registers("Interface");
    ns.registers("Class");
})(MONKEY);
(function (ns) {
    var is_null = function (object) {
        if (typeof object === "undefined") {
            return true;
        } else {
            return object === null;
        }
    };
    var is_base_type = function (object) {
        var t = typeof object;
        if (
            t === "string" ||
            t === "number" ||
            t === "boolean" ||
            t === "function"
        ) {
            return true;
        }
        if (object instanceof String) {
            return true;
        }
        if (object instanceof Number) {
            return true;
        }
        if (object instanceof Boolean) {
            return true;
        }
        if (object instanceof Date) {
            return true;
        }
        if (object instanceof RegExp) {
            return true;
        }
        return object instanceof Error;
    };
    var IObject = function () {};
    ns.Interface(IObject, null);
    IObject.prototype.equals = function (other) {
        ns.assert(false, "implement me!");
        return false;
    };
    IObject.prototype.valueOf = function () {
        ns.assert(false, "implement me!");
        return false;
    };
    IObject.isNull = is_null;
    IObject.isBaseType = is_base_type;
    var BaseObject = function () {
        Object.call(this);
    };
    ns.Class(BaseObject, Object, [IObject], {
        equals: function (other) {
            return this === other;
        }
    });
    ns.type.Object = IObject;
    ns.type.BaseObject = BaseObject;
    ns.type.registers("Object");
    ns.type.registers("BaseObject");
})(MONKEY);
(function (ns) {
    var is_array = function (obj) {
        if (obj instanceof Array) {
            return true;
        } else {
            if (obj instanceof Uint8Array) {
                return true;
            } else {
                if (obj instanceof Int8Array) {
                    return true;
                } else {
                    if (obj instanceof Uint8ClampedArray) {
                        return true;
                    } else {
                        if (obj instanceof Uint16Array) {
                            return true;
                        } else {
                            if (obj instanceof Int16Array) {
                                return true;
                            } else {
                                if (obj instanceof Uint32Array) {
                                    return true;
                                } else {
                                    if (obj instanceof Int32Array) {
                                        return true;
                                    } else {
                                        if (obj instanceof Float32Array) {
                                            return true;
                                        } else {
                                            if (obj instanceof Float64Array) {
                                                return true;
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
        return false;
    };
    var arrays_equal = function (array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        for (var i = 0; i < array1.length; ++i) {
            if (!objects_equal(array1[i], array2[i])) {
                return false;
            }
        }
        return true;
    };
    var maps_equal = function (dict1, dict2) {
        var keys1 = Object.keys(dict1);
        var keys2 = Object.keys(dict2);
        var len1 = keys1.length;
        var len2 = keys2.length;
        if (len1 !== len2) {
            return false;
        }
        var k;
        for (var i = 0; i < len1; ++i) {
            k = keys1[i];
            if (keys2.indexOf(k) < 0) {
                return false;
            }
            if (!objects_equal(dict1[k], dict2[k])) {
                return false;
            }
        }
        return true;
    };
    var objects_equal = function (obj1, obj2) {
        if (obj1 === obj2) {
            return true;
        } else {
            if (!obj1) {
                return !obj2;
            } else {
                if (!obj2) {
                    return false;
                } else {
                    if (typeof obj1["equals"] === "function") {
                        return obj1.equals(obj2);
                    } else {
                        if (typeof obj2["equals"] === "function") {
                            return obj2.equals(obj1);
                        } else {
                            if (ns.type.Object.isBaseType(obj1)) {
                                return obj1 === obj2;
                            } else {
                                if (ns.type.Object.isBaseType(obj2)) {
                                    return false;
                                } else {
                                    if (is_array(obj1)) {
                                        return is_array(obj2) && arrays_equal(obj1, obj2);
                                    } else {
                                        if (is_array(obj2)) {
                                            return false;
                                        } else {
                                            return maps_equal(obj1, obj2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    var copy_items = function (src, srcPos, dest, destPos, length) {
        if (srcPos !== 0 || length !== src.length) {
            src = src.subarray(srcPos, srcPos + length);
        }
        dest.set(src, destPos);
    };
    var insert_item = function (array, index, item) {
        if (index < 0) {
            index += array.length + 1;
            if (index < 0) {
                return false;
            }
        }
        if (index === 0) {
            array.unshift(item);
        } else {
            if (index === array.length) {
                array.push(item);
            } else {
                if (index > array.length) {
                    array[index] = item;
                } else {
                    array.splice(index, 0, item);
                }
            }
        }
        return true;
    };
    var update_item = function (array, index, item) {
        if (index < 0) {
            index += array.length;
            if (index < 0) {
                return false;
            }
        }
        array[index] = item;
        return true;
    };
    var remove_item = function (array, item) {
        var index = array.indexOf(item);
        if (index < 0) {
            return false;
        } else {
            if (index === 0) {
                array.shift();
            } else {
                if (index + 1 === array.length) {
                    array.pop();
                } else {
                    array.splice(index, 1);
                }
            }
        }
        return true;
    };
    ns.type.Arrays = {
        insert: insert_item,
        update: update_item,
        remove: remove_item,
        equals: objects_equal,
        isArray: is_array,
        copy: copy_items
    };
    ns.type.registers("Arrays");
})(MONKEY);
(function (ns) {
    var BaseObject = ns.type.BaseObject;
    var enumify = function (enumeration, elements) {
        if (!enumeration) {
            enumeration = function (value, alias) {
                Enum.call(this, value, alias);
            };
        }
        ns.Class(enumeration, Enum, null, null);
        var e, v;
        for (var name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue;
            }
            v = elements[name];
            if (v instanceof Enum) {
                v = v.__value;
            } else {
                if (typeof v !== "number") {
                    throw new TypeError("Enum value must be a number!");
                }
            }
            e = new enumeration(v, name);
            enumeration[name] = e;
        }
        return enumeration;
    };
    var get_alias = function (enumeration, value) {
        var e;
        for (var k in enumeration) {
            if (!enumeration.hasOwnProperty(k)) {
                continue;
            }
            e = enumeration[k];
            if (e instanceof enumeration) {
                if (e.equals(value)) {
                    return e.__alias;
                }
            }
        }
        return null;
    };
    var Enum = function (value, alias) {
        BaseObject.call(this);
        if (!alias) {
            if (value instanceof Enum) {
                alias = value.__alias;
            } else {
                alias = get_alias(this.constructor, value);
            }
        }
        if (value instanceof Enum) {
            value = value.__value;
        }
        this.__value = value;
        this.__alias = alias;
    };
    ns.Class(Enum, BaseObject, null, null);
    Enum.prototype.equals = function (other) {
        if (!other) {
            return !this.__value;
        } else {
            if (other instanceof Enum) {
                return this.__value === other.valueOf();
            } else {
                return this.__value === other;
            }
        }
    };
    Enum.prototype.valueOf = function () {
        return this.__value;
    };
    Enum.prototype.toString = function () {
        return "<" + this.__alias.toString() + ": " + this.__value.toString() + ">";
    };
    ns.type.Enum = enumify;
    ns.type.registers("Enum");
})(MONKEY);
(function (ns) {
    var Stringer = function () {};
    ns.Interface(Stringer, [ns.type.Object]);
    Stringer.prototype.equalsIgnoreCase = function (other) {
        ns.assert(false, "implement me!");
        return false;
    };
    Stringer.prototype.toString = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Stringer.prototype.getLength = function () {
        ns.assert(false, "implement me!");
        return 0;
    };
    ns.type.Stringer = Stringer;
    ns.type.registers("Stringer");
})(MONKEY);
(function (ns) {
    var BaseObject = ns.type.BaseObject;
    var Stringer = ns.type.Stringer;
    var ConstantString = function (str) {
        BaseObject.call(this);
        if (!str) {
            str = "";
        } else {
            if (ns.Interface.conforms(str, Stringer)) {
                str = str.toString();
            }
        }
        this.__string = str;
    };
    ns.Class(ConstantString, BaseObject, [Stringer], null);
    ConstantString.prototype.equals = function (other) {
        if (BaseObject.prototype.equals.call(this, other)) {
            return true;
        } else {
            if (!other) {
                return !this.__string;
            } else {
                if (ns.Interface.conforms(other, Stringer)) {
                    return this.__string === other.toString();
                } else {
                    return this.__string === other;
                }
            }
        }
    };
    ConstantString.prototype.equalsIgnoreCase = function (other) {
        if (this.equals(other)) {
            return true;
        } else {
            if (!other) {
                return !this.__string;
            } else {
                if (ns.Interface.conforms(other, Stringer)) {
                    return equalsIgnoreCase(this.__string, other.toString());
                } else {
                    return equalsIgnoreCase(this.__string, other);
                }
            }
        }
    };
    var equalsIgnoreCase = function (str1, str2) {
        if (str1.length !== str2.length) {
            return false;
        }
        var low1 = str1.toLowerCase();
        var low2 = str2.toLowerCase();
        return low1 === low2;
    };
    ConstantString.prototype.valueOf = function () {
        return this.__string;
    };
    ConstantString.prototype.toString = function () {
        return this.__string;
    };
    ConstantString.prototype.getLength = function () {
        return this.__string.length;
    };
    ns.type.ConstantString = ConstantString;
    ns.type.registers("ConstantString");
})(MONKEY);
(function (ns) {
    var Mapper = function () {};
    ns.Interface(Mapper, [ns.type.Object]);
    Mapper.prototype.getValue = function (key) {
        ns.assert(false, "implement me!");
        return null;
    };
    Mapper.prototype.setValue = function (key, value) {
        ns.assert(false, "implement me!");
    };
    Mapper.prototype.removeValue = function (key) {
        ns.assert(false, "implement me!");
    };
    Mapper.prototype.allKeys = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Mapper.prototype.toMap = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    Mapper.prototype.copyMap = function (deepCopy) {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.type.Mapper = Mapper;
    ns.type.registers("Mapper");
})(MONKEY);
(function (ns) {
    var BaseObject = ns.type.BaseObject;
    var Mapper = ns.type.Mapper;
    var Dictionary = function (dict) {
        BaseObject.call(this);
        if (!dict) {
            dict = {};
        } else {
            if (ns.Interface.conforms(dict, Mapper)) {
                dict = dict.toMap();
            }
        }
        this.__dictionary = dict;
    };
    ns.Class(Dictionary, BaseObject, [Mapper], null);
    Dictionary.prototype.equals = function (other) {
        if (BaseObject.prototype.equals.call(this, other)) {
            return true;
        } else {
            if (!other) {
                return !this.__dictionary;
            } else {
                if (ns.Interface.conforms(other, Mapper)) {
                    return ns.type.Arrays.equals(this.__dictionary, other.toMap());
                } else {
                    return ns.type.Arrays.equals(this.__dictionary, other);
                }
            }
        }
    };
    Dictionary.prototype.valueOf = function () {
        return this.__dictionary;
    };
    Dictionary.prototype.getValue = function (key) {
        return this.__dictionary[key];
    };
    Dictionary.prototype.setValue = function (key, value) {
        if (value) {
            this.__dictionary[key] = value;
        } else {
            if (this.__dictionary.hasOwnProperty(key)) {
                delete this.__dictionary[key];
            }
        }
    };
    Dictionary.prototype.removeValue = function (key) {
        if (this.__dictionary.hasOwnProperty(key)) {
            delete this.__dictionary[key];
        }
    };
    Dictionary.prototype.allKeys = function () {
        return Object.keys(this.__dictionary);
    };
    Dictionary.prototype.toMap = function () {
        return this.__dictionary;
    };
    Dictionary.prototype.copyMap = function (deepCopy) {
        if (deepCopy) {
            return ns.type.Copier.deepCopyMap(this.__dictionary);
        } else {
            return ns.type.Copier.copyMap(this.__dictionary);
        }
    };
    ns.type.Dictionary = Dictionary;
    ns.type.registers("Dictionary");
})(MONKEY);
(function (ns) {
    var IObject = ns.type.Object;
    var Stringer = ns.type.Stringer;
    var Mapper = ns.type.Mapper;
    var fetch_string = function (str) {
        if (ns.Interface.conforms(str, Stringer)) {
            return str.toString();
        } else {
            return str;
        }
    };
    var fetch_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            return dict.toMap();
        } else {
            return dict;
        }
    };
    var unwrap = function (object) {
        if (IObject.isNull(object)) {
            return null;
        } else {
            if (IObject.isBaseType(object)) {
                return object;
            } else {
                if (ns.Interface.conforms(object, Stringer)) {
                    return object.toString();
                } else {
                    if (!ns.type.Arrays.isArray(object)) {
                        return unwrap_map(object);
                    } else {
                        if (object instanceof Array) {
                            return unwrap_list(object);
                        } else {
                            return object;
                        }
                    }
                }
            }
        }
    };
    var unwrap_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            dict = dict.toMap();
        }
        var allKeys = Object.keys(dict);
        var key;
        var naked, value;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            value = dict[key];
            naked = unwrap(value);
            if (naked !== value) {
                dict[key] = naked;
            }
        }
        return dict;
    };
    var unwrap_list = function (array) {
        var naked, item;
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            item = array[i];
            naked = unwrap(item);
            if (naked !== item) {
                array[i] = naked;
            }
        }
        return array;
    };
    ns.type.Wrapper = {
        fetchString: fetch_string,
        fetchMap: fetch_map,
        unwrap: unwrap,
        unwrapMap: unwrap_map,
        unwrapList: unwrap_list
    };
    ns.type.registers("Wrapper");
})(MONKEY);
(function (ns) {
    var IObject = ns.type.Object;
    var Stringer = ns.type.Stringer;
    var Mapper = ns.type.Mapper;
    var copy = function (object) {
        if (IObject.isNull(object)) {
            return null;
        } else {
            if (IObject.isBaseType(object)) {
                return object;
            } else {
                if (ns.Interface.conforms(object, Stringer)) {
                    return object.toString();
                } else {
                    if (!ns.type.Arrays.isArray(object)) {
                        return copy_map(object);
                    } else {
                        if (object instanceof Array) {
                            return copy_list(object);
                        } else {
                            return object;
                        }
                    }
                }
            }
        }
    };
    var copy_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            dict = dict.toMap();
        }
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = dict[key];
        }
        return clone;
    };
    var copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(array[i]);
        }
        return clone;
    };
    var deep_copy = function (object) {
        if (IObject.isNull(object)) {
            return null;
        } else {
            if (IObject.isBaseType(object)) {
                return object;
            } else {
                if (ns.Interface.conforms(object, Stringer)) {
                    return object.toString();
                } else {
                    if (!ns.type.Arrays.isArray(object)) {
                        return deep_copy_map(object);
                    } else {
                        if (object instanceof Array) {
                            return deep_copy_list(object);
                        } else {
                            return object;
                        }
                    }
                }
            }
        }
    };
    var deep_copy_map = function (dict) {
        if (ns.Interface.conforms(dict, Mapper)) {
            dict = dict.toMap();
        }
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = deep_copy(dict[key]);
        }
        return clone;
    };
    var deep_copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(deep_copy(array[i]));
        }
        return clone;
    };
    ns.type.Copier = {
        copy: copy,
        copyMap: copy_map,
        copyList: copy_list,
        deepCopy: deep_copy,
        deepCopyMap: deep_copy_map,
        deepCopyList: deep_copy_list
    };
    ns.type.registers("Copier");
})(MONKEY);
(function (ns) {
    var DataDigester = function () {};
    ns.Interface(DataDigester, null);
    DataDigester.prototype.digest = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.digest.DataDigester = DataDigester;
    ns.digest.registers("DataDigester");
})(MONKEY);
(function (ns) {
    var MD5 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return md5Digester;
        },
        setDigester: function (digester) {
            md5Digester = digester;
        }
    };
    var md5Digester = null;
    ns.digest.MD5 = MD5;
    ns.digest.registers("MD5");
})(MONKEY);
(function (ns) {
    var SHA1 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return sha1Digester;
        },
        setDigester: function (digester) {
            sha1Digester = digester;
        }
    };
    var sha1Digester = null;
    ns.digest.SHA1 = SHA1;
    ns.digest.registers("SHA1");
})(MONKEY);
(function (ns) {
    var SHA256 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return sha256Digester;
        },
        setDigester: function (digester) {
            sha256Digester = digester;
        }
    };
    var sha256Digester = null;
    ns.digest.SHA256 = SHA256;
    ns.digest.registers("SHA256");
})(MONKEY);
(function (ns) {
    var RipeMD160 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return ripemd160Digester;
        },
        setDigester: function (digester) {
            ripemd160Digester = digester;
        }
    };
    var ripemd160Digester = null;
    ns.digest.RIPEMD160 = RipeMD160;
    ns.digest.registers("RIPEMD160");
})(MONKEY);
(function (ns) {
    var Keccak256 = {
        digest: function (data) {
            return this.getDigester().digest(data);
        },
        getDigester: function () {
            return keccak256Digester;
        },
        setDigester: function (digester) {
            keccak256Digester = digester;
        }
    };
    var keccak256Digester = null;
    ns.digest.KECCAK256 = Keccak256;
    ns.digest.registers("KECCAK256");
})(MONKEY);
(function (ns) {
    var DataCoder = function () {};
    ns.Interface(DataCoder, null);
    DataCoder.prototype.encode = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    DataCoder.prototype.decode = function (string) {
        ns.assert(false, "implement me!");
        return null;
    };
    var ObjectCoder = function () {};
    ns.Interface(ObjectCoder, null);
    ObjectCoder.prototype.encode = function (object) {
        ns.assert(false, "implement me!");
        return null;
    };
    ObjectCoder.prototype.decode = function (string) {
        ns.assert(false, "implement me!");
        return null;
    };
    var StringCoder = function () {};
    ns.Interface(StringCoder, null);
    StringCoder.prototype.encode = function (string) {
        ns.assert(false, "implement me!");
        return null;
    };
    StringCoder.prototype.decode = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    ns.format.DataCoder = DataCoder;
    ns.format.ObjectCoder = ObjectCoder;
    ns.format.StringCoder = StringCoder;
    ns.format.registers("DataCoder");
    ns.format.registers("ObjectCoder");
    ns.format.registers("StringCoder");
})(MONKEY);
(function (ns) {
    var DataCoder = ns.format.DataCoder;
    var hex_chars = "0123456789abcdef";
    var hex_values = new Int8Array(128);
    (function (chars, values) {
        for (var i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i;
        }
        values["A".charCodeAt(0)] = 10;
        values["B".charCodeAt(0)] = 11;
        values["C".charCodeAt(0)] = 12;
        values["D".charCodeAt(0)] = 13;
        values["E".charCodeAt(0)] = 14;
        values["F".charCodeAt(0)] = 15;
    })(hex_chars, hex_values);
    var hex_encode = function (data) {
        var len = data.length;
        var str = "";
        var byt;
        for (var i = 0; i < len; ++i) {
            byt = data[i];
            str += hex_chars[byt >> 4];
            str += hex_chars[byt & 15];
        }
        return str;
    };
    var hex_decode = function (string) {
        var len = string.length;
        if (len > 2) {
            if (string[0] === "0") {
                if (string[1] === "x" || string[1] === "X") {
                    string = string.substring(2);
                    len -= 2;
                }
            }
        }
        if (len % 2 === 1) {
            string = "0" + string;
            len += 1;
        }
        var cnt = len >> 1;
        var hi, lo;
        var data = new Uint8Array(cnt);
        for (var i = 0, j = 0; i < cnt; ++i, j += 2) {
            hi = hex_values[string.charCodeAt(j)];
            lo = hex_values[string.charCodeAt(j + 1)];
            data[i] = (hi << 4) | lo;
        }
        return data;
    };
    var HexCoder = function () {
        Object.call(this);
    };
    ns.Class(HexCoder, Object, [DataCoder], {
        encode: function (data) {
            return hex_encode(data);
        },
        decode: function (string) {
            return hex_decode(string);
        }
    });
    var Hex = {
        encode: function (data) {
            return this.getCoder().encode(data);
        },
        decode: function (string) {
            return this.getCoder().decode(string);
        },
        getCoder: function () {
            return hexCoder;
        },
        setCoder: function (coder) {
            hexCoder = coder;
        }
    };
    var hexCoder = new HexCoder();
    ns.format.Hex = Hex;
    ns.format.registers("Hex");
})(MONKEY);
(function (ns) {
    var Base58 = {
        encode: function (data) {
            return this.getCoder().encode(data);
        },
        decode: function (string) {
            return this.getCoder().decode(string);
        },
        getCoder: function () {
            return base58Coder;
        },
        setCoder: function (coder) {
            base58Coder = coder;
        }
    };
    var base58Coder = null;
    ns.format.Base58 = Base58;
    ns.format.registers("Base58");
})(MONKEY);
(function (ns) {
    var Base64 = {
        encode: function (data) {
            return this.getCoder().encode(data);
        },
        decode: function (string) {
            return this.getCoder().decode(string);
        },
        getCoder: function () {
            return base64Coder;
        },
        setCoder: function (coder) {
            base64Coder = coder;
        }
    };
    var base64Coder = null;
    ns.format.Base64 = Base64;
    ns.format.registers("Base64");
})(MONKEY);
(function (ns) {
    var UTF8 = {
        encode: function (string) {
            return this.getCoder().encode(string);
        },
        decode: function (data) {
            return this.getCoder().decode(data);
        },
        getCoder: function () {
            return utf8Coder;
        },
        setCoder: function (coder) {
            utf8Coder = coder;
        }
    };
    var utf8Coder = null;
    ns.format.UTF8 = UTF8;
    ns.format.registers("UTF8");
})(MONKEY);
(function (ns) {
    var ObjectCoder = ns.format.ObjectCoder;
    var JsonCoder = function () {
        Object.call(this);
    };
    ns.Class(JsonCoder, Object, [ObjectCoder], {
        encode: function (object) {
            return JSON.stringify(object);
        },
        decode: function (string) {
            return JSON.parse(string);
        }
    });
    var JsON = {
        encode: function (object) {
            return this.getCoder().encode(object);
        },
        decode: function (string) {
            return this.getCoder().decode(string);
        },
        getCoder: function () {
            return jsonCoder;
        },
        setCoder: function (coder) {
            jsonCoder = coder;
        }
    };
    var jsonCoder = new JsonCoder();
    ns.format.JSON = JsON;
    ns.format.registers("JSON");
})(MONKEY);
(function (ns) {
    var Mapper = ns.type.Mapper;
    var CryptographyKey = function () {};
    ns.Interface(CryptographyKey, [Mapper]);
    CryptographyKey.prototype.getAlgorithm = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    CryptographyKey.prototype.getData = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var EncryptKey = function () {};
    ns.Interface(EncryptKey, [CryptographyKey]);
    EncryptKey.prototype.encrypt = function (plaintext) {
        ns.assert(false, "implement me!");
        return null;
    };
    var DecryptKey = function () {};
    ns.Interface(DecryptKey, [CryptographyKey]);
    DecryptKey.prototype.decrypt = function (ciphertext) {
        ns.assert(false, "implement me!");
        return null;
    };
    DecryptKey.prototype.matches = function (pKey) {
        ns.assert(false, "implement me!");
        return false;
    };
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.registers("CryptographyKey");
    ns.crypto.registers("EncryptKey");
    ns.crypto.registers("DecryptKey");
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = function () {};
    ns.Interface(AsymmetricKey, [CryptographyKey]);
    AsymmetricKey.RSA = "RSA";
    AsymmetricKey.ECC = "ECC";
    var SignKey = function () {};
    ns.Interface(SignKey, [AsymmetricKey]);
    SignKey.prototype.sign = function (data) {
        ns.assert(false, "implement me!");
        return null;
    };
    var VerifyKey = function () {};
    ns.Interface(VerifyKey, [AsymmetricKey]);
    VerifyKey.prototype.verify = function (data, signature) {
        ns.assert(false, "implement me!");
        return false;
    };
    VerifyKey.prototype.matches = function (sKey) {
        ns.assert(false, "implement me!");
        return false;
    };
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;
    ns.crypto.registers("AsymmetricKey");
    ns.crypto.registers("SignKey");
    ns.crypto.registers("VerifyKey");
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    CryptographyKey.getAlgorithm = function (key) {
        return key["algorithm"];
    };
    var promise = "Moky loves May Lee forever!";
    CryptographyKey.getPromise = function () {
        if (typeof promise === "string") {
            promise = ns.format.UTF8.encode(promise);
        }
        return promise;
    };
    AsymmetricKey.matches = function (sKey, pKey) {
        var promise = CryptographyKey.getPromise();
        var signature = sKey.sign(promise);
        return pKey.verify(promise, signature);
    };
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var SymmetricKey = function () {};
    ns.Interface(SymmetricKey, [EncryptKey, DecryptKey]);
    SymmetricKey.AES = "AES";
    SymmetricKey.DES = "DES";
    SymmetricKey.matches = function (pKey, sKey) {
        var promise = CryptographyKey.getPromise();
        var ciphertext = pKey.encrypt(promise);
        var plaintext = sKey.decrypt(ciphertext);
        if (!plaintext || plaintext.length !== promise.length) {
            return false;
        }
        for (var i = 0; i < promise.length; ++i) {
            if (plaintext[i] !== promise[i]) {
                return false;
            }
        }
        return true;
    };
    var SymmetricKeyFactory = function () {};
    ns.Interface(SymmetricKeyFactory, null);
    SymmetricKeyFactory.prototype.generateSymmetricKey = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    SymmetricKeyFactory.prototype.parseSymmetricKey = function (key) {
        ns.assert(false, "implement me!");
        return null;
    };
    SymmetricKey.Factory = SymmetricKeyFactory;
    var s_symmetric_factories = {};
    SymmetricKey.setFactory = function (algorithm, factory) {
        s_symmetric_factories[algorithm] = factory;
    };
    SymmetricKey.getFactory = function (algorithm) {
        return s_symmetric_factories[algorithm];
    };
    SymmetricKey.generate = function (algorithm) {
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            throw new ReferenceError("key algorithm not support: " + algorithm);
        }
        return factory.generateSymmetricKey();
    };
    SymmetricKey.parse = function (key) {
        if (!key) {
            return null;
        } else {
            if (ns.Interface.conforms(key, SymmetricKey)) {
                return key;
            }
        }
        key = ns.type.Wrapper.fetchMap(key);
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            factory = SymmetricKey.getFactory("*");
        }
        return factory.parseSymmetricKey(key);
    };
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.registers("SymmetricKey");
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var PublicKey = function () {};
    ns.Interface(PublicKey, [VerifyKey]);
    PublicKey.RSA = AsymmetricKey.RSA;
    PublicKey.ECC = AsymmetricKey.ECC;
    var PublicKeyFactory = function () {};
    ns.Interface(PublicKeyFactory, null);
    PublicKeyFactory.prototype.parsePublicKey = function (key) {
        ns.assert(false, "implement me!");
        return null;
    };
    PublicKey.Factory = PublicKeyFactory;
    var s_public_factories = {};
    PublicKey.setFactory = function (algorithm, factory) {
        s_public_factories[algorithm] = factory;
    };
    PublicKey.getFactory = function (algorithm) {
        return s_public_factories[algorithm];
    };
    PublicKey.parse = function (key) {
        if (!key) {
            return null;
        } else {
            if (ns.Interface.conforms(key, PublicKey)) {
                return key;
            }
        }
        key = ns.type.Wrapper.fetchMap(key);
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PublicKey.getFactory(algorithm);
        if (!factory) {
            factory = PublicKey.getFactory("*");
        }
        return factory.parsePublicKey(key);
    };
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.registers("PublicKey");
})(MONKEY);
(function (ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = function () {};
    ns.Interface(PrivateKey, [SignKey]);
    PrivateKey.RSA = AsymmetricKey.RSA;
    PrivateKey.ECC = AsymmetricKey.ECC;
    PrivateKey.prototype.getPublicKey = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    var PrivateKeyFactory = function () {};
    ns.Interface(PrivateKeyFactory, null);
    PrivateKeyFactory.prototype.generatePrivateKey = function () {
        ns.assert(false, "implement me!");
        return null;
    };
    PrivateKeyFactory.prototype.parsePrivateKey = function (key) {
        ns.assert(false, "implement me!");
        return null;
    };
    PrivateKey.Factory = PrivateKeyFactory;
    var s_private_factories = {};
    PrivateKey.setFactory = function (algorithm, factory) {
        s_private_factories[algorithm] = factory;
    };
    PrivateKey.getFactory = function (algorithm) {
        return s_private_factories[algorithm];
    };
    PrivateKey.generate = function (algorithm) {
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            throw new ReferenceError("key algorithm not support: " + algorithm);
        }
        return factory.generatePrivateKey();
    };
    PrivateKey.parse = function (key) {
        if (!key) {
            return null;
        } else {
            if (ns.Interface.conforms(key, PrivateKey)) {
                return key;
            }
        }
        key = ns.type.Wrapper.fetchMap(key);
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            factory = PrivateKey.getFactory("*");
        }
        return factory.parsePrivateKey(key);
    };
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.registers("PrivateKey");
})(MONKEY);
