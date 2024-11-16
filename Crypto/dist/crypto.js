/**
 * Cryptography JavaScript Library (v1.0.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Nov. 16, 2024
 * @copyright (c) 2024 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MONKEY !== 'object') {
    MONKEY = {}
}
(function (ns) {
    'use strict';
    if (typeof ns.type !== 'object') {
        ns.type = {}
    }
    if (typeof ns.format !== 'object') {
        ns.format = {}
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = {}
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = {}
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var conforms = function (object, protocol) {
        if (!object) {
            return false
        } else if (object instanceof protocol) {
            return true
        }
        return check_class(object.constructor, protocol)
    };
    var check_class = function (constructor, protocol) {
        var interfaces = constructor._mk_interfaces;
        if (interfaces && check_interfaces(interfaces, protocol)) {
            return true
        }
        var parent = constructor._mk_parent;
        return parent && check_class(parent, protocol)
    };
    var check_interfaces = function (interfaces, protocol) {
        var child, parents;
        for (var i = 0; i < interfaces.length; ++i) {
            child = interfaces[i];
            if (child === protocol) {
                return true
            }
            parents = child._mk_parents;
            if (parents && check_interfaces(parents, protocol)) {
                return true
            }
        }
        return false
    };
    var def_methods = function (clazz, methods) {
        var names = Object.keys(methods);
        var key, fn;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
            fn = methods[key];
            if (typeof fn === 'function') {
                clazz.prototype[key] = fn
            }
        }
        return clazz
    };
    var interfacefy = function (child, parents) {
        if (!child) {
            child = function () {
            }
        }
        if (parents) {
            child._mk_parents = parents
        }
        return child
    };
    interfacefy.conforms = conforms;
    var classify = function (child, parent, interfaces, methods) {
        if (!child) {
            child = function () {
                Object.call(this)
            }
        }
        if (parent) {
            child._mk_parent = parent
        } else {
            parent = Object
        }
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        if (interfaces) {
            child._mk_interfaces = interfaces
        }
        if (methods) {
            def_methods(child, methods)
        }
        return child
    };
    ns.type.Interface = interfacefy;
    ns.type.Class = classify
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var is_null = function (object) {
        if (typeof object === 'undefined') {
            return true
        } else {
            return object === null
        }
    };
    var is_base_type = function (object) {
        var t = typeof object;
        if (t === 'string' || t === 'number' || t === 'boolean' || t === 'function') {
            return true
        }
        if (object instanceof Date) {
            return true
        }
        if (object instanceof RegExp) {
            return true
        }
        return object instanceof Error
    };
    var IObject = Interface(null, null);
    IObject.prototype.toString = function () {
        throw new Error('NotImplemented');
    };
    IObject.prototype.valueOf = function () {
        throw new Error('NotImplemented');
    };
    IObject.prototype.isEmpty = function () {
        throw new Error('NotImplemented');
    };
    IObject.prototype.equals = function (other) {
        throw new Error('NotImplemented');
    };
    IObject.isNull = is_null;
    IObject.isBaseType = is_base_type;
    var BaseObject = function () {
        Object.call(this)
    };
    Class(BaseObject, Object, [IObject], null);
    BaseObject.prototype.equals = function (other) {
        return this === other
    };
    ns.type.Object = IObject;
    ns.type.BaseObject = BaseObject
})(MONKEY);
(function (ns) {
    'use strict';
    var IObject = ns.type.Object;
    var getString = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (value instanceof String) {
            return value
        } else {
            return value.toString()
        }
    };
    var getDateTime = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (value instanceof Date) {
            return value
        }
        var seconds = getFloat(value, 0);
        var millis = seconds * 1000;
        return new Date(millis)
    };
    var getInt = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (value instanceof Number) {
            return value
        } else if (value instanceof Boolean) {
            return value ? 1 : 0
        } else {
            var str = value instanceof String ? value : value.toString();
            return parseInt(str)
        }
    };
    var getFloat = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (value instanceof Number) {
            return value
        } else if (value instanceof Boolean) {
            return value ? 1.0 : 0.0
        } else {
            var str = value instanceof String ? value : value.toString();
            return parseFloat(str)
        }
    };
    var getBoolean = function (value, defaultValue) {
        if (IObject.isNull(value)) {
            return defaultValue
        } else if (value instanceof Boolean) {
            return value
        } else if (value instanceof Number) {
            return value > 0 || value < 0
        }
        var text;
        if (value instanceof String) {
            text = value
        } else {
            text = value.toString()
        }
        text = text.trim();
        var size = text.length;
        if (size === 0) {
            return false
        } else if (size > ns.type.Converter.kMaxBoolLen) {
            return true
        } else {
            text = text.toLowerCase()
        }
        var state = kBoolStates[text];
        return IObject.isNull(state) || state
    };
    var kBoolStates = {
        '1': true,
        'yes': true,
        'true': true,
        'on': true,
        '0': false,
        'no': false,
        'false': false,
        'off': false,
        '+0': false,
        '-0': false,
        '+0.0': false,
        '-0.0': false,
        'none': false,
        'null': false,
        'undefined': false
    };
    var kMaxBoolLen = 'undefined'.length;
    ns.type.Converter = {
        getString: getString,
        getDateTime: getDateTime,
        getInt: getInt,
        getFloat: getFloat,
        getBoolean: getBoolean,
        kBoolStates: kBoolStates,
        kMaxBoolLen: kMaxBoolLen
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var IObject = ns.type.Object;
    var is_array = function (obj) {
        if (obj instanceof Array) {
            return true
        } else if (obj instanceof Uint8Array) {
            return true
        } else if (obj instanceof Int8Array) {
            return true
        } else if (obj instanceof Uint8ClampedArray) {
            return true
        } else if (obj instanceof Uint16Array) {
            return true
        } else if (obj instanceof Int16Array) {
            return true
        } else if (obj instanceof Uint32Array) {
            return true
        } else if (obj instanceof Int32Array) {
            return true
        } else if (obj instanceof Float32Array) {
            return true
        } else if (obj instanceof Float64Array) {
            return true
        }
        return false
    };
    var arrays_equal = function (array1, array2) {
        if (array1.length !== array2.length) {
            return false
        }
        for (var i = 0; i < array1.length; ++i) {
            if (!objects_equal(array1[i], array2[i])) {
                return false
            }
        }
        return true
    };
    var maps_equal = function (dict1, dict2) {
        var keys1 = Object.keys(dict1);
        var keys2 = Object.keys(dict2);
        var len1 = keys1.length;
        var len2 = keys2.length;
        if (len1 !== len2) {
            return false
        }
        var k;
        for (var i = 0; i < len1; ++i) {
            k = keys1[i];
            if (keys2.indexOf(k) < 0) {
                return false
            }
            if (!objects_equal(dict1[k], dict2[k])) {
                return false
            }
        }
        return true
    };
    var objects_equal = function (obj1, obj2) {
        if (obj1 === obj2) {
            return true
        } else if (!obj1) {
            return !obj2
        } else if (!obj2) {
            return false
        } else if (typeof obj1['equals'] === 'function') {
            return obj1.equals(obj2)
        } else if (typeof obj2['equals'] === 'function') {
            return obj2.equals(obj1)
        } else if (IObject.isBaseType(obj1)) {
            return obj1 === obj2
        } else if (IObject.isBaseType(obj2)) {
            return false
        } else if (is_array(obj1)) {
            return is_array(obj2) && arrays_equal(obj1, obj2)
        } else if (is_array(obj2)) {
            return false
        } else {
            return maps_equal(obj1, obj2)
        }
    };
    var copy_items = function (src, srcPos, dest, destPos, length) {
        if (srcPos !== 0 || length !== src.length) {
            src = src.subarray(srcPos, srcPos + length)
        }
        dest.set(src, destPos)
    };
    var insert_item = function (array, index, item) {
        if (index < 0) {
            index += array.length + 1;
            if (index < 0) {
                return false
            }
        }
        if (index === 0) {
            array.unshift(item)
        } else if (index === array.length) {
            array.push(item)
        } else if (index > array.length) {
            array[index] = item
        } else {
            array.splice(index, 0, item)
        }
        return true
    };
    var update_item = function (array, index, item) {
        if (index < 0) {
            index += array.length;
            if (index < 0) {
                return false
            }
        }
        array[index] = item;
        return true
    };
    var remove_item = function (array, item) {
        var index = array.indexOf(item);
        if (index < 0) {
            return false
        } else if (index === 0) {
            array.shift()
        } else if ((index + 1) === array.length) {
            array.pop()
        } else {
            array.splice(index, 1)
        }
        return true
    };
    ns.type.Arrays = {
        insert: insert_item,
        update: update_item,
        remove: remove_item,
        equals: objects_equal,
        isArray: is_array,
        copy: copy_items
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var Class = ns.type.Class;
    var BaseObject = ns.type.BaseObject;
    var is_enum = function (obj) {
        return obj instanceof Enum
    };
    var get_alias = function (enumeration, value) {
        var keys = Object.keys(enumeration);
        var e;
        for (var k in keys) {
            e = enumeration[k];
            if (e instanceof Enum && e.equals(value)) {
                return e.__alias
            }
        }
        return null
    };
    var Enum = function (value, alias) {
        BaseObject.call(this);
        if (!alias) {
            alias = get_alias(this, value)
        }
        this.__value = value;
        this.__alias = alias
    };
    Class(Enum, BaseObject, null, null);
    Enum.prototype.equals = function (other) {
        if (!other) {
            return !this.__value
        } else if (other instanceof Enum) {
            return this.__value === other.valueOf()
        } else {
            return this.__value === other
        }
    };
    Enum.prototype.valueOf = function () {
        return this.__value
    };
    Enum.prototype.toString = function () {
        return '<' + this.__alias.toString() + ': ' + this.__value.toString() + '>'
    };
    var enumify = function (enumeration, elements) {
        if (!enumeration) {
            enumeration = function (value, alias) {
                Enum.call(this, value, alias)
            }
        }
        Class(enumeration, Enum, null, null);
        var keys = Object.keys(elements);
        var alias, value;
        for (var i = 0; i < keys.length; ++i) {
            alias = keys[i];
            value = elements[alias];
            if (value instanceof Enum) {
                value = value.valueOf()
            } else if (typeof value !== 'number') {
                throw new TypeError('Enum value must be a number!');
            }
            enumeration[alias] = new enumeration(value, alias)
        }
        return enumeration
    };
    enumify.isEnum = is_enum;
    ns.type.Enum = enumify
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var Stringer = Interface(null, [IObject]);
    Stringer.prototype.getLength = function () {
        throw new Error('NotImplemented');
    };
    Stringer.prototype.equalsIgnoreCase = function (other) {
        throw new Error('NotImplemented');
    };
    var ConstantString = function (str) {
        BaseObject.call(this);
        if (!str) {
            str = ''
        } else if (Interface.conforms(str, Stringer)) {
            str = str.toString()
        }
        this.__string = str
    };
    Class(ConstantString, BaseObject, [Stringer], null);
    ConstantString.prototype.equals = function (other) {
        if (this === other) {
            return true
        } else if (!other) {
            return !this.__string
        } else if (Interface.conforms(other, Stringer)) {
            return this.__string === other.toString()
        } else {
            return this.__string === other
        }
    };
    ConstantString.prototype.valueOf = function () {
        return this.__string
    };
    ConstantString.prototype.toString = function () {
        return this.__string
    };
    ConstantString.prototype.getLength = function () {
        return this.__string.length
    };
    ConstantString.prototype.isEmpty = function () {
        return this.__string.length === 0
    };
    ConstantString.prototype.equalsIgnoreCase = function (other) {
        if (this === other) {
            return true
        } else if (!other) {
            return !this.__string
        } else if (Interface.conforms(other, Stringer)) {
            return equalsIgnoreCase(this.__string, other.toString())
        } else {
            return equalsIgnoreCase(this.__string, other)
        }
    };
    var equalsIgnoreCase = function (str1, str2) {
        if (str1.length !== str2.length) {
            return false
        }
        var low1 = str1.toLowerCase();
        var low2 = str2.toLowerCase();
        return low1 === low2
    };
    ns.type.Stringer = Stringer;
    ns.type.ConstantString = ConstantString
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var BaseObject = ns.type.BaseObject;
    var Converter = ns.type.Converter;
    var arrays_equals = function (a1, a2) {
        return ns.type.Arrays.equals(a1, a2)
    };
    var copy_map = function (map, deep) {
        if (deep) {
            return ns.type.Copier.deepCopyMap(map)
        } else {
            return ns.type.Copier.copyMap(map)
        }
    };
    var json_encode = function (dict) {
        return ns.format.JSON.encode(dict)
    };
    var Mapper = Interface(null, [IObject]);
    Mapper.prototype.toMap = function () {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.copyMap = function (deepCopy) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.allKeys = function () {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.getLength = function () {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.getValue = function (key) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.setValue = function (key, value) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.removeValue = function (key) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.getString = function (key, defaultValue) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.getBoolean = function (key, defaultValue) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.getInt = function (key, defaultValue) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.getFloat = function (key, defaultValue) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.getDateTime = function (key, defaultValue) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.setDateTime = function (key, time) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.setString = function (key, stringer) {
        throw new Error('NotImplemented');
    };
    Mapper.prototype.setMap = function (key, mapper) {
        throw new Error('NotImplemented');
    };
    var Dictionary = function (dict) {
        BaseObject.call(this);
        if (!dict) {
            dict = {}
        } else if (Interface.conforms(dict, Mapper)) {
            dict = dict.toMap()
        }
        this.__dictionary = dict
    };
    Class(Dictionary, BaseObject, [Mapper], null);
    Dictionary.prototype.equals = function (other) {
        if (this === other) {
            return true
        } else if (!other) {
            return !this.__dictionary
        } else if (Interface.conforms(other, Mapper)) {
            return arrays_equals(this.__dictionary, other.toMap())
        } else {
            return arrays_equals(this.__dictionary, other)
        }
    };
    Dictionary.prototype.getLength = function () {
        var keys = Object.keys(this.__dictionary);
        return keys.length
    };
    Dictionary.prototype.isEmpty = function () {
        var keys = Object.keys(this.__dictionary);
        return keys.length === 0
    };
    Dictionary.prototype.valueOf = function () {
        return this.__dictionary
    };
    Dictionary.prototype.toString = function () {
        return json_encode(this.__dictionary)
    };
    Dictionary.prototype.toMap = function () {
        return this.__dictionary
    };
    Dictionary.prototype.copyMap = function (deepCopy) {
        return copy_map(this.__dictionary, deepCopy)
    };
    Dictionary.prototype.allKeys = function () {
        return Object.keys(this.__dictionary)
    };
    Dictionary.prototype.getValue = function (key) {
        return this.__dictionary[key]
    };
    Dictionary.prototype.setValue = function (key, value) {
        if (value) {
            this.__dictionary[key] = value
        } else if (this.__dictionary.hasOwnProperty(key)) {
            delete this.__dictionary[key]
        }
    };
    Dictionary.prototype.removeValue = function (key) {
        var value;
        if (this.__dictionary.hasOwnProperty(key)) {
            value = this.__dictionary[key];
            delete this.__dictionary[key]
        } else {
            value = null
        }
        return value
    };
    Dictionary.prototype.getString = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getString(value, defaultValue)
    };
    Dictionary.prototype.getBoolean = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getBoolean(value, defaultValue)
    };
    Dictionary.prototype.getInt = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getInt(value, defaultValue)
    };
    Dictionary.prototype.getFloat = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getFloat(value, defaultValue)
    };
    Dictionary.prototype.getDateTime = function (key, defaultValue) {
        var value = this.__dictionary[key];
        return Converter.getDateTime(value, defaultValue)
    };
    Dictionary.prototype.setDateTime = function (key, time) {
        if (!time) {
            this.removeValue(key)
        } else if (time instanceof Date) {
            time = time.getTime() / 1000.0;
            this.__dictionary[key] = time
        } else {
            time = Converter.getFloat(time, 0);
            this.__dictionary[key] = time
        }
    };
    Dictionary.prototype.setString = function (key, string) {
        if (!string) {
            this.removeValue(key)
        } else {
            this.__dictionary[key] = string.toString()
        }
    };
    Dictionary.prototype.setMap = function (key, map) {
        if (!map) {
            this.removeValue(key)
        } else {
            this.__dictionary[key] = map.toMap()
        }
    };
    ns.type.Mapper = Mapper;
    ns.type.Dictionary = Dictionary
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var Enum = ns.type.Enum;
    var Stringer = ns.type.Stringer;
    var Arrays = ns.type.Arrays;
    var Mapper = ns.type.Mapper;
    var fetch_string = function (str) {
        if (Interface.conforms(str, Stringer)) {
            return str.toString()
        } else {
            return str
        }
    };
    var fetch_map = function (dict) {
        if (Interface.conforms(dict, Mapper)) {
            return dict.toMap()
        } else {
            return dict
        }
    };
    var unwrap = function (object) {
        if (IObject.isNull(object)) {
            return null
        } else if (IObject.isBaseType(object)) {
            return object
        } else if (Enum.isEnum(object)) {
            return object.valueOf()
        } else if (Interface.conforms(object, Stringer)) {
            return object.toString()
        } else if (Interface.conforms(object, Mapper)) {
            return unwrap_map(object.toMap())
        } else if (!Arrays.isArray(object)) {
            return unwrap_map(object)
        } else if (object instanceof Array) {
            return unwrap_list(object)
        } else {
            return object
        }
    };
    var unwrap_map = function (dict) {
        var result = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            result[key] = unwrap(dict[key])
        }
        return result
    };
    var unwrap_list = function (array) {
        var result = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            result[i] = unwrap(array[i])
        }
        return result
    };
    ns.type.Wrapper = {
        fetchString: fetch_string,
        fetchMap: fetch_map,
        unwrap: unwrap,
        unwrapMap: unwrap_map,
        unwrapList: unwrap_list
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var IObject = ns.type.Object;
    var Enum = ns.type.Enum;
    var Stringer = ns.type.Stringer;
    var Arrays = ns.type.Arrays;
    var Mapper = ns.type.Mapper;
    var copy = function (object) {
        if (IObject.isNull(object)) {
            return null
        } else if (IObject.isBaseType(object)) {
            return object
        } else if (Enum.isEnum(object)) {
            return object.valueOf()
        } else if (Interface.conforms(object, Stringer)) {
            return object.toString()
        } else if (Interface.conforms(object, Mapper)) {
            return copy_map(object.toMap())
        } else if (!Arrays.isArray(object)) {
            return copy_map(object)
        } else if (object instanceof Array) {
            return copy_list(object)
        } else {
            return object
        }
    };
    var copy_map = function (dict) {
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = dict[key]
        }
        return clone
    };
    var copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(array[i])
        }
        return clone
    };
    var deep_copy = function (object) {
        if (IObject.isNull(object)) {
            return null
        } else if (IObject.isBaseType(object)) {
            return object
        } else if (Enum.isEnum(object)) {
            return object.valueOf()
        } else if (Interface.conforms(object, Stringer)) {
            return object.toString()
        } else if (Interface.conforms(object, Mapper)) {
            return deep_copy_map(object.toMap())
        } else if (!Arrays.isArray(object)) {
            return deep_copy_map(object)
        } else if (object instanceof Array) {
            return deep_copy_list(object)
        } else {
            return object
        }
    };
    var deep_copy_map = function (dict) {
        var clone = {};
        var allKeys = Object.keys(dict);
        var key;
        var count = allKeys.length;
        for (var i = 0; i < count; ++i) {
            key = allKeys[i];
            clone[key] = deep_copy(dict[key])
        }
        return clone
    };
    var deep_copy_list = function (array) {
        var clone = [];
        var count = array.length;
        for (var i = 0; i < count; ++i) {
            clone.push(deep_copy(array[i]))
        }
        return clone
    };
    ns.type.Copier = {
        copy: copy,
        copyMap: copy_map,
        copyList: copy_list,
        deepCopy: deep_copy,
        deepCopyMap: deep_copy_map,
        deepCopyList: deep_copy_list
    }
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var DataDigester = Interface(null, null);
    DataDigester.prototype.digest = function (data) {
        throw new Error('NotImplemented');
    };
    ns.digest.DataDigester = DataDigester
})(MONKEY);
(function (ns) {
    'use strict';
    var MD5 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return md5Digester
        }, setDigester: function (digester) {
            md5Digester = digester
        }
    };
    var md5Digester = null;
    ns.digest.MD5 = MD5
})(MONKEY);
(function (ns) {
    'use strict';
    var SHA1 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return sha1Digester
        }, setDigester: function (digester) {
            sha1Digester = digester
        }
    };
    var sha1Digester = null;
    ns.digest.SHA1 = SHA1
})(MONKEY);
(function (ns) {
    'use strict';
    var SHA256 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return sha256Digester
        }, setDigester: function (digester) {
            sha256Digester = digester
        }
    };
    var sha256Digester = null;
    ns.digest.SHA256 = SHA256
})(MONKEY);
(function (ns) {
    'use strict';
    var RipeMD160 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return ripemd160Digester
        }, setDigester: function (digester) {
            ripemd160Digester = digester
        }
    };
    var ripemd160Digester = null;
    ns.digest.RIPEMD160 = RipeMD160
})(MONKEY);
(function (ns) {
    'use strict';
    var Keccak256 = {
        digest: function (data) {
            return this.getDigester().digest(data)
        }, getDigester: function () {
            return keccak256Digester
        }, setDigester: function (digester) {
            keccak256Digester = digester
        }
    };
    var keccak256Digester = null;
    ns.digest.KECCAK256 = Keccak256
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var DataCoder = Interface(null, null);
    DataCoder.prototype.encode = function (data) {
        throw new Error('NotImplemented');
    };
    DataCoder.prototype.decode = function (string) {
        throw new Error('NotImplemented');
    };
    var ObjectCoder = Interface(null, null);
    ObjectCoder.prototype.encode = function (object) {
        throw new Error('NotImplemented');
    };
    ObjectCoder.prototype.decode = function (string) {
        throw new Error('NotImplemented');
    };
    var StringCoder = Interface(null, null);
    StringCoder.prototype.encode = function (string) {
        throw new Error('NotImplemented');
    };
    StringCoder.prototype.decode = function (data) {
        throw new Error('NotImplemented');
    };
    ns.format.DataCoder = DataCoder;
    ns.format.ObjectCoder = ObjectCoder;
    ns.format.StringCoder = StringCoder
})(MONKEY);
(function (ns) {
    'use strict';
    var Hex = {
        encode: function (data) {
            return this.getCoder().encode(data)
        }, decode: function (string) {
            return this.getCoder().decode(string)
        }, getCoder: function () {
            return hexCoder
        }, setCoder: function (coder) {
            hexCoder = coder
        }
    };
    var hexCoder = null;
    ns.format.Hex = Hex
})(MONKEY);
(function (ns) {
    'use strict';
    var Base58 = {
        encode: function (data) {
            return this.getCoder().encode(data)
        }, decode: function (string) {
            return this.getCoder().decode(string)
        }, getCoder: function () {
            return base58Coder
        }, setCoder: function (coder) {
            base58Coder = coder
        }
    };
    var base58Coder = null;
    ns.format.Base58 = Base58
})(MONKEY);
(function (ns) {
    'use strict';
    var Base64 = {
        encode: function (data) {
            return this.getCoder().encode(data)
        }, decode: function (string) {
            return this.getCoder().decode(string)
        }, getCoder: function () {
            return base64Coder
        }, setCoder: function (coder) {
            base64Coder = coder
        }
    };
    var base64Coder = null;
    ns.format.Base64 = Base64
})(MONKEY);
(function (ns) {
    'use strict';
    var UTF8 = {
        encode: function (string) {
            return this.getCoder().encode(string)
        }, decode: function (data) {
            return this.getCoder().decode(data)
        }, getCoder: function () {
            return utf8Coder
        }, setCoder: function (coder) {
            utf8Coder = coder
        }
    };
    var utf8Coder = null;
    ns.format.UTF8 = UTF8
})(MONKEY);
(function (ns) {
    'use strict';
    var JsON = {
        encode: function (object) {
            return this.getCoder().encode(object)
        }, decode: function (string) {
            return this.getCoder().decode(string)
        }, getCoder: function () {
            return jsonCoder
        }, setCoder: function (coder) {
            jsonCoder = coder
        }
    };
    var jsonCoder = null;
    ns.format.JSON = JsON
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var TransportableData = Interface(null, [Mapper]);
    TransportableData.DEFAULT = 'base64';
    TransportableData.BASE64 = 'base64';
    TransportableData.BASE58 = 'base58';
    TransportableData.HEX = 'hex';
    TransportableData.prototype.getAlgorithm = function () {
        throw new Error('NotImplemented');
    };
    TransportableData.prototype.getData = function () {
        throw new Error('NotImplemented');
    };
    TransportableData.prototype.toString = function () {
        throw new Error('NotImplemented');
    };
    TransportableData.prototype.toObject = function () {
        throw new Error('NotImplemented');
    };
    TransportableData.encode = function (data) {
        var ted = TransportableData.create(data);
        return ted.toObject()
    };
    TransportableData.decode = function (encoded) {
        var ted = TransportableData.parse(encoded);
        if (!ted) {
            return null
        }
        return ted.getData()
    };
    var general_factory = function () {
        var man = ns.format.FormatFactoryManager;
        return man.generalFactory
    };
    TransportableData.create = function (data, algorithm) {
        if (!algorithm) {
            algorithm = TransportableData.DEFAULT
        }
        var gf = general_factory();
        return gf.createTransportableData(algorithm, data)
    };
    TransportableData.parse = function (ted) {
        var gf = general_factory();
        return gf.parseTransportableData(ted)
    };
    TransportableData.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        return gf.setTransportableDataFactory(algorithm, factory)
    };
    TransportableData.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getTransportableDataFactory(algorithm)
    };
    var TransportableDataFactory = Interface(null, null);
    TransportableDataFactory.prototype.createTransportableData = function (data) {
        throw new Error('NotImplemented');
    };
    TransportableDataFactory.prototype.parseTransportableData = function (ted) {
        throw new Error('NotImplemented');
    };
    TransportableData.Factory = TransportableDataFactory;
    ns.format.TransportableData = TransportableData;
    ns.format.TransportableDataFactory = TransportableDataFactory
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var TransportableData = ns.format.TransportableData;
    var PortableNetworkFile = Interface(null, [Mapper]);
    PortableNetworkFile.prototype.setData = function (fileData) {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.prototype.getData = function () {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.prototype.setFilename = function (filename) {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.prototype.getFilename = function () {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.prototype.setURL = function (url) {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.prototype.getURL = function () {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.prototype.setPassword = function (key) {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.prototype.getPassword = function () {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.prototype.toString = function () {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.prototype.toObject = function () {
        throw new Error('NotImplemented');
    };
    var general_factory = function () {
        var man = ns.format.FormatFactoryManager;
        return man.generalFactory
    };
    PortableNetworkFile.createFromURL = function (url, password) {
        return PortableNetworkFile.create(null, null, url, password)
    };
    PortableNetworkFile.createFromData = function (data, filename) {
        var ted = TransportableData.create(data);
        return PortableNetworkFile.create(ted, filename, null, null)
    };
    PortableNetworkFile.create = function (ted, filename, url, password) {
        var gf = general_factory();
        return gf.createPortableNetworkFile(ted, filename, url, password)
    };
    PortableNetworkFile.parse = function (pnf) {
        var gf = general_factory();
        return gf.parsePortableNetworkFile(pnf)
    };
    PortableNetworkFile.setFactory = function (factory) {
        var gf = general_factory();
        return gf.setPortableNetworkFileFactory(factory)
    };
    PortableNetworkFile.getFactory = function () {
        var gf = general_factory();
        return gf.getPortableNetworkFileFactory()
    };
    var PortableNetworkFileFactory = Interface(null, null);
    PortableNetworkFileFactory.prototype.createPortableNetworkFile = function (ted, filename, url, password) {
        throw new Error('NotImplemented');
    };
    PortableNetworkFileFactory.prototype.parsePortableNetworkFile = function (pnf) {
        throw new Error('NotImplemented');
    };
    PortableNetworkFile.Factory = PortableNetworkFileFactory;
    ns.format.PortableNetworkFile = PortableNetworkFile;
    ns.format.PortableNetworkFileFactory = PortableNetworkFileFactory
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Mapper = ns.type.Mapper;
    var Stringer = ns.type.Stringer;
    var Converter = ns.type.Converter
    var TransportableData = ns.format.TransportableData;
    var PortableNetworkFile = ns.format.PortableNetworkFile;
    var split = function (text) {
        var pos1 = text.indexOf('://');
        if (pos1 > 0) {
            return [text]
        } else {
            pos1 = text.indexOf(':') + 1
        }
        var array = [];
        var pos2 = text.indexOf(';', pos1);
        if (pos2 > pos1) {
            array.push(text.substring(pos1, pos2));
            pos1 = pos2 + 1
        }
        pos2 = text.indexOf(',', pos1);
        if (pos2 > pos1) {
            array.unshift(text.substring(pos1, pos2));
            pos1 = pos2 + 1
        }
        if (pos1 === 0) {
            array.unshift(text)
        } else {
            array.unshift(text.substring(pos1))
        }
        return array
    };
    var decode = function (data, defaultKey) {
        var text;
        if (Interface.conforms(data, Mapper)) {
            return data.toMap()
        } else if (Interface.conforms(data, Stringer)) {
            text = data.toString()
        } else if (data instanceof String) {
            text = data
        } else {
            return data
        }
        if (text.length === 0) {
            return null
        } else if (text.charAt(0) === '{' && text.charAt(text.length - 1) === '}') {
            ns.type.JSON.decode(text)
        }
        var info = {};
        var array = split(text);
        var size = array.length;
        if (size === 1) {
            info[defaultKey] = array[0]
        } else {
            info['data'] = array[0];
            info['algorithm'] = array[1];
            if (size > 2) {
                info['content-type'] = array[2];
                if (text.length > 5 && text.substring(0, 5) === 'data:') {
                    info['URL'] = text
                }
            }
        }
        return info
    };
    var GeneralFactory = function () {
        this.__tedFactories = {};
        this.__pnfFactory = null
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.getDataAlgorithm = function (ted, defaultValue) {
        return Converter.getString(ted['algorithm'], defaultValue)
    };
    GeneralFactory.prototype.setTransportableDataFactory = function (algorithm, factory) {
        this.__tedFactories[algorithm] = factory
    };
    GeneralFactory.prototype.getTransportableDataFactory = function (algorithm) {
        return this.__tedFactories[algorithm]
    };
    GeneralFactory.prototype.createTransportableData = function (algorithm, data) {
        var factory = this.getTransportableDataFactory(algorithm);
        return factory.createTransportableData(data)
    };
    GeneralFactory.prototype.parseTransportableData = function (ted) {
        if (!ted) {
            return null
        } else if (Interface.conforms(ted, TransportableData)) {
            return ted
        }
        var info = decode(ted, 'data');
        if (!info) {
            return null
        }
        var algorithm = this.getDataAlgorithm(ted, '*');
        var factory = this.getTransportableDataFactory(algorithm);
        if (!factory) {
            factory = this.getTransportableDataFactory('*')
        }
        return factory.parseTransportableData(ted)
    };
    GeneralFactory.prototype.setPortableNetworkFileFactory = function (factory) {
        this.__pnfFactory = factory
    };
    GeneralFactory.prototype.getPortableNetworkFileFactory = function () {
        return this.__pnfFactory
    };
    GeneralFactory.prototype.createPortableNetworkFile = function (ted, filename, url, password) {
        var factory = this.getPortableNetworkFileFactory();
        return factory.createPortableNetworkFile(ted, filename, url, password)
    };
    GeneralFactory.prototype.parsePortableNetworkFile = function (pnf) {
        if (!pnf) {
            return null
        } else if (Interface.conforms(pnf, PortableNetworkFile)) {
            return pnf
        }
        var info = decode(pnf, 'URL');
        if (!info) {
            return null
        }
        var factory = this.getPortableNetworkFileFactory();
        return factory.parsePortableNetworkFile(pnf)
    };
    var FactoryManager = {generalFactory: new GeneralFactory()};
    ns.format.FormatGeneralFactory = GeneralFactory;
    ns.format.FormatFactoryManager = FactoryManager
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;
    var CryptographyKey = Interface(null, [Mapper]);
    CryptographyKey.prototype.getAlgorithm = function () {
        throw new Error('NotImplemented');
    };
    CryptographyKey.prototype.getData = function () {
        throw new Error('NotImplemented');
    };
    var EncryptKey = Interface(null, [CryptographyKey]);
    EncryptKey.prototype.encrypt = function (plaintext, extra) {
        throw new Error('NotImplemented');
    };
    var DecryptKey = Interface(null, [CryptographyKey]);
    DecryptKey.prototype.decrypt = function (ciphertext, params) {
        throw new Error('NotImplemented');
    };
    DecryptKey.prototype.matchEncryptKey = function (pKey) {
        throw new Error('NotImplemented');
    };
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = Interface(null, [CryptographyKey]);
    AsymmetricKey.RSA = 'RSA';
    AsymmetricKey.ECC = 'ECC';
    var SignKey = Interface(null, [AsymmetricKey]);
    SignKey.prototype.sign = function (data) {
        throw new Error('NotImplemented');
    };
    var VerifyKey = Interface(null, [AsymmetricKey]);
    VerifyKey.prototype.verify = function (data, signature) {
        throw new Error('NotImplemented');
    };
    VerifyKey.prototype.matchSignKey = function (sKey) {
        throw new Error('NotImplemented');
    };
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var SymmetricKey = Interface(null, [EncryptKey, DecryptKey]);
    SymmetricKey.AES = 'AES';
    SymmetricKey.DES = 'DES';
    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory
    };
    SymmetricKey.generate = function (algorithm) {
        var gf = general_factory();
        return gf.generateSymmetricKey(algorithm)
    };
    SymmetricKey.parse = function (key) {
        var gf = general_factory();
        return gf.parseSymmetricKey(key)
    };
    SymmetricKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setSymmetricKeyFactory(algorithm, factory)
    };
    SymmetricKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getSymmetricKeyFactory(algorithm)
    };
    var SymmetricKeyFactory = Interface(null, null);
    SymmetricKeyFactory.prototype.generateSymmetricKey = function () {
        throw new Error('NotImplemented');
    };
    SymmetricKeyFactory.prototype.parseSymmetricKey = function (key) {
        throw new Error('NotImplemented');
    };
    SymmetricKey.Factory = SymmetricKeyFactory;
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.SymmetricKeyFactory = SymmetricKeyFactory
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var PublicKey = Interface(null, [VerifyKey]);
    PublicKey.RSA = AsymmetricKey.RSA;
    PublicKey.ECC = AsymmetricKey.ECC;
    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory
    };
    PublicKey.parse = function (key) {
        var gf = general_factory();
        return gf.parsePublicKey(key)
    };
    PublicKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setPublicKeyFactory(algorithm, factory)
    };
    PublicKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getPublicKeyFactory(algorithm)
    };
    var PublicKeyFactory = Interface(null, null);
    PublicKeyFactory.prototype.parsePublicKey = function (key) {
        throw new Error('NotImplemented');
    };
    PublicKey.Factory = PublicKeyFactory;
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.PublicKeyFactory = PublicKeyFactory
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = Interface(null, [SignKey]);
    PrivateKey.RSA = AsymmetricKey.RSA;
    PrivateKey.ECC = AsymmetricKey.ECC;
    PrivateKey.prototype.getPublicKey = function () {
        throw new Error('NotImplemented');
    };
    var general_factory = function () {
        var man = ns.crypto.CryptographyKeyFactoryManager;
        return man.generalFactory
    };
    PrivateKey.generate = function (algorithm) {
        var gf = general_factory();
        return gf.generatePrivateKey(algorithm)
    };
    PrivateKey.parse = function (key) {
        var gf = general_factory();
        return gf.parsePrivateKey(key)
    };
    PrivateKey.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        gf.setPrivateKeyFactory(algorithm, factory)
    };
    PrivateKey.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getPrivateKeyFactory(algorithm)
    };
    var PrivateKeyFactory = Interface(null, null);
    PrivateKeyFactory.prototype.generatePrivateKey = function () {
        throw new Error('NotImplemented');
    };
    PrivateKeyFactory.prototype.parsePrivateKey = function (key) {
        throw new Error('NotImplemented');
    };
    PrivateKey.Factory = PrivateKeyFactory;
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.PrivateKeyFactory = PrivateKeyFactory
})(MONKEY);
(function (ns) {
    'use strict';
    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var Wrapper = ns.type.Wrapper;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PublicKey = ns.crypto.PublicKey;
    var promise = 'Moky loves May Lee forever!';
    var get_promise = function () {
        if (typeof promise === 'string') {
            promise = ns.format.UTF8.encode(promise)
        }
        return promise
    };
    var GeneralFactory = function () {
        this.__symmetricKeyFactories = {};
        this.__publicKeyFactories = {};
        this.__privateKeyFactories = {}
    };
    Class(GeneralFactory, null, null, null);
    GeneralFactory.prototype.matchSignKey = function (sKey, pKey) {
        var data = get_promise();
        var signature = sKey.sign(data);
        return pKey.verify(data, signature)
    };
    GeneralFactory.prototype.matchEncryptKey = function (pKey, sKey) {
        var data = get_promise();
        var extra_params = {};
        var ciphertext = pKey.encrypt(data, extra_params);
        var plaintext = sKey.decrypt(ciphertext, extra_params);
        if (!plaintext || plaintext.length !== data.length) {
            return false
        }
        for (var i = 0; i < data.length; ++i) {
            if (plaintext[i] !== data[i]) {
                return false
            }
        }
        return true
    };
    GeneralFactory.prototype.getAlgorithm = function (key) {
        return key['algorithm']
    };
    GeneralFactory.prototype.setSymmetricKeyFactory = function (algorithm, factory) {
        this.__symmetricKeyFactories[algorithm] = factory
    };
    GeneralFactory.prototype.getSymmetricKeyFactory = function (algorithm) {
        return this.__symmetricKeyFactories[algorithm]
    };
    GeneralFactory.prototype.generateSymmetricKey = function (algorithm) {
        var factory = this.getSymmetricKeyFactory(algorithm);
        return factory.generateSymmetricKey()
    };
    GeneralFactory.prototype.parseSymmetricKey = function (key) {
        if (!key) {
            return null
        } else if (Interface.conforms(key, SymmetricKey)) {
            return key
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info);
        var factory = this.getSymmetricKeyFactory(algorithm);
        if (!factory) {
            factory = this.getSymmetricKeyFactory('*')
        }
        return factory.parseSymmetricKey(info)
    };
    GeneralFactory.prototype.setPrivateKeyFactory = function (algorithm, factory) {
        this.__privateKeyFactories[algorithm] = factory
    };
    GeneralFactory.prototype.getPrivateKeyFactory = function (algorithm) {
        return this.__privateKeyFactories[algorithm]
    };
    GeneralFactory.prototype.generatePrivateKey = function (algorithm) {
        var factory = this.getPrivateKeyFactory(algorithm);
        return factory.generatePrivateKey()
    };
    GeneralFactory.prototype.parsePrivateKey = function (key) {
        if (!key) {
            return null
        } else if (Interface.conforms(key, PrivateKey)) {
            return key
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info);
        var factory = this.getPrivateKeyFactory(algorithm);
        if (!factory) {
            factory = this.getPrivateKeyFactory('*')
        }
        return factory.parsePrivateKey(info)
    };
    GeneralFactory.prototype.setPublicKeyFactory = function (algorithm, factory) {
        this.__publicKeyFactories[algorithm] = factory
    };
    GeneralFactory.prototype.getPublicKeyFactory = function (algorithm) {
        return this.__publicKeyFactories[algorithm]
    };
    GeneralFactory.prototype.parsePublicKey = function (key) {
        if (!key) {
            return null
        } else if (Interface.conforms(key, PublicKey)) {
            return key
        }
        var info = Wrapper.fetchMap(key);
        var algorithm = this.getAlgorithm(info);
        var factory = this.getPublicKeyFactory(algorithm);
        if (!factory) {
            factory = this.getPublicKeyFactory('*')
        }
        return factory.parsePublicKey(info)
    };
    var FactoryManager = {generalFactory: new GeneralFactory()};
    ns.crypto.CryptographyKeyGeneralFactory = GeneralFactory;
    ns.crypto.CryptographyKeyFactoryManager = FactoryManager
})(MONKEY);
