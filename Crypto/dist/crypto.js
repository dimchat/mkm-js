/**
 * Cryptography JavaScript Library (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      June. 1, 2021
 * @copyright (c) 2021 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof DIMP !== "object") {
    DIMP = {}
}
(function(ns) {
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
})(DIMP);
(function(ns) {
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
})(DIMP);
(function(ns) {
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
        var key;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
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
})(DIMP);
(function(ns) {
    var is_null = function(object) {
        if (typeof object === "undefined") {
            return true
        } else {
            return object === null
        }
    };
    var is_base_type = function(object) {
        var t = typeof object;
        if (t === "string" || t === "number" || t === "boolean" || t === "function") {
            return true
        }
        if (object instanceof String) {
            return true
        }
        if (object instanceof Number) {
            return true
        }
        if (object instanceof Boolean) {
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
    var obj = function() {};
    ns.Class(obj, Object, null);
    obj.isNull = is_null;
    obj.isBaseType = is_base_type;
    obj.prototype.equals = function(other) {
        return this === other
    };
    ns.type.Object = obj;
    ns.type.register("Object")
})(DIMP);
(function(ns) {
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
    var arrays_equal = function(array1, array2) {
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
    var maps_equal = function(dict1, dict2) {
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
            if (!objects_equal(dict1[k], dict2[k])) {
                return false
            }
        }
        return true
    };
    var objects_equal = function(obj1, obj2) {
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
                return arrays_equal(obj1, obj2)
            } else {
                return false
            }
        } else {
            if (is_array(obj2)) {
                return false
            }
        }
        return maps_equal(obj1, obj2)
    };
    var copy_items = function(src, srcPos, dest, destPos, length) {
        if (srcPos !== 0 || length !== src.length) {
            src = src.subarray(srcPos, srcPos + length)
        }
        dest.set(src, destPos)
    };
    var insert_item = function(array, index, item) {
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
    };
    var update_item = function(array, index, item) {
        if (index < 0) {
            index += array.length;
            if (index < 0) {
                return false
            }
        }
        array[index] = item;
        return true
    };
    var remove_item = function(array, item) {
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
    };
    ns.type.Arrays = {
        insert: insert_item,
        update: update_item,
        remove: remove_item,
        equals: objects_equal,
        isArray: is_array,
        copy: copy_items
    };
    ns.type.register("Arrays")
})(DIMP);
(function(ns) {
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
})(DIMP);
(function(ns) {
    var Arrays = ns.type.Arrays;
    var bytes = function() {
        ns.type.Object.call(this);
        this.buffer = null;
        this.offset = 0;
        this.length = 0;
        if (arguments.length === 0) {
            this.buffer = new Uint8Array(4)
        } else {
            if (arguments.length === 1) {
                var arg = arguments[0];
                if (typeof arg === "number") {
                    this.buffer = new Uint8Array(arg)
                } else {
                    if (arg instanceof bytes) {
                        this.buffer = arg.buffer;
                        this.offset = arg.buffer;
                        this.length = arg.length
                    } else {
                        if (arg instanceof Uint8Array) {
                            this.buffer = arg
                        } else {
                            this.buffer = new Uint8Array(arg)
                        }
                        this.length = arg.length
                    }
                }
            } else {
                if (arguments.length === 3) {
                    this.buffer = arguments[0];
                    this.offset = arguments[1];
                    this.length = arguments[2]
                } else {
                    throw SyntaxError("arguments error: " + arguments)
                }
            }
        }
    };
    ns.Class(bytes, ns.type.Object, null);
    bytes.ZERO = new bytes(new Uint8Array(0), 0, 0);
    bytes.prototype.equals = function(other) {
        if (!other || other.length === 0) {
            return this.length === 0
        } else {
            if (this === other) {
                return true
            }
        }
        var otherBuffer, otherOffset, otherLength;
        if (other instanceof bytes) {
            otherBuffer = other.buffer;
            otherOffset = other.offset;
            otherLength = other.length
        } else {
            otherBuffer = other;
            otherOffset = 0;
            otherLength = other.length
        }
        if (this.length !== otherLength) {
            return false
        } else {
            if (this.buffer === otherBuffer && this.offset === otherOffset) {
                return true
            }
        }
        var buffer = this.buffer;
        var pos1 = this.offset + this.length - 1;
        var pos2 = otherOffset + otherLength - 1;
        for (; pos2 >= otherOffset; --pos1, --pos2) {
            if (buffer[pos1] !== otherBuffer[pos2]) {
                return false
            }
        }
        return true
    };
    var adjust = function(pos, len) {
        if (pos < 0) {
            pos += len;
            if (pos < 0) {
                return 0
            }
        } else {
            if (pos > len) {
                return len
            }
        }
        return pos
    };
    bytes.adjust = adjust;
    var find_value = function(value, start, end) {
        start += this.offset;
        end += this.offset;
        for (; start < end; ++start) {
            if (this.buffer[start] === value) {
                return start - this.offset
            }
        }
        return -1
    };
    var find_sub = function(sub, start, end) {
        if ((end - start) < sub.length) {
            return -1
        }
        start += this.offset;
        end += this.offset - sub.length + 1;
        if (this.buffer === sub.buffer) {
            if (start === sub.offset) {
                return start - this.offset
            }
        }
        var index;
        for (; start < end; ++start) {
            for (index = 0; index < sub.length; ++index) {
                if (this.buffer[start + index] !== sub.buffer[sub.offset + index]) {
                    break
                }
            }
            if (index === sub.length) {
                return start - this.offset
            }
        }
        return -1
    };
    bytes.prototype.find = function() {
        var sub, start, end;
        if (arguments.length === 1) {
            sub = arguments[0];
            start = 0;
            end = this.length
        } else {
            if (arguments.length === 2) {
                sub = arguments[0];
                start = arguments[1];
                end = this.length;
                start = adjust(start, this.length)
            } else {
                if (arguments.length === 3) {
                    sub = arguments[0];
                    start = arguments[1];
                    end = arguments[2];
                    start = adjust(start, this.length);
                    end = adjust(end, this.length)
                } else {
                    throw SyntaxError("arguments error: " + arguments)
                }
            }
        }
        if (typeof sub === "number") {
            return find_value.call(this, sub & 255, start, end)
        } else {
            if (sub instanceof bytes) {
                return find_sub.call(this, sub, start, end)
            } else {
                return find_sub.call(this, new bytes(sub), start, end)
            }
        }
    };
    bytes.prototype.getByte = function(index) {
        if (index < 0) {
            index += this.length;
            if (index < 0) {
                throw RangeError("error index: " + (index - this.length) + ", length: " + this.length)
            }
        } else {
            if (index >= this.length) {
                throw RangeError("error index: " + index + ", length: " + this.length)
            }
        }
        return this.buffer[this.offset + index]
    };
    var get_bytes = function(start, end) {
        start += this.offset;
        end += this.offset;
        if (start === 0 && end === this.buffer.length) {
            return this.buffer
        } else {
            if (start < end) {
                return this.buffer.subarray(start, end)
            } else {
                return this.ZERO.getBytes()
            }
        }
    };
    bytes.prototype.getBytes = function() {
        var start, end;
        if (arguments.length === 0) {
            start = 0;
            end = this.length
        } else {
            if (arguments.length === 1) {
                start = arguments[0];
                end = this.length;
                start = adjust(start, this.length)
            } else {
                if (arguments.length === 2) {
                    start = arguments[0];
                    end = arguments[1];
                    start = adjust(start, this.length);
                    end = adjust(end, this.length)
                } else {
                    throw SyntaxError("arguments error: " + arguments)
                }
            }
        }
        return get_bytes.call(this, start, end)
    };
    bytes.prototype.slice = function(start) {
        var end;
        if (arguments.length === 2) {
            end = arguments[1];
            end = adjust(end, this.length)
        } else {
            end = this.length
        }
        start = adjust(start, this.length);
        return slice(this, start, end)
    };
    var slice = function(data, start, end) {
        if (start === 0 && end === data.length) {
            return data
        } else {
            if (start < end) {
                return new bytes(data.buffer, data.offset + start, end - start)
            } else {
                return bytes.ZERO
            }
        }
    };
    bytes.prototype.concat = function() {
        var result = this;
        var arg, other;
        for (var i = 0; i < arguments.length; ++i) {
            arg = arguments[i];
            if (arg instanceof bytes) {
                other = arg
            } else {
                other = new bytes(arg)
            }
            result = concat(result, other)
        }
        return result
    };
    var concat = function(left, right) {
        if (left.length === 0) {
            return right
        } else {
            if (right.length === 0) {
                return left
            } else {
                if (left.buffer === right.buffer && (left.offset + left.length) === right.offset) {
                    return new bytes(left.buffer, left.offset, left.length + right.length)
                } else {
                    var joined = new Uint8Array(left.length + right.length);
                    Arrays.copy(left.buffer, left.offset, joined, 0, left.length);
                    Arrays.copy(right.buffer, right.offset, joined, left.length, right.length);
                    return new bytes(joined, 0, joined.length)
                }
            }
        }
    };
    bytes.prototype.copy = function() {
        return new bytes(this.buffer, this.offset, this.length)
    };
    bytes.prototype.mutableCopy = function() {
        var buffer = this.getBytes();
        buffer = new Uint8Array(buffer);
        return new bytes(buffer, 0, buffer.length)
    };
    bytes.prototype.toArray = function() {
        var array = this.getBytes();
        if (typeof Array.from === "function") {
            return Array.from(array)
        } else {
            return [].slice.call(array)
        }
    };
    ns.type.Data = bytes;
    ns.type.register("Data")
})(DIMP);
(function(ns) {
    var Arrays = ns.type.Arrays;
    var bytes = ns.type.Data;
    var adjust = bytes.adjust;
    var resize = function(size) {
        var bigger = new Uint8Array(size);
        Arrays.copy(this.buffer, this.offset, bigger, 0, this.length);
        this.buffer = bigger;
        this.offset = 0
    };
    var expand = function() {
        var capacity = this.buffer.length - this.offset;
        if (capacity > 4) {
            resize.call(this, capacity << 1)
        } else {
            resize.call(this, 8)
        }
    };
    bytes.prototype.setByte = function(index, value) {
        if (index < 0) {
            index += this.length;
            if (index < 0) {
                return false
            }
        }
        if (index >= this.length) {
            if (this.offset + index >= this.buffer.length) {
                if (index < this.buffer.length) {
                    Arrays.copy(this.buffer, this.offset, this.buffer, 0, this.length);
                    this.offset = 0
                } else {
                    resize.call(this, index + 1)
                }
            }
            this.length = index + 1
        }
        this.buffer[this.offset + index] = value & 255;
        return true
    };
    var copy_buffer = function(data, pos, source, start, end) {
        var copyLen = end - start;
        if (copyLen > 0) {
            var copyEnd = pos + copyLen;
            if (source !== data.buffer || (data.offset + pos) !== start) {
                if (data.offset + copyEnd > data.buffer.length) {
                    resize.call(data, copyEnd)
                }
                Arrays.copy(source, start, data.buffer, data.offset + pos, copyLen)
            }
            if (copyEnd > data.length) {
                data.length = copyEnd
            }
        }
    };
    bytes.prototype.fill = function(pos, source) {
        if (pos < 0) {
            pos += this.length;
            if (pos < 0) {
                throw RangeError("error position: " + (pos - this.length) + ", length: " + this.length)
            }
        }
        var start, end;
        if (arguments.length === 4) {
            start = arguments[2];
            end = arguments[3];
            start = adjust(start, source.length);
            end = adjust(end, source.length)
        } else {
            if (arguments.length === 3) {
                start = arguments[2];
                end = source.length;
                start = adjust(start, source.length)
            } else {
                start = 0;
                end = source.length
            }
        }
        if (source instanceof bytes) {
            copy_buffer(this, pos, source.buffer, source.offset + start, source.offset + end)
        } else {
            copy_buffer(this, pos, source, start, end)
        }
    };
    bytes.prototype.append = function(source) {
        if (arguments.length > 1 && typeof arguments[1] !== "number") {
            for (var i = 0; i < arguments.length; ++i) {
                this.append(arguments[i])
            }
            return
        }
        var start, end;
        if (arguments.length === 3) {
            start = arguments[1];
            end = arguments[2];
            start = adjust(start, source.length);
            end = adjust(end, source.length)
        } else {
            if (arguments.length === 2) {
                start = arguments[1];
                end = source.length;
                start = adjust(start, source.length)
            } else {
                start = 0;
                end = source.length
            }
        }
        if (source instanceof bytes) {
            copy_buffer(this, this.length, source.buffer, source.offset + start, source.offset + end)
        } else {
            copy_buffer(this, this.length, source, start, end)
        }
    };
    bytes.prototype.insert = function(index, value) {
        if (index < 0) {
            index += this.length;
            if (index < 0) {
                return false
            }
        }
        if (index >= this.length) {
            return this.setByte(index, value)
        }
        if (index === 0) {
            if (this.offset > 0) {
                this.offset -= 1
            } else {
                if (this.length === this.buffer.length) {
                    expand.call(this)
                }
                Arrays.copy(this.buffer, 0, this.buffer, 1, this.length)
            }
        } else {
            if (index < (this.length >> 1)) {
                if (this.offset > 0) {
                    Arrays.copy(this.buffer, this.offset, this.buffer, this.offset - 1, index);
                    this.offset -= 1
                } else {
                    if ((this.offset + this.length) === this.buffer.length) {
                        expand.call(this)
                    }
                    Arrays.copy(this.buffer, this.offset + index, this.buffer, this.offset + index + 1, this.length - index)
                }
            } else {
                if ((this.offset + this.length) < this.buffer.length) {
                    Arrays.copy(this.buffer, this.offset + index, this.buffer, this.offset + index + 1, this.length - index)
                } else {
                    if (this.offset > 0) {
                        Arrays.copy(this.buffer, this.offset, this.buffer, this.offset - 1, index);
                        this.offset -= 1
                    } else {
                        expand.call(this);
                        Arrays.copy(this.buffer, this.offset + index, this.buffer, this.offset + index + 1, this.length - index)
                    }
                }
            }
        }
        this.buffer[this.offset + index] = value & 255;
        this.length += 1;
        return true
    };
    bytes.prototype.remove = function(index) {
        if (index < 0) {
            index += this.length;
            if (index < 0) {
                throw RangeError("error index: " + (index - this.length) + ", length: " + this.length)
            }
        } else {
            if (index >= this.length) {
                throw RangeError("index error: " + index + ", length: " + this.length)
            }
        }
        if (index === 0) {
            return this.shift()
        } else {
            if (index === (this.length - 1)) {
                return this.pop()
            }
        }
        var erased = this.buffer[this.offset + index];
        if (index < (this.length >> 1)) {
            Arrays.copy(this.buffer, this.offset, this.buffer, this.offset + 1, index)
        } else {
            Arrays.copy(this.buffer, this.offset + index + 1, this.buffer, this.offset + index, this.length - index - 1)
        }
        return erased
    };
    bytes.prototype.shift = function() {
        if (this.length < 1) {
            throw RangeError("data empty!")
        }
        var erased = this.buffer[this.offset];
        this.offset += 1;
        this.length -= 1;
        return erased
    };
    bytes.prototype.pop = function() {
        if (this.length < 1) {
            throw RangeError("data empty!")
        }
        this.length -= 1;
        return this.buffer[this.offset + this.length]
    };
    bytes.prototype.push = function(element) {
        this.setByte(this.length, element)
    };
    ns.type.MutableData = bytes;
    ns.type.register("MutableData")
})(DIMP);
(function(ns) {
    var str = function(value) {
        if (!value) {
            value = ""
        } else {
            if (value instanceof str) {
                value = value.toString()
            }
        }
        ns.type.Object.call(this);
        this.string = value
    };
    ns.Class(str, ns.type.Object, null);
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
    str.prototype.getLength = function() {
        return this.string.length
    };
    ns.type.String = str;
    ns.type.register("String")
})(DIMP);
(function(ns) {
    var map = function() {};
    ns.Interface(map, null);
    map.prototype.getMap = function() {
        console.assert(false, "implement me!");
        return null
    };
    map.prototype.copyMap = function() {
        console.assert(false, "implement me!");
        return null
    };
    map.copyMap = function(dictionary) {
        if (dictionary instanceof map) {
            dictionary = dictionary.getMap()
        }
        var json = ns.format.JSON.encode(dictionary);
        return ns.format.JSON.decode(json)
    };
    map.prototype.equals = function(other) {
        console.assert(false, "implement me!");
        return false
    };
    map.prototype.allKeys = function() {
        console.assert(false, "implement me!");
        return null
    };
    map.prototype.getValue = function(key) {
        console.assert(false, "implement me!");
        return null
    };
    map.prototype.setValue = function(key, value) {
        console.assert(false, "implement me!")
    };
    ns.type.Map = map;
    ns.type.register("Map")
})(DIMP);
(function(ns) {
    var Arrays = ns.type.Arrays;
    var map = ns.type.Map;
    var dict = function(dictionary) {
        if (!dictionary) {
            dictionary = {}
        } else {
            if (dictionary instanceof map) {
                dictionary = dictionary.getMap()
            }
        }
        ns.type.Object.call(this);
        this.dictionary = dictionary
    };
    ns.Class(dict, ns.type.Object, [map]);
    dict.prototype.getMap = function() {
        return this.dictionary
    };
    dict.prototype.copyMap = function() {
        return map.copyMap(this.dictionary)
    };
    dict.prototype.valueOf = function() {
        return this.dictionary
    };
    dict.prototype.equals = function(other) {
        if (!other) {
            return !this.dictionary
        } else {
            if (other instanceof map) {
                return Arrays.equals(this.dictionary, other.getMap())
            } else {
                return Arrays.equals(this.dictionary, other)
            }
        }
    };
    dict.prototype.allKeys = function() {
        return Object.keys(this.dictionary)
    };
    dict.prototype.getValue = function(key) {
        return this.dictionary[key]
    };
    dict.prototype.setValue = function(key, value) {
        if (value) {
            this.dictionary[key] = value
        } else {
            if (this.dictionary.hasOwnProperty(key)) {
                delete this.dictionary[key]
            }
        }
    };
    ns.type.Dictionary = dict;
    ns.type.register("Dictionary")
})(DIMP);
(function(ns) {
    var obj = ns.type.Object;
    var str = ns.type.String;
    var map = ns.type.Map;
    var Enum = ns.type.Enum;
    var Data = ns.type.Data;
    var Arrays = ns.type.Arrays;
    var map_unwrap = function(dict) {
        var result = {};
        var keys = Object.keys(dict);
        var key;
        for (var i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key instanceof str) {
                key = key.toString()
            }
            result[key] = unwrap(dict[key], true)
        }
        return result
    };
    var list_unwrap = function(array) {
        var result = [];
        var item;
        for (var i = 0; i < array.length; ++i) {
            item = array[i];
            if (item) {
                item = unwrap(item, true);
                if (item) {
                    result[i] = item
                }
            }
        }
        return result
    };
    var unwrap = function(object, circularly) {
        if (obj.isNull(object)) {
            return null
        } else {
            if (obj.isBaseType(object)) {
                return object
            }
        }
        if (object instanceof str) {
            return object.toString()
        }
        if (object instanceof Enum) {
            return object.valueOf()
        }
        if (object instanceof Data) {
            return object.getBytes()
        }
        if (circularly) {
            if (Arrays.isArray(object)) {
                if (object instanceof Array) {
                    return list_unwrap(object)
                }
            } else {
                if (object instanceof map) {
                    object = object.getMap()
                }
                return map_unwrap(object)
            }
        } else {
            if (object instanceof map) {
                object = object.getMap()
            }
        }
        return object
    };
    var wrapper = function() {};
    ns.Interface(wrapper, null);
    wrapper.unwrap = unwrap;
    ns.type.Wrapper = wrapper;
    ns.type.register("Wrapper")
})(DIMP);
(function(ns) {
    var hash = function() {};
    ns.Interface(hash, null);
    hash.prototype.digest = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    var lib = function(hash) {
        this.hash = hash
    };
    ns.Class(lib, ns.type.Object, [hash]);
    lib.prototype.digest = function(data) {
        return this.hash.digest(data)
    };
    ns.digest.Hash = hash;
    ns.digest.HashLib = lib;
    ns.digest.register("Hash");
    ns.digest.register("HashLib")
})(DIMP);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var md5 = function() {};
    ns.Class(md5, ns.type.Object, [Hash]);
    md5.prototype.digest = function(data) {
        console.assert(false, "MD5 not implemented");
        return null
    };
    ns.digest.MD5 = new Lib(new md5());
    ns.digest.register("MD5")
})(DIMP);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var sha1 = function() {};
    ns.Class(sha1, ns.type.Object, [Hash]);
    sha1.prototype.digest = function(data) {
        console.assert(false, "SHA1 not implemented");
        return null
    };
    ns.digest.SHA1 = new Lib(new sha1());
    ns.digest.register("SHA1")
})(DIMP);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var sha256 = function() {};
    ns.Class(sha256, ns.type.Object, [Hash]);
    sha256.prototype.digest = function(data) {
        console.assert(false, "SHA256 not implemented");
        return null
    };
    ns.digest.SHA256 = new Lib(new sha256());
    ns.digest.register("SHA256")
})(DIMP);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var ripemd160 = function() {};
    ns.Class(ripemd160, ns.type.Object, [Hash]);
    ripemd160.prototype.digest = function(data) {
        console.assert(false, "RIPEMD160 not implemented");
        return null
    };
    ns.digest.RIPEMD160 = new Lib(new ripemd160());
    ns.digest.register("RIPEMD160")
})(DIMP);
(function(ns) {
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var keccak256 = function() {};
    ns.Class(keccak256, ns.type.Object, [Hash]);
    keccak256.prototype.digest = function(data) {
        console.assert(false, "KECCAK256 not implemented");
        return null
    };
    ns.digest.KECCAK256 = new Lib(new keccak256());
    ns.digest.register("KECCAK256")
})(DIMP);
(function(ns) {
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
    var lib = function(coder) {
        this.coder = coder
    };
    ns.Class(lib, ns.type.Object, [coder]);
    lib.prototype.encode = function(data) {
        return this.coder.encode(data)
    };
    lib.prototype.decode = function(string) {
        return this.coder.decode(string)
    };
    ns.format.BaseCoder = coder;
    ns.format.CoderLib = lib;
    ns.format.register("BaseCoder");
    ns.format.register("CoderLib")
})(DIMP);
(function(ns) {
    var Data = ns.type.Data;
    var Coder = ns.format.BaseCoder;
    var Lib = ns.format.CoderLib;
    var hex_chars = "0123456789abcdef";
    var hex_values = new Int8Array(128);
    (function(chars, values) {
        for (var i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i
        }
        values["A".charCodeAt(0)] = 10;
        values["B".charCodeAt(0)] = 11;
        values["C".charCodeAt(0)] = 12;
        values["D".charCodeAt(0)] = 13;
        values["E".charCodeAt(0)] = 14;
        values["F".charCodeAt(0)] = 15
    })(hex_chars, hex_values);
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
        return data.getBytes()
    };
    var hex = function() {};
    ns.Class(hex, ns.type.Object, [Coder]);
    hex.prototype.encode = function(data) {
        return hex_encode(data)
    };
    hex.prototype.decode = function(str) {
        return hex_decode(str)
    };
    ns.format.Hex = new Lib(new hex());
    ns.format.register("Hex")
})(DIMP);
(function(ns) {
    var Coder = ns.format.BaseCoder;
    var Lib = ns.format.CoderLib;
    var base58 = function() {};
    ns.Class(base58, ns.type.Object, [Coder]);
    base58.prototype.encode = function(data) {
        console.assert(false, "Base58 encode not implemented");
        return null
    };
    base58.prototype.decode = function(string) {
        console.assert(false, "Base58 decode not implemented");
        return null
    };
    ns.format.Base58 = new Lib(new base58());
    ns.format.register("Base58")
})(DIMP);
(function(ns) {
    var Data = ns.type.Data;
    var Coder = ns.format.BaseCoder;
    var Lib = ns.format.CoderLib;
    var base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64_values = new Int8Array(128);
    (function(chars, values) {
        for (var i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i
        }
    })(base64_chars, base64_values);
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
    var base64 = function() {};
    ns.Class(base64, ns.type.Object, [Coder]);
    base64.prototype.encode = function(data) {
        return base64_encode(data)
    };
    base64.prototype.decode = function(string) {
        return base64_decode(string)
    };
    ns.format.Base64 = new Lib(new base64());
    ns.format.register("Base64")
})(DIMP);
(function(ns) {
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
    var lib = function(parser) {
        this.parser = parser
    };
    ns.Class(lib, ns.type.Object, [parser]);
    lib.prototype.encode = function(object) {
        return this.parser.encode(object)
    };
    lib.prototype.decode = function(data) {
        return this.parser.decode(data)
    };
    ns.format.DataParser = parser;
    ns.format.ParserLib = lib;
    ns.format.register("DataParser");
    ns.format.register("ParserLib")
})(DIMP);
(function(ns) {
    var Data = ns.type.Data;
    var Parser = ns.format.DataParser;
    var Lib = ns.format.ParserLib;
    var utf8_encode = function(string) {
        var len = string.length;
        var array = new Data(len);
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
        return array.getBytes()
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
    var utf8 = function() {};
    ns.Class(utf8, ns.type.Object, [Parser]);
    utf8.prototype.encode = utf8_encode;
    utf8.prototype.decode = utf8_decode;
    ns.format.UTF8 = new Lib(new utf8());
    ns.format.register("UTF8")
})(DIMP);
(function(ns) {
    var Parser = ns.format.DataParser;
    var Lib = ns.format.ParserLib;
    var json = function() {};
    ns.Class(json, ns.type.Object, [Parser]);
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
    ns.format.JSON = new Lib(new json());
    ns.format.register("JSON")
})(DIMP);
(function(ns) {
    var map = ns.type.Map;
    var CryptographyKey = function() {};
    ns.Interface(CryptographyKey, [map]);
    CryptographyKey.prototype.getAlgorithm = function() {
        console.assert(false, "implement me!");
        return null
    };
    CryptographyKey.getAlgorithm = function(key) {
        return key["algorithm"]
    };
    CryptographyKey.prototype.getData = function() {
        console.assert(false, "implement me!");
        return null
    };
    CryptographyKey.promise = ns.format.UTF8.encode("Moky loves May Lee forever!");
    CryptographyKey.matches = function(pKey, sKey) {
        var promise = CryptographyKey.promise;
        var ciphertext = pKey.encrypt(promise);
        var plaintext = sKey.decrypt(ciphertext);
        if (!plaintext || plaintext.length !== promise.length) {
            return false
        }
        for (var i = 0; i < promise.length; ++i) {
            if (plaintext[i] !== promise[i]) {
                return false
            }
        }
        return true
    };
    ns.crypto.CryptographyKey = CryptographyKey;
    ns.crypto.register("CryptographyKey")
})(DIMP);
(function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var EncryptKey = function() {};
    ns.Interface(EncryptKey, [CryptographyKey]);
    EncryptKey.prototype.encrypt = function(plaintext) {
        console.assert(false, "implement me!");
        return null
    };
    var DecryptKey = function() {};
    ns.Interface(DecryptKey, [CryptographyKey]);
    DecryptKey.prototype.decrypt = function(ciphertext) {
        console.assert(false, "implement me!");
        return null
    };
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.register("EncryptKey");
    ns.crypto.register("DecryptKey")
})(DIMP);
(function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var SymmetricKey = function() {};
    ns.Interface(SymmetricKey, [EncryptKey, DecryptKey]);
    SymmetricKey.AES = "AES";
    SymmetricKey.DES = "DES";
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.register("SymmetricKey")
})(DIMP);
(function(ns) {
    var map = ns.type.Map;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var SymmetricKey = ns.crypto.SymmetricKey;
    var SymmetricKeyFactory = function() {};
    ns.Interface(SymmetricKeyFactory, null);
    SymmetricKeyFactory.prototype.generateSymmetricKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    SymmetricKeyFactory.prototype.parseSymmetricKey = function(key) {
        console.assert(false, "implement me!");
        return null
    };
    SymmetricKey.Factory = SymmetricKeyFactory;
    var s_factories = {};
    SymmetricKey.register = function(algorithm, factory) {
        s_factories[algorithm] = factory
    };
    SymmetricKey.getFactory = function(algorithm) {
        return s_factories[algorithm]
    };
    SymmetricKey.generate = function(algorithm) {
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            throw ReferenceError("key algorithm not support: " + algorithm)
        }
        return factory.generateSymmetricKey()
    };
    SymmetricKey.parse = function(key) {
        if (!key) {
            return null
        } else {
            if (key instanceof SymmetricKey) {
                return key
            } else {
                if (key instanceof map) {
                    key = key.getMap()
                }
            }
        }
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = SymmetricKey.getFactory(algorithm);
        if (!factory) {
            factory = SymmetricKey.getFactory("*")
        }
        return factory.parseSymmetricKey(key)
    }
})(DIMP);
(function(ns) {
    var CryptographyKey = ns.crypto.CryptographyKey;
    var AsymmetricKey = function(key) {};
    ns.Interface(AsymmetricKey, [CryptographyKey]);
    AsymmetricKey.RSA = "RSA";
    AsymmetricKey.ECC = "ECC";
    AsymmetricKey.matches = function(sKey, pKey) {
        var promise = CryptographyKey.promise;
        var signature = sKey.sign(promise);
        return pKey.verify(promise, signature)
    };
    var SignKey = function() {};
    ns.Interface(SignKey, [AsymmetricKey]);
    SignKey.prototype.sign = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    var VerifyKey = function() {};
    ns.Interface(VerifyKey, [AsymmetricKey]);
    VerifyKey.prototype.verify = function(data, signature) {
        console.assert(false, "implement me!");
        return false
    };
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;
    ns.crypto.register("AsymmetricKey");
    ns.crypto.register("SignKey");
    ns.crypto.register("VerifyKey")
})(DIMP);
(function(ns) {
    var VerifyKey = ns.crypto.VerifyKey;
    var PublicKey = function() {};
    ns.Interface(PublicKey, [VerifyKey]);
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.register("PublicKey")
})(DIMP);
(function(ns) {
    var map = ns.type.Map;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var PublicKey = ns.crypto.PublicKey;
    var PublicKeyFactory = function() {};
    ns.Interface(PublicKeyFactory, null);
    PublicKeyFactory.prototype.parsePublicKey = function(key) {
        console.assert(false, "implement me!");
        return null
    };
    PublicKey.Factory = PublicKeyFactory;
    var s_factories = {};
    PublicKey.register = function(algorithm, factory) {
        s_factories[algorithm] = factory
    };
    PublicKey.getFactory = function(algorithm) {
        return s_factories[algorithm]
    };
    PublicKey.parse = function(key) {
        if (!key) {
            return null
        } else {
            if (key instanceof PublicKey) {
                return key
            } else {
                if (key instanceof map) {
                    key = key.getMap()
                }
            }
        }
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PublicKey.getFactory(algorithm);
        if (!factory) {
            factory = PublicKey.getFactory("*")
        }
        return factory.parsePublicKey(key)
    }
})(DIMP);
(function(ns) {
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = function() {};
    ns.Interface(PrivateKey, [SignKey]);
    PrivateKey.prototype.getPublicKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.register("PrivateKey")
})(DIMP);
(function(ns) {
    var map = ns.type.Map;
    var CryptographyKey = ns.crypto.CryptographyKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PrivateKeyFactory = function() {};
    ns.Interface(PrivateKeyFactory, null);
    PrivateKeyFactory.prototype.generatePrivateKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    PrivateKeyFactory.prototype.parsePrivateKey = function(key) {
        console.assert(false, "implement me!");
        return null
    };
    PrivateKey.Factory = PrivateKeyFactory;
    var s_factories = {};
    PrivateKey.register = function(algorithm, factory) {
        s_factories[algorithm] = factory
    };
    PrivateKey.getFactory = function(algorithm) {
        return s_factories[algorithm]
    };
    PrivateKey.generate = function(algorithm) {
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            throw ReferenceError("key algorithm not support: " + algorithm)
        }
        return factory.generatePrivateKey()
    };
    PrivateKey.parse = function(key) {
        if (!key) {
            return null
        } else {
            if (key instanceof PrivateKey) {
                return key
            } else {
                if (key instanceof map) {
                    key = key.getMap()
                }
            }
        }
        var algorithm = CryptographyKey.getAlgorithm(key);
        var factory = PrivateKey.getFactory(algorithm);
        if (!factory) {
            factory = PrivateKey.getFactory("*")
        }
        return factory.parsePrivateKey(key)
    }
})(DIMP);
