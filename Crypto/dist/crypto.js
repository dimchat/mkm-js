/**
 * Cryptography JavaScript Library (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      June. 1, 2021
 * @copyright (c) 2021 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof MONKEY !== "object") {
    MONKEY = {}
}
(function(ns) {
    var namespacefy = function(space) {
        space.__all__ = [];
        space.registers = namespace.prototype.registers;
        space.exports = namespace.prototype.exports;
        return space
    };
    var is_space = function(space) {
        if (space instanceof namespace) {
            return true
        }
        if (typeof space.exports !== "function") {
            return false
        }
        if (typeof space.registers !== "function") {
            return false
        }
        return space.__all__ instanceof Array
    };
    var namespace = function() {
        this.__all__ = []
    };
    namespace.prototype.registers = function(name) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name)
        }
    };
    namespace.prototype.exports = function(to) {
        var names = this.__all__;
        var name;
        for (var i = 0; i < names.length; ++i) {
            name = names[i];
            export_one(this, to, name);
            to.registers(name)
        }
        return to
    };
    var export_one = function(from, to, name) {
        var source = from[name];
        var target = to[name];
        if (source === target) {} else {
            if (typeof target === "undefined") {
                to[name] = source
            } else {
                if (is_space(source)) {
                    if (!is_space(target)) {
                        namespacefy(target)
                    }
                    source.exports(target)
                } else {
                    export_all(source, target)
                }
            }
        }
    };
    var export_all = function(from, to) {
        var names = Object.getOwnPropertyNames(from);
        for (var i = 0; i < names.length; ++i) {
            export_one(from, to, names[i])
        }
    };
    ns.Namespace = namespace;
    namespacefy(ns);
    ns.registers("Namespace")
})(MONKEY);
(function(ns) {
    if (typeof ns.type !== "object") {
        ns.type = new ns.Namespace()
    }
    if (typeof ns.threading !== "object") {
        ns.threading = new ns.Namespace()
    }
    if (typeof ns.format !== "object") {
        ns.format = new ns.Namespace()
    }
    if (typeof ns.digest !== "object") {
        ns.digest = new ns.Namespace()
    }
    if (typeof ns.crypto !== "object") {
        ns.crypto = new ns.Namespace()
    }
    ns.registers("type");
    ns.registers("threading");
    ns.registers("format");
    ns.registers("digest");
    ns.registers("crypto")
})(MONKEY);
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
    var inherits = function(child, parent) {
        var prototype = parent.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        var key;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
            if (child.prototype.hasOwnProperty(key)) {
                continue
            }
            var fn = prototype[key];
            if (typeof fn !== "function") {
                continue
            }
            child.prototype[key] = fn
        }
        return child
    };
    var inherits_interfaces = function(child, interfaces) {
        for (var i = 0; i < interfaces.length; ++i) {
            child = inherits(child, interfaces[i])
        }
        return child
    };
    var interfacefy = function(child, parents) {
        if (!child) {
            child = function() {}
        }
        if (parents) {
            var ancestors;
            if (parents instanceof Array) {
                ancestors = parents
            } else {
                ancestors = [];
                for (var i = 1; i < arguments.length; ++i) {
                    ancestors.push(arguments[i])
                }
            }
            child = inherits_interfaces(child, ancestors)
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
        inherits(child, parent);
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
            child = inherits_interfaces(child, ancestors)
        }
        child.prototype.constructor = child;
        return child
    };
    ns.Interface = interfacefy;
    ns.Class = classify;
    ns.registers("Interface");
    ns.registers("Class")
})(MONKEY);
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
    var obj = function() {
        Object.call(this)
    };
    ns.Class(obj, Object, null);
    obj.isNull = is_null;
    obj.isBaseType = is_base_type;
    obj.prototype.equals = function(other) {
        return this === other
    };
    ns.type.Object = obj;
    ns.type.registers("Object")
})(MONKEY);
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
            if (keys2.indexOf(k) < 0) {
                return false
            }
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
                    if (typeof obj1["equals"] === "function") {
                        return obj1.equals(obj2)
                    } else {
                        if (typeof obj2["equals"] === "function") {
                            return obj2.equals(obj1)
                        } else {
                            if (ns.type.Object.isBaseType(obj1)) {
                                return obj1 === obj2
                            } else {
                                if (ns.type.Object.isBaseType(obj2)) {
                                    return false
                                } else {
                                    if (is_array(obj1)) {
                                        return is_array(obj2) && arrays_equal(obj1, obj2)
                                    } else {
                                        if (is_array(obj2)) {
                                            return false
                                        } else {
                                            return maps_equal(obj1, obj2)
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
    ns.type.registers("Arrays")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
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
                    return e.__alias
                }
            }
        }
        return null
    };
    var base_enum = function(value, alias) {
        obj.call(this);
        if (!alias) {
            if (value instanceof base_enum) {
                alias = value.__alias
            } else {
                alias = get_alias.call(this, value)
            }
        }
        if (value instanceof base_enum) {
            value = value.__value
        }
        this.__value = value;
        this.__alias = alias
    };
    ns.Class(base_enum, obj, null);
    base_enum.prototype.equals = function(other) {
        if (!other) {
            return !this.__value
        } else {
            if (other instanceof base_enum) {
                return this.__value === other.valueOf()
            } else {
                return this.__value === other
            }
        }
    };
    base_enum.prototype.valueOf = function() {
        return this.__value
    };
    base_enum.prototype.toString = function() {
        return "<" + this.__alias.toString() + ": " + this.__value.toString() + ">"
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
                v = v.__value
            } else {
                if (typeof v !== "number") {
                    throw new TypeError("Enum value must be a number!")
                }
            }
            e = new enumeration(v, name);
            enumeration[name] = e
        }
        return enumeration
    };
    ns.type.Enum = enumify;
    ns.type.registers("Enum")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Arrays = ns.type.Arrays;
    var bytes = function() {
        obj.call(this);
        this._buffer = null;
        this._offset = 0;
        this._length = 0;
        if (arguments.length === 0) {
            this._buffer = new Uint8Array(4)
        } else {
            if (arguments.length === 1) {
                var arg = arguments[0];
                if (typeof arg === "number") {
                    this._buffer = new Uint8Array(arg)
                } else {
                    if (arg instanceof bytes) {
                        this._buffer = arg._buffer;
                        this._offset = arg._offset;
                        this._length = arg._length
                    } else {
                        if (arg instanceof Uint8Array) {
                            this._buffer = arg
                        } else {
                            this._buffer = new Uint8Array(arg)
                        }
                        this._length = arg.length
                    }
                }
            } else {
                if (arguments.length === 3) {
                    this._buffer = arguments[0];
                    this._offset = arguments[1];
                    this._length = arguments[2]
                } else {
                    throw new SyntaxError("arguments error: " + arguments)
                }
            }
        }
    };
    ns.Class(bytes, obj, null);
    bytes.ZERO = new bytes(new Uint8Array(0), 0, 0);
    bytes.prototype.getBuffer = function() {
        return this._buffer
    };
    bytes.prototype.getOffset = function() {
        return this._offset
    };
    bytes.prototype.equals = function(other) {
        if (!other) {
            return this._length === 0
        } else {
            if (this === other) {
                return true
            }
        }
        var otherBuffer, otherOffset, otherLength;
        if (other instanceof bytes) {
            otherBuffer = other._buffer;
            otherOffset = other._offset;
            otherLength = other._length
        } else {
            otherBuffer = other;
            otherOffset = 0;
            otherLength = other.length
        }
        if (this._length !== otherLength) {
            return false
        } else {
            if (this._buffer === otherBuffer && this._offset === otherOffset) {
                return true
            }
        }
        var buffer = this._buffer;
        var pos1 = this._offset + this._length - 1;
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
        start += this._offset;
        end += this._offset;
        for (; start < end; ++start) {
            if (this._buffer[start] === value) {
                return start - this._offset
            }
        }
        return -1
    };
    var find_sub = function(sub, start, end) {
        if ((end - start) < sub._length) {
            return -1
        }
        start += this._offset;
        end += this._offset - sub._length + 1;
        if (this._buffer === sub._buffer) {
            if (start === sub._offset) {
                return start - this._offset
            }
        }
        var index;
        for (; start < end; ++start) {
            for (index = 0; index < sub._length; ++index) {
                if (this._buffer[start + index] !== sub._buffer[sub._offset + index]) {
                    break
                }
            }
            if (index === sub._length) {
                return start - this._offset
            }
        }
        return -1
    };
    bytes.prototype.find = function() {
        var sub, start, end;
        if (arguments.length === 1) {
            sub = arguments[0];
            start = 0;
            end = this._length
        } else {
            if (arguments.length === 2) {
                sub = arguments[0];
                start = arguments[1];
                end = this._length;
                start = adjust(start, this._length)
            } else {
                if (arguments.length === 3) {
                    sub = arguments[0];
                    start = arguments[1];
                    end = arguments[2];
                    start = adjust(start, this._length);
                    end = adjust(end, this._length)
                } else {
                    throw new SyntaxError("arguments error: " + arguments)
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
            index += this._length;
            if (index < 0) {
                throw new RangeError("error index: " + (index - this._length) + ", length: " + this._length)
            }
        } else {
            if (index >= this._length) {
                throw new RangeError("error index: " + index + ", length: " + this._length)
            }
        }
        return this._buffer[this._offset + index]
    };
    var get_bytes = function(start, end) {
        start += this._offset;
        end += this._offset;
        if (start === 0 && end === this._buffer.length) {
            return this._buffer
        } else {
            if (start < end) {
                return this._buffer.subarray(start, end)
            } else {
                return this.ZERO.getBytes()
            }
        }
    };
    bytes.prototype.getBytes = function() {
        var start, end;
        if (arguments.length === 0) {
            start = 0;
            end = this._length
        } else {
            if (arguments.length === 1) {
                start = arguments[0];
                end = this._length;
                start = adjust(start, this._length)
            } else {
                if (arguments.length === 2) {
                    start = arguments[0];
                    end = arguments[1];
                    start = adjust(start, this._length);
                    end = adjust(end, this._length)
                } else {
                    throw new SyntaxError("arguments error: " + arguments)
                }
            }
        }
        return get_bytes.call(this, start, end)
    };
    bytes.prototype.slice = function(start) {
        var end;
        if (arguments.length === 2) {
            end = arguments[1];
            end = adjust(end, this._length)
        } else {
            end = this._length
        }
        start = adjust(start, this._length);
        return slice(this, start, end)
    };
    var slice = function(data, start, end) {
        if (start === 0 && end === data._length) {
            return data
        } else {
            if (start < end) {
                return new bytes(data._buffer, data._offset + start, end - start)
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
        if (left._length === 0) {
            return right
        } else {
            if (right._length === 0) {
                return left
            } else {
                if (left._buffer === right._buffer && (left._offset + left._length) === right._offset) {
                    return new bytes(left._buffer, left._offset, left._length + right._length)
                } else {
                    var joined = new Uint8Array(left._length + right._length);
                    Arrays.copy(left._buffer, left._offset, joined, 0, left._length);
                    Arrays.copy(right._buffer, right._offset, joined, left._length, right._length);
                    return new bytes(joined, 0, joined.length)
                }
            }
        }
    };
    bytes.prototype.copy = function() {
        return new bytes(this._buffer, this._offset, this._length)
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
    ns.type.registers("Data")
})(MONKEY);
(function(ns) {
    var Arrays = ns.type.Arrays;
    var bytes = ns.type.Data;
    var adjust = bytes.adjust;
    var resize = function(size) {
        var bigger = new Uint8Array(size);
        Arrays.copy(this._buffer, this._offset, bigger, 0, this._length);
        this._buffer = bigger;
        this._offset = 0
    };
    var expand = function() {
        var capacity = this._buffer.length - this._offset;
        if (capacity > 4) {
            resize.call(this, capacity << 1)
        } else {
            resize.call(this, 8)
        }
    };
    bytes.prototype.setByte = function(index, value) {
        if (index < 0) {
            index += this._length;
            if (index < 0) {
                return false
            }
        }
        if (index >= this._length) {
            if (this._offset + index >= this._buffer.length) {
                if (index < this._buffer.length) {
                    Arrays.copy(this._buffer, this._offset, this._buffer, 0, this._length);
                    this._offset = 0
                } else {
                    resize.call(this, index + 1)
                }
            }
            this._length = index + 1
        }
        this._buffer[this._offset + index] = value & 255;
        return true
    };
    var copy_buffer = function(data, pos, source, start, end) {
        var copyLen = end - start;
        if (copyLen > 0) {
            var copyEnd = pos + copyLen;
            if (source !== data._buffer || (data._offset + pos) !== start) {
                if (data._offset + copyEnd > data._buffer.length) {
                    resize.call(data, copyEnd)
                }
                Arrays.copy(source, start, data._buffer, data._offset + pos, copyLen)
            }
            if (copyEnd > data._length) {
                data._length = copyEnd
            }
        }
    };
    bytes.prototype.fill = function(pos, source) {
        if (pos < 0) {
            pos += this._length;
            if (pos < 0) {
                throw new RangeError("error position: " + (pos - this._length) + ", length: " + this._length)
            }
        }
        var start, end;
        if (arguments.length === 4) {
            start = arguments[2];
            end = arguments[3];
            start = adjust(start, get_length(source));
            end = adjust(end, get_length(source))
        } else {
            if (arguments.length === 3) {
                start = arguments[2];
                end = get_length(source);
                start = adjust(start, get_length(source))
            } else {
                start = 0;
                end = get_length(source)
            }
        }
        if (source instanceof bytes) {
            copy_buffer(this, pos, source._buffer, source._offset + start, source._offset + end)
        } else {
            copy_buffer(this, pos, source, start, end)
        }
    };
    var get_length = function(source) {
        if (source instanceof bytes) {
            return source._length
        } else {
            return source.length
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
            start = adjust(start, get_length(source));
            end = adjust(end, get_length(source))
        } else {
            if (arguments.length === 2) {
                start = arguments[1];
                end = get_length(source);
                start = adjust(start, get_length(source))
            } else {
                start = 0;
                end = get_length(source)
            }
        }
        if (source instanceof bytes) {
            copy_buffer(this, this._length, source._buffer, source._offset + start, source._offset + end)
        } else {
            copy_buffer(this, this._length, source, start, end)
        }
    };
    bytes.prototype.insert = function(index, value) {
        if (index < 0) {
            index += this._length;
            if (index < 0) {
                return false
            }
        }
        if (index >= this._length) {
            return this.setByte(index, value)
        }
        if (index === 0) {
            if (this._offset > 0) {
                this._offset -= 1
            } else {
                if (this._length === this._buffer.length) {
                    expand.call(this)
                }
                Arrays.copy(this._buffer, 0, this._buffer, 1, this._length)
            }
        } else {
            if (index < (this._length >> 1)) {
                if (this._offset > 0) {
                    Arrays.copy(this._buffer, this._offset, this._buffer, this._offset - 1, index);
                    this._offset -= 1
                } else {
                    if ((this._offset + this._length) === this._buffer.length) {
                        expand.call(this)
                    }
                    Arrays.copy(this._buffer, this._offset + index, this._buffer, this._offset + index + 1, this._length - index)
                }
            } else {
                if ((this._offset + this._length) < this._buffer.length) {
                    Arrays.copy(this._buffer, this._offset + index, this._buffer, this._offset + index + 1, this._length - index)
                } else {
                    if (this._offset > 0) {
                        Arrays.copy(this._buffer, this._offset, this._buffer, this._offset - 1, index);
                        this._offset -= 1
                    } else {
                        expand.call(this);
                        Arrays.copy(this._buffer, this._offset + index, this._buffer, this._offset + index + 1, this._length - index)
                    }
                }
            }
        }
        this._buffer[this._offset + index] = value & 255;
        this._length += 1;
        return true
    };
    bytes.prototype.remove = function(index) {
        if (index < 0) {
            index += this._length;
            if (index < 0) {
                throw new RangeError("error index: " + (index - this._length) + ", length: " + this._length)
            }
        } else {
            if (index >= this._length) {
                throw new RangeError("index error: " + index + ", length: " + this._length)
            }
        }
        if (index === 0) {
            return this.shift()
        } else {
            if (index === (this._length - 1)) {
                return this.pop()
            }
        }
        var erased = this._buffer[this._offset + index];
        if (index < (this._length >> 1)) {
            Arrays.copy(this._buffer, this._offset, this._buffer, this._offset + 1, index)
        } else {
            Arrays.copy(this._buffer, this._offset + index + 1, this._buffer, this._offset + index, this._length - index - 1)
        }
        return erased
    };
    bytes.prototype.shift = function() {
        if (this._length < 1) {
            throw new RangeError("data empty!")
        }
        var erased = this._buffer[this._offset];
        this._offset += 1;
        this._length -= 1;
        return erased
    };
    bytes.prototype.pop = function() {
        if (this._length < 1) {
            throw new RangeError("data empty!")
        }
        this._length -= 1;
        return this._buffer[this._offset + this._length]
    };
    bytes.prototype.push = function(element) {
        this.setByte(this._length, element)
    };
    ns.type.MutableData = bytes;
    ns.type.registers("MutableData")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var str = function(value) {
        obj.call(this);
        if (!value) {
            value = ""
        } else {
            if (value instanceof str) {
                value = value.toString()
            }
        }
        this.__string = value
    };
    ns.Class(str, obj, null);
    str.prototype.equals = function(other) {
        if (!other) {
            return !this.__string
        } else {
            if (other instanceof str) {
                return this.__string === other.__string
            } else {
                return this.__string === other
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
            return !this.__string
        } else {
            if (other instanceof str) {
                return equalsIgnoreCase(this.__string, other.__string)
            } else {
                return equalsIgnoreCase(this.__string, other)
            }
        }
    };
    str.prototype.valueOf = function() {
        return this.__string
    };
    str.prototype.toString = function() {
        return this.__string
    };
    str.prototype.getLength = function() {
        return this.__string.length
    };
    ns.type.String = str;
    ns.type.registers("String")
})(MONKEY);
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
        if (ns.Interface.conforms(dictionary, map)) {
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
    ns.type.registers("Map")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var map = ns.type.Map;
    var Arrays = ns.type.Arrays;
    var dict = function(dictionary) {
        obj.call(this);
        if (!dictionary) {
            dictionary = {}
        } else {
            if (ns.Interface.conforms(dictionary, map)) {
                dictionary = dictionary.getMap()
            }
        }
        this.__dictionary = dictionary
    };
    ns.Class(dict, obj, [map]);
    dict.prototype.getMap = function() {
        return this.__dictionary
    };
    dict.prototype.copyMap = function() {
        return map.copyMap(this.__dictionary)
    };
    dict.prototype.valueOf = function() {
        return this.__dictionary
    };
    dict.prototype.equals = function(other) {
        if (!other) {
            return !this.__dictionary
        } else {
            if (ns.Interface.conforms(other, map)) {
                return Arrays.equals(this.__dictionary, other.getMap())
            } else {
                return Arrays.equals(this.__dictionary, other)
            }
        }
    };
    dict.prototype.allKeys = function() {
        return Object.keys(this.__dictionary)
    };
    dict.prototype.getValue = function(key) {
        return this.__dictionary[key]
    };
    dict.prototype.setValue = function(key, value) {
        if (value) {
            this.__dictionary[key] = value
        } else {
            if (this.__dictionary.hasOwnProperty(key)) {
                delete this.__dictionary[key]
            }
        }
    };
    ns.type.Dictionary = dict;
    ns.type.registers("Dictionary")
})(MONKEY);
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
                if (ns.Interface.conforms(object, map)) {
                    object = object.getMap()
                }
                return map_unwrap(object)
            }
        } else {
            if (ns.Interface.conforms(object, map)) {
                object = object.getMap()
            }
        }
        return object
    };
    var wrapper = function() {};
    ns.Interface(wrapper, null);
    wrapper.unwrap = unwrap;
    ns.type.Wrapper = wrapper;
    ns.type.registers("Wrapper")
})(MONKEY);
(function(ns) {
    var Runnable = function() {};
    ns.Interface(Runnable, null);
    Runnable.prototype.run = function() {
        console.assert(false, "implement me!");
        return false
    };
    ns.threading.Runnable = Runnable;
    ns.threading.registers("Runnable")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Runnable = ns.threading.Runnable;
    var Thread = function() {
        obj.call(this);
        if (arguments.length === 0) {
            this.__target = null;
            this.__interval = 128
        } else {
            if (arguments.length === 2) {
                this.__target = arguments[0];
                this.__interval = arguments[1]
            } else {
                if (typeof arguments[0] === "number") {
                    this.__target = null;
                    this.__interval = arguments[0]
                } else {
                    this.__target = arguments[0];
                    this.__interval = 128
                }
            }
        }
        this.__running = false;
        this.__thread_id = 0
    };
    ns.Class(Thread, obj, [Runnable]);
    Thread.prototype.start = function() {
        this.__running = true;
        var thread = this;
        this.__thread_id = setInterval(function() {
            var ran = thread.isRunning() && thread.run();
            if (!ran) {
                stop(thread)
            }
        }, this.getInterval())
    };
    var stop = function(thread) {
        var tid = thread.__thread_id;
        if (tid > 0) {
            thread.__thread_id = 0;
            clearInterval(tid)
        }
    };
    Thread.prototype.stop = function() {
        stop(this);
        this.__running = false
    };
    Thread.prototype.isRunning = function() {
        return this.__running
    };
    Thread.prototype.getInterval = function() {
        return this.__interval
    };
    Thread.prototype.run = function() {
        var target = this.__target;
        if (!target || target === this) {
            throw new SyntaxError("Thread::run() > override me!")
        } else {
            return target.run()
        }
    };
    ns.threading.Thread = Thread;
    ns.threading.registers("Thread")
})(MONKEY);
(function(ns) {
    var Handler = function() {};
    ns.Interface(Handler, null);
    Handler.prototype.setup = function() {
        console.assert(false, "implement me!");
        return false
    };
    Handler.prototype.handle = function() {
        console.assert(false, "implement me!");
        return false
    };
    Handler.prototype.finish = function() {
        console.assert(false, "implement me!");
        return false
    };
    ns.threading.Handler = Handler;
    ns.threading.registers("Handler")
})(MONKEY);
(function(ns) {
    var Processor = function() {};
    ns.Interface(Processor, null);
    Processor.prototype.process = function() {
        console.assert(false, "implement me!");
        return false
    };
    ns.threading.Processor = Processor;
    ns.threading.registers("Processor")
})(MONKEY);
(function(ns) {
    var Thread = ns.threading.Thread;
    var Handler = ns.threading.Handler;
    var Processor = ns.threading.Processor;
    var STAGE_INIT = 0;
    var STAGE_HANDLING = 1;
    var STAGE_CLEANING = 2;
    var STAGE_STOPPED = 3;
    var Runner = function() {
        if (arguments.length === 0) {
            Thread.call(this);
            this.__processor = null
        } else {
            if (arguments.length === 2) {
                Thread.call(this, arguments[1]);
                this.__processor = arguments[0]
            } else {
                if (typeof arguments[0] === "number") {
                    Thread.call(this, arguments[0]);
                    this.__processor = null
                } else {
                    Thread.call(this);
                    this.__processor = arguments[0]
                }
            }
        }
        this.__stage = STAGE_INIT
    };
    ns.Class(Runner, Thread, [Handler, Processor]);
    Runner.prototype.run = function() {
        if (this.__stage === STAGE_INIT) {
            if (this.setup()) {
                return true
            }
            this.__stage = STAGE_HANDLING
        }
        if (this.__stage === STAGE_HANDLING) {
            try {
                if (this.handle()) {
                    return true
                }
            } catch (e) {}
            this.__stage = STAGE_CLEANING
        }
        if (this.__stage === STAGE_CLEANING) {
            if (this.finish()) {
                return true
            }
            this.__stage = STAGE_STOPPED
        }
        return false
    };
    Runner.prototype.setup = function() {
        return false
    };
    Runner.prototype.handle = function() {
        while (this.isRunning()) {
            if (this.process()) {} else {
                return true
            }
        }
        return false
    };
    Runner.prototype.finish = function() {
        return false
    };
    Runner.prototype.process = function() {
        var processor = this.__processor;
        if (!processor || processor === this) {
            throw new SyntaxError("Runner::process() > override me!")
        } else {
            return processor.process()
        }
    };
    ns.threading.Runner = Runner;
    ns.threading.registers("Runner")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var hash = function() {};
    ns.Interface(hash, null);
    hash.prototype.digest = function(data) {
        console.assert(false, "implement me!");
        return null
    };
    var lib = function(hash) {
        obj.call(this);
        this.hash = hash
    };
    ns.Class(lib, obj, [hash]);
    lib.prototype.digest = function(data) {
        return this.hash.digest(data)
    };
    ns.digest.Hash = hash;
    ns.digest.HashLib = lib;
    ns.digest.registers("Hash");
    ns.digest.registers("HashLib")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var md5 = function() {
        obj.call(this)
    };
    ns.Class(md5, obj, [Hash]);
    md5.prototype.digest = function(data) {
        console.assert(false, "MD5 not implemented");
        return null
    };
    ns.digest.MD5 = new Lib(new md5());
    ns.digest.registers("MD5")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var sha1 = function() {
        obj.call(this)
    };
    ns.Class(sha1, obj, [Hash]);
    sha1.prototype.digest = function(data) {
        console.assert(false, "SHA1 not implemented");
        return null
    };
    ns.digest.SHA1 = new Lib(new sha1());
    ns.digest.registers("SHA1")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var sha256 = function() {
        obj.call(this)
    };
    ns.Class(sha256, obj, [Hash]);
    sha256.prototype.digest = function(data) {
        console.assert(false, "SHA256 not implemented");
        return null
    };
    ns.digest.SHA256 = new Lib(new sha256());
    ns.digest.registers("SHA256")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var ripemd160 = function() {
        obj.call(this)
    };
    ns.Class(ripemd160, obj, [Hash]);
    ripemd160.prototype.digest = function(data) {
        console.assert(false, "RIPEMD160 not implemented");
        return null
    };
    ns.digest.RIPEMD160 = new Lib(new ripemd160());
    ns.digest.registers("RIPEMD160")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Hash = ns.digest.Hash;
    var Lib = ns.digest.HashLib;
    var keccak256 = function() {
        obj.call(this)
    };
    ns.Class(keccak256, obj, [Hash]);
    keccak256.prototype.digest = function(data) {
        console.assert(false, "KECCAK256 not implemented");
        return null
    };
    ns.digest.KECCAK256 = new Lib(new keccak256());
    ns.digest.registers("KECCAK256")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
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
        obj.call(this);
        this.coder = coder
    };
    ns.Class(lib, obj, [coder]);
    lib.prototype.encode = function(data) {
        return this.coder.encode(data)
    };
    lib.prototype.decode = function(string) {
        return this.coder.decode(string)
    };
    ns.format.BaseCoder = coder;
    ns.format.CoderLib = lib;
    ns.format.registers("BaseCoder");
    ns.format.registers("CoderLib")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
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
    var hex = function() {
        obj.call(this)
    };
    ns.Class(hex, obj, [Coder]);
    hex.prototype.encode = function(data) {
        return hex_encode(data)
    };
    hex.prototype.decode = function(str) {
        return hex_decode(str)
    };
    ns.format.Hex = new Lib(new hex());
    ns.format.registers("Hex")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Coder = ns.format.BaseCoder;
    var Lib = ns.format.CoderLib;
    var base58 = function() {
        obj.call(this)
    };
    ns.Class(base58, obj, [Coder]);
    base58.prototype.encode = function(data) {
        console.assert(false, "Base58 encode not implemented");
        return null
    };
    base58.prototype.decode = function(string) {
        console.assert(false, "Base58 decode not implemented");
        return null
    };
    ns.format.Base58 = new Lib(new base58());
    ns.format.registers("Base58")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
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
            throw new Error("base64 string error: " + string)
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
    var base64 = function() {
        obj.call(this)
    };
    ns.Class(base64, obj, [Coder]);
    base64.prototype.encode = function(data) {
        return base64_encode(data)
    };
    base64.prototype.decode = function(string) {
        return base64_decode(string)
    };
    ns.format.Base64 = new Lib(new base64());
    ns.format.registers("Base64")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
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
        obj.call(this);
        this.parser = parser
    };
    ns.Class(lib, obj, [parser]);
    lib.prototype.encode = function(object) {
        return this.parser.encode(object)
    };
    lib.prototype.decode = function(data) {
        return this.parser.decode(data)
    };
    ns.format.DataParser = parser;
    ns.format.ParserLib = lib;
    ns.format.registers("DataParser");
    ns.format.registers("ParserLib")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
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
    var utf8 = function() {
        obj.call(this)
    };
    ns.Class(utf8, obj, [Parser]);
    utf8.prototype.encode = utf8_encode;
    utf8.prototype.decode = utf8_decode;
    ns.format.UTF8 = new Lib(new utf8());
    ns.format.registers("UTF8")
})(MONKEY);
(function(ns) {
    var obj = ns.type.Object;
    var Parser = ns.format.DataParser;
    var Lib = ns.format.ParserLib;
    var json = function() {
        obj.call(this)
    };
    ns.Class(json, obj, [Parser]);
    json.prototype.encode = function(container) {
        var string = JSON.stringify(container);
        if (!string) {
            throw new TypeError("failed to encode JSON object: " + container)
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
            throw new TypeError("failed to decode JSON data: " + json)
        }
        return JSON.parse(string)
    };
    ns.format.JSON = new Lib(new json());
    ns.format.registers("JSON")
})(MONKEY);
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
    ns.crypto.registers("CryptographyKey")
})(MONKEY);
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
    DecryptKey.prototype.matches = function(pKey) {
        console.assert(false, "implement me!");
        return false
    };
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.registers("EncryptKey");
    ns.crypto.registers("DecryptKey")
})(MONKEY);
(function(ns) {
    var EncryptKey = ns.crypto.EncryptKey;
    var DecryptKey = ns.crypto.DecryptKey;
    var SymmetricKey = function() {};
    ns.Interface(SymmetricKey, [EncryptKey, DecryptKey]);
    SymmetricKey.AES = "AES";
    SymmetricKey.DES = "DES";
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.registers("SymmetricKey")
})(MONKEY);
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
            throw new ReferenceError("key algorithm not support: " + algorithm)
        }
        return factory.generateSymmetricKey()
    };
    SymmetricKey.parse = function(key) {
        if (!key) {
            return null
        } else {
            if (ns.Interface.conforms(key, SymmetricKey)) {
                return key
            } else {
                if (ns.Interface.conforms(key, map)) {
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
})(MONKEY);
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
    VerifyKey.prototype.matches = function(sKey) {
        console.assert(false, "implement me!");
        return false
    };
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;
    ns.crypto.registers("AsymmetricKey");
    ns.crypto.registers("SignKey");
    ns.crypto.registers("VerifyKey")
})(MONKEY);
(function(ns) {
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var VerifyKey = ns.crypto.VerifyKey;
    var PublicKey = function() {};
    ns.Interface(PublicKey, [VerifyKey]);
    PublicKey.RSA = AsymmetricKey.RSA;
    PublicKey.ECC = AsymmetricKey.ECC;
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.registers("PublicKey")
})(MONKEY);
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
            if (ns.Interface.conforms(key, PublicKey)) {
                return key
            } else {
                if (ns.Interface.conforms(key, map)) {
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
})(MONKEY);
(function(ns) {
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var SignKey = ns.crypto.SignKey;
    var PrivateKey = function() {};
    ns.Interface(PrivateKey, [SignKey]);
    PrivateKey.RSA = AsymmetricKey.RSA;
    PrivateKey.ECC = AsymmetricKey.ECC;
    PrivateKey.prototype.getPublicKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.registers("PrivateKey")
})(MONKEY);
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
            throw new ReferenceError("key algorithm not support: " + algorithm)
        }
        return factory.generatePrivateKey()
    };
    PrivateKey.parse = function(key) {
        if (!key) {
            return null
        } else {
            if (ns.Interface.conforms(key, PrivateKey)) {
                return key
            } else {
                if (ns.Interface.conforms(key, map)) {
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
})(MONKEY);
