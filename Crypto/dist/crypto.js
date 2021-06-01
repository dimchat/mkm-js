/**
 * Cryptography JavaScript Library (v0.1.0)
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      June. 1, 2021
 * @copyright (c) 2021 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */;
if (typeof DIMP !== 'object') {
    DIMP = {}
}
(function(ns) {
    "use strict";
    const namespacefy = function(space) {
        if (!space) {
            space = new namespace()
        } else if (!is_space(space)) {
            space.__all__ = [];
            space.register = namespace.prototype.register;
            space.exports = namespace.prototype.exports
        }
        return space
    };
    const is_space = function(space) {
        if (space instanceof namespace) {
            return true
        }
        if (typeof space.exports !== 'function') {
            return false
        }
        if (typeof space.register !== 'function') {
            return false
        }
        return space.__all__ instanceof Array
    };
    const namespace = function() {
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
        const all = this.__all__;
        let name, inner;
        for (let i = 0; i < all.length; ++i) {
            name = all[i];
            inner = this[name];
            if (!inner) {
                throw Error('empty object: ' + name);
            }
            if (is_space(inner)) {
                if (typeof outerSpace[name] !== 'object') {
                    outerSpace[name] = new namespace()
                }
                inner.exports(outerSpace[name])
            } else if (outerSpace.hasOwnProperty(name)) {} else {
                outerSpace[name] = inner
            }
            outerSpace.register(name)
        }
        return outerSpace
    };
    ns.Namespace = namespacefy;
    namespacefy(ns);
    ns.register('Namespace')
})(DIMP);
(function(ns) {
    "use strict";
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
    ns.Namespace(ns.type);
    ns.Namespace(ns.format);
    ns.Namespace(ns.digest);
    ns.Namespace(ns.crypto);
    ns.register('type');
    ns.register('format');
    ns.register('digest');
    ns.register('crypto')
})(DIMP);
(function(ns) {
    'use strict';
    const conforms = function(object, protocol) {
        if (!object) {
            return false
        }
        if (object instanceof protocol) {
            return true
        }
        const child = Object.getPrototypeOf(object);
        const names = Object.getOwnPropertyNames(protocol.prototype);
        for (let i = 0; i < names.length; ++i) {
            if (!child.hasOwnProperty(names[i])) {
                return false
            }
        }
        return true
    };
    const inherit = function(clazz, protocol) {
        const prototype = protocol.prototype;
        const names = Object.getOwnPropertyNames(prototype);
        for (let i = 0; i < names.length; ++i) {
            let key = names[i];
            if (clazz.prototype.hasOwnProperty(key)) {
                continue
            }
            let fn = prototype[key];
            if (typeof fn !== 'function') {
                continue
            }
            clazz.prototype[key] = fn
        }
        return clazz
    };
    const inherits = function(clazz, interfaces) {
        for (let i = 0; i < interfaces.length; ++i) {
            clazz = inherit(clazz, interfaces[i])
        }
        return clazz
    };
    const interfacefy = function(child, parent) {
        if (!child) {
            child = function() {}
        }
        if (parent) {
            let ancestors;
            if (parent instanceof Array) {
                ancestors = parent
            } else {
                ancestors = [];
                for (let i = 1; i < arguments.length; ++i) {
                    ancestors.push(arguments[i])
                }
            }
            child = inherits(child, ancestors)
        }
        return child
    };
    interfacefy.conforms = conforms;
    const classify = function(child, parent, interfaces) {
        if (!child) {
            child = function() {}
        }
        if (!parent) {
            parent = Object
        }
        child.prototype = Object.create(parent.prototype);
        inherit(child, parent);
        if (interfaces) {
            let ancestors;
            if (interfaces instanceof Array) {
                ancestors = interfaces
            } else {
                ancestors = [];
                for (let i = 2; i < arguments.length; ++i) {
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
    ns.register('Interface');
    ns.register('Class')
})(DIMP);
(function(ns) {
    'use strict';
    const is_null = function(object) {
        if (typeof object === 'undefined') {
            return true
        } else {
            return object === null
        }
    };
    const is_base_type = function(object) {
        const t = typeof object;
        if (t === 'string' || t === 'number' || t === 'boolean' || t === 'function') {
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
    const obj = function() {};
    ns.Class(obj, Object, null);
    obj.isNull = is_null;
    obj.isBaseType = is_base_type;
    obj.prototype.equals = function(other) {
        return this === other
    };
    ns.type.Object = obj;
    ns.type.register('Object')
})(DIMP);
(function(ns) {
    'use strict';
    const is_array = function(obj) {
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
    const arrays_equal = function(array1, array2) {
        if (array1.length !== array2.length) {
            return false
        }
        for (let i = 0; i < array1.length; ++i) {
            if (!objects_equal(array1[i], array2[i])) {
                return false
            }
        }
        return true
    };
    const maps_equal = function(dict1, dict2) {
        const keys1 = Object.keys(dict1);
        const keys2 = Object.keys(dict2);
        if (keys1.length !== keys2.length) {
            return false
        }
        for (let k in keys1) {
            if (!objects_equal(dict1[k], dict2[k])) {
                return false
            }
        }
        return true
    };
    const objects_equal = function(obj1, obj2) {
        if (obj1 === obj2) {
            return true
        } else if (!obj1) {
            return !obj2
        } else if (!obj2) {
            return false
        } else if (typeof obj1 === 'string' || typeof obj2 === 'string') {
            return false
        } else if (typeof obj1['equals'] === 'function') {
            return obj1.equals(obj2)
        } else if (typeof obj2['equals'] === 'function') {
            return obj2.equals(obj1)
        }
        if (is_array(obj1)) {
            if (is_array(obj2)) {
                return arrays_equal(obj1, obj2)
            } else {
                return false
            }
        } else if (is_array(obj2)) {
            return false
        }
        return maps_equal(obj1, obj2)
    };
    const copy_items = function(src, srcPos, dest, destPos, length) {
        if (srcPos !== 0 || length !== src.length) {
            src = src.subarray(srcPos, srcPos + length)
        }
        dest.set(src, destPos)
    };
    const insert_item = function(array, index, item) {
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
    const update_item = function(array, index, item) {
        if (index < 0) {
            index += array.length;
            if (index < 0) {
                return false
            }
        }
        array[index] = item;
        return true
    };
    const remove_item = function(array, item) {
        const index = array.indexOf(item);
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
        copy: copy_items,
    };
    ns.type.register('Arrays')
})(DIMP);
(function(ns) {
    'use strict';
    const get_alias = function(value) {
        const enumeration = this.constructor;
        let e;
        for (let k in enumeration) {
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
    const base_enum = function(value, alias) {
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
        } else if (other instanceof base_enum) {
            return this.value === other.valueOf()
        } else {
            return this.value === other
        }
    };
    base_enum.prototype.valueOf = function() {
        return this.value
    };
    base_enum.prototype.toString = function() {
        return '<' + this.alias.toString() + ': ' + this.value.toString() + '>'
    };
    const enumify = function(enumeration, elements) {
        if (!enumeration) {
            enumeration = function(value, alias) {
                base_enum.call(this, value, alias)
            }
        }
        ns.Class(enumeration, base_enum, null);
        let e, v;
        for (let name in elements) {
            if (!elements.hasOwnProperty(name)) {
                continue
            }
            v = elements[name];
            if (v instanceof base_enum) {
                v = v.value
            } else if (typeof v !== 'number') {
                throw TypeError('Enum value must be a number!');
            }
            e = new enumeration(v, name);
            enumeration[name] = e
        }
        return enumeration
    };
    ns.type.BaseEnum = base_enum;
    ns.type.Enum = enumify;
    ns.type.register('BaseEnum');
    ns.type.register('Enum')
})(DIMP);
(function(ns) {
    'use strict';
    const Arrays = ns.type.Arrays;
    const bytes = function() {
        ns.type.Object.call(this);
        this.buffer = null;
        this.offset = 0;
        this.length = 0;
        if (arguments.length === 0) {
            this.buffer = new Uint8Array(4)
        } else if (arguments.length === 1) {
            const arg = arguments[0];
            if (typeof arg === 'number') {
                this.buffer = new Uint8Array(arg)
            } else if (arg instanceof bytes) {
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
        } else if (arguments.length === 3) {
            this.buffer = arguments[0];
            this.offset = arguments[1];
            this.length = arguments[2]
        } else {
            throw SyntaxError('arguments error: ' + arguments);
        }
    };
    ns.Class(bytes, ns.type.Object, null);
    bytes.ZERO = new bytes(new Uint8Array(0), 0, 0);
    bytes.prototype.equals = function(other) {
        if (!other || other.length === 0) {
            return this.length === 0
        } else if (this === other) {
            return true
        }
        let otherBuffer, otherOffset, otherLength;
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
        } else if (this.buffer === otherBuffer && this.offset === otherOffset) {
            return true
        }
        const buffer = this.buffer;
        let pos1 = this.offset + this.length - 1;
        let pos2 = otherOffset + otherLength - 1;
        for (; pos2 >= otherOffset; --pos1, --pos2) {
            if (buffer[pos1] !== otherBuffer[pos2]) {
                return false
            }
        }
        return true
    };
    const adjust = function(pos, len) {
        if (pos < 0) {
            pos += len;
            if (pos < 0) {
                return 0
            }
        } else if (pos > len) {
            return len
        }
        return pos
    };
    bytes.adjust = adjust;
    const find_value = function(value, start, end) {
        start += this.offset;
        end += this.offset;
        for (; start < end; ++start) {
            if (this.buffer[start] === value) {
                return start - this.offset
            }
        }
        return -1
    };
    const find_sub = function(sub, start, end) {
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
        let index;
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
        let sub, start, end;
        if (arguments.length === 1) {
            sub = arguments[0];
            start = 0;
            end = this.length
        } else if (arguments.length === 2) {
            sub = arguments[0];
            start = arguments[1];
            end = this.length;
            start = adjust(start, this.length)
        } else if (arguments.length === 3) {
            sub = arguments[0];
            start = arguments[1];
            end = arguments[2];
            start = adjust(start, this.length);
            end = adjust(end, this.length)
        } else {
            throw SyntaxError('arguments error: ' + arguments);
        }
        if (typeof sub === 'number') {
            return find_value.call(this, sub & 0xFF, start, end)
        } else if (sub instanceof bytes) {
            return find_sub.call(this, sub, start, end)
        } else {
            return find_sub.call(this, new bytes(sub), start, end)
        }
    };
    bytes.prototype.getByte = function(index) {
        if (index < 0) {
            index += this.length;
            if (index < 0) {
                throw RangeError('error index: ' + (index - this.length) + ', length: ' + this.length);
            }
        } else if (index >= this.length) {
            throw RangeError('error index: ' + index + ', length: ' + this.length);
        }
        return this.buffer[this.offset + index]
    };
    const get_bytes = function(start, end) {
        start += this.offset;
        end += this.offset;
        if (start === 0 && end === this.buffer.length) {
            return this.buffer
        } else if (start < end) {
            return this.buffer.subarray(start, end)
        } else {
            return this.ZERO.getBytes()
        }
    };
    bytes.prototype.getBytes = function() {
        let start, end;
        if (arguments.length === 0) {
            start = 0;
            end = this.length
        } else if (arguments.length === 1) {
            start = arguments[0];
            end = this.length;
            start = adjust(start, this.length)
        } else if (arguments.length === 2) {
            start = arguments[0];
            end = arguments[1];
            start = adjust(start, this.length);
            end = adjust(end, this.length)
        } else {
            throw SyntaxError('arguments error: ' + arguments);
        }
        return get_bytes.call(this, start, end)
    };
    bytes.prototype.slice = function(start) {
        let end;
        if (arguments.length === 2) {
            end = arguments[1];
            end = adjust(end, this.length)
        } else {
            end = this.length
        }
        start = adjust(start, this.length);
        return slice(this, start, end)
    };
    const slice = function(data, start, end) {
        if (start === 0 && end === data.length) {
            return data
        } else if (start < end) {
            return new bytes(data.buffer, data.offset + start, end - start)
        } else {
            return bytes.ZERO
        }
    };
    bytes.prototype.concat = function() {
        let result = this;
        let arg, other;
        for (let i = 0; i < arguments.length; ++i) {
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
    const concat = function(left, right) {
        if (left.length === 0) {
            return right
        } else if (right.length === 0) {
            return left
        } else if (left.buffer === right.buffer && (left.offset + left.length) === right.offset) {
            return new bytes(left.buffer, left.offset, left.length + right.length)
        } else {
            const joined = new Uint8Array(left.length + right.length);
            Arrays.copy(left.buffer, left.offset, joined, 0, left.length);
            Arrays.copy(right.buffer, right.offset, joined, left.length, right.length);
            return new bytes(joined, 0, joined.length)
        }
    };
    bytes.prototype.copy = function() {
        return new bytes(this.buffer, this.offset, this.length)
    };
    bytes.prototype.mutableCopy = function() {
        let buffer = this.getBytes();
        buffer = new Uint8Array(buffer);
        return new bytes(buffer, 0, buffer.length)
    };
    bytes.prototype.toArray = function() {
        const array = this.getBytes();
        if (typeof Array.from === 'function') {
            return Array.from(array)
        } else {
            return [].slice.call(array)
        }
    };
    ns.type.Data = bytes;
    ns.type.register('Data')
})(DIMP);
(function(ns) {
    'use strict';
    const Arrays = ns.type.Arrays;
    const bytes = ns.type.Data;
    const adjust = bytes.adjust;
    bytes.prototype.getCapacity = function() {
        return this.buffer.length - this.offset
    };
    const resize = function(size) {
        const bigger = new Uint8Array(size);
        Arrays.copy(this.buffer, this.offset, bigger, 0, this.length);
        this.buffer = bigger;
        this.offset = 0
    };
    const expand = function() {
        const capacity = this.getCapacity();
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
        this.buffer[this.offset + index] = value & 0xFF;
        return true
    };
    const copy_buffer = function(pos, source, start, end) {
        if (pos < 0) {
            pos += this.length;
            if (pos < 0) {
                throw RangeError('error position: ' + (pos - this.length) + ', length: ' + this.length);
            }
        }
        const copyLen = end - start;
        if (copyLen > 0) {
            const destPos = this.offset + pos;
            const copyEnd = pos + copyLen;
            if (source !== this.buffer || destPos !== start) {
                if (this.getCapacity() < copyEnd) {
                    resize.call(this, copyEnd)
                }
                Arrays.copy(source, start, this.buffer, 0, copyLen)
            }
            if (copyEnd > this.length) {
                this.length = copyEnd
            }
        }
    };
    bytes.prototype.fill = function(pos, source) {
        let data, start, end;
        if (source instanceof bytes) {
            data = source
        } else {
            data = new bytes(source)
        }
        if (arguments.length === 4) {
            start = arguments[2];
            end = arguments[3];
            start = adjust(start, data.length);
            end = adjust(end, data.length)
        } else if (arguments.length === 3) {
            start = arguments[2];
            end = data.length;
            start = adjust(start, data.length)
        } else {
            start = 0;
            end = data.length
        }
        copy_buffer.call(this, pos, data, start, end)
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
        } else if (index < (this.length >> 1)) {
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
            } else if (this.offset > 0) {
                Arrays.copy(this.buffer, this.offset, this.buffer, this.offset - 1, index);
                this.offset -= 1
            } else {
                expand.call(this);
                Arrays.copy(this.buffer, this.offset + index, this.buffer, this.offset + index + 1, this.length - index)
            }
        }
        this.buffer[this.offset + index] = value & 0xFF;
        this.length += 1;
        return true
    };
    const add_item = function(value) {
        const pos = this.offset + this.length;
        if (pos >= this.buffer.length) {
            expand.call(this, this.length << 1)
        }
        this.buffer[this.offset + this.length] = value;
        ++this.length
    };
    const add_array = function(array) {
        if (!array) {
            return
        }
        let size = array.length;
        if (size < 1) {
            return
        }
        size += this.length;
        let capacity = this.buffer.length - this.offset;
        if (size > capacity) {
            while (capacity < size) {
                capacity = capacity << 1
            }
            expand.call(this, capacity)
        }
        Arrays.copy(array, 0, this.buffer, this.offset + this.length, array.length);
        this.length = size
    };
    bytes.prototype.push = function(items) {
        if (typeof items === 'number') {
            add_item.call(this, items)
        } else {
            let array;
            if (items instanceof Uint8Array) {
                array = items
            } else if (items instanceof bytes) {
                array = items.getBytes()
            } else {
                array = new Uint8Array(items)
            }
            add_array.call(this, array)
        }
        return this.length
    };
    bytes.prototype.pop = function() {
        if (this.length < 1) {
            throw RangeError('bytes empty');
        }
        this.length -= 1;
        return this.buffer[this.offset + this.length]
    };
    ns.type.MutableData = bytes;
    ns.type.register('MutableData')
})(DIMP);
(function(ns) {
    'use strict';
    const str = function(value) {
        if (!value) {
            value = ''
        } else if (value instanceof str) {
            value = value.valueOf()
        }
        ns.type.Object.call(this);
        this.string = value
    };
    ns.Class(str, ns.type.Object, null);
    str.prototype.equals = function(other) {
        if (!other) {
            return !this.string
        } else if (other instanceof str) {
            return this.string === other.string
        } else {
            return this.string === other
        }
    };
    const equalsIgnoreCase = function(str1, str2) {
        if (str1.length !== str2.length) {
            return false
        }
        const low1 = str1.toLowerCase();
        const low2 = str2.toLowerCase();
        return low1 === low2
    };
    str.prototype.equalsIgnoreCase = function(other) {
        if (!other) {
            return !this.string
        } else if (other instanceof str) {
            return equalsIgnoreCase(this.string, other.string)
        } else {
            return equalsIgnoreCase(this.string, other)
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
    ns.type.register('String')
})(DIMP);
(function(ns) {
    'use strict';
    const Arrays = ns.type.Arrays;
    const map = function(entries) {
        if (!entries) {
            entries = {}
        } else if (entries instanceof map) {
            entries = entries.getMap(false)
        } else if (entries instanceof ns.type.String) {
            entries = ns.format.JSON.decode(entries.toString())
        } else if (typeof entries === 'string') {
            entries = ns.format.JSON.decode(entries)
        }
        ns.type.Object.call(this);
        this.dictionary = entries
    };
    ns.Class(map, ns.type.Object, null);
    map.prototype.equals = function(other) {
        if (!other) {
            return !this.dictionary
        } else if (other instanceof map) {
            return Arrays.equals(this.dictionary, other.getMap(false))
        } else {
            return Arrays.equals(this.dictionary, other)
        }
    };
    map.prototype.valueOf = function() {
        return this.dictionary
    };
    map.prototype.toString = function() {
        return this.dictionary.toString()
    };
    map.prototype.getMap = function(copy) {
        if (copy) {
            const json = ns.format.JSON.encode(this.dictionary);
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
        } else if (this.dictionary.hasOwnProperty(key)) {
            delete this.dictionary[key]
        }
    };
    map.from = function(dict) {
        return new map(dict)
    };
    ns.type.Dictionary = map;
    ns.type.register('Dictionary')
})(DIMP);
(function(ns) {
    'use strict';
    const obj = ns.type.Object;
    const str = ns.type.String;
    const Enum = ns.type.Enum;
    const Data = ns.type.Data;
    const Arrays = ns.type.Arrays;
    const Dictionary = ns.type.Dictionary;
    const map_unwrap = function(dict) {
        const result = {};
        const keys = Object.keys(dict);
        let name;
        for (let k in keys) {
            if (k instanceof str) {
                name = k.valueOf()
            } else {
                name = k
            }
            result[name] = unwrap(dict[k], true)
        }
        return result
    };
    const list_unwrap = function(array) {
        const result = [];
        for (let item in array) {
            result.push(unwrap(item, true))
        }
        return result
    };
    const unwrap = function(object, circularly) {
        if (obj.isNull(object)) {
            return null
        } else if (obj.isBaseType(object)) {
            return object
        }
        if (object instanceof str) {
            return object.valueOf()
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
                if (object instanceof Dictionary) {
                    object = object.getMap(false)
                }
                return map_unwrap(object)
            }
        } else if (object instanceof Dictionary) {
            return object.getMap(false)
        }
        return object
    };
    const wrapper = function() {};
    ns.Interface(wrapper, null);
    wrapper.unwrap = unwrap;
    ns.type.Wrapper = wrapper;
    ns.type.register('Wrapper')
})(DIMP);
(function(ns) {
    'use strict';
    const Data = ns.type.Data;
    const hex_chars = '0123456789abcdef';
    const hex_values = new Int8Array(128);
    (function(chars, values) {
        for (let i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i
        }
        values['A'.charCodeAt(0)] = 0x0A;
        values['B'.charCodeAt(0)] = 0x0B;
        values['C'.charCodeAt(0)] = 0x0C;
        values['D'.charCodeAt(0)] = 0x0D;
        values['E'.charCodeAt(0)] = 0x0E;
        values['F'.charCodeAt(0)] = 0x0F
    })(hex_chars, hex_values);
    const hex_encode = function(data) {
        const len = data.length;
        let str = '';
        let byt;
        for (let i = 0; i < len; ++i) {
            byt = data[i];
            str += hex_chars[byt >> 4];
            str += hex_chars[byt & 0x0F]
        }
        return str
    };
    const hex_decode = function(string) {
        let i = 0;
        let len = string.length;
        if (len > 2) {
            if (string[0] === '0') {
                if (string[1] === 'x' || string[1] === 'X') {
                    i += 2
                }
            }
        }
        const size = Math.floor(len / 2);
        const data = new Data(size);
        --len;
        let hi, lo;
        for (; i < len; i += 2) {
            hi = hex_values[string.charCodeAt(i)];
            lo = hex_values[string.charCodeAt(i + 1)];
            data.push((hi << 4) | lo)
        }
        return data.getBytes()
    };
    const base64_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const base64_values = new Int8Array(128);
    (function(chars, values) {
        for (let i = 0; i < chars.length; ++i) {
            values[chars.charCodeAt(i)] = i
        }
    })(base64_chars, base64_values);
    const base64_encode = function(data) {
        let base64 = '';
        let length = data.length;
        let tail = '';
        const remainder = length % 3;
        if (remainder === 1) {
            length -= 1;
            tail = '=='
        } else if (remainder === 2) {
            length -= 2;
            tail = '='
        }
        let x1, x2, x3;
        let i;
        for (i = 0; i < length; i += 3) {
            x1 = data[i];
            x2 = data[i + 1];
            x3 = data[i + 2];
            base64 += base64_chars.charAt((x1 & 0xFC) >> 2);
            base64 += base64_chars.charAt(((x1 & 0x03) << 4) | ((x2 & 0xF0) >> 4));
            base64 += base64_chars.charAt(((x2 & 0x0F) << 2) | ((x3 & 0xC0) >> 6));
            base64 += base64_chars.charAt(x3 & 0x3F)
        }
        if (remainder === 1) {
            x1 = data[i];
            base64 += base64_chars.charAt((x1 & 0xFC) >> 2);
            base64 += base64_chars.charAt((x1 & 0x03) << 4)
        } else if (remainder === 2) {
            x1 = data[i];
            x2 = data[i + 1];
            base64 += base64_chars.charAt((x1 & 0xFC) >> 2);
            base64 += base64_chars.charAt(((x1 & 0x03) << 4) | ((x2 & 0xF0) >> 4));
            base64 += base64_chars.charAt((x2 & 0x0F) << 2)
        }
        return base64 + tail
    };
    const base64_decode = function(string) {
        const str = string.replace(/[^A-Za-z0-9+\/=]/g, '');
        const length = str.length;
        if ((length % 4) !== 0 || !/^[A-Za-z0-9+\/]+={0,2}$/.test(str)) {
            throw Error('base64 string error: ' + string)
        }
        const array = new Data(length * 3 / 4);
        let ch1, ch2, ch3, ch4;
        let i;
        for (i = 0; i < length; i += 4) {
            ch1 = base64_values[str.charCodeAt(i)];
            ch2 = base64_values[str.charCodeAt(i + 1)];
            ch3 = base64_values[str.charCodeAt(i + 2)];
            ch4 = base64_values[str.charCodeAt(i + 3)];
            array.push(((ch1 & 0x3F) << 2) | ((ch2 & 0x30) >> 4));
            array.push(((ch2 & 0x0F) << 4) | ((ch3 & 0x3C) >> 2));
            array.push(((ch3 & 0x03) << 6) | ((ch4 & 0x3F) >> 0))
        }
        while (str[--i] === '=') {
            array.pop()
        }
        return array.getBytes()
    };
    const coder = function() {};
    ns.Interface(coder, null);
    coder.prototype.encode = function(data) {
        console.assert(false, 'implement me!');
        return null
    };
    coder.prototype.decode = function(string) {
        console.assert(false, 'implement me!');
        return null
    };
    const hex = function() {};
    ns.Class(hex, ns.type.Object, [coder]);
    hex.prototype.encode = function(data) {
        return hex_encode(data)
    };
    hex.prototype.decode = function(str) {
        return hex_decode(str)
    };
    const base64 = function() {};
    ns.Class(base64, ns.type.Object, [coder]);
    base64.prototype.encode = function(data) {
        return base64_encode(data)
    };
    base64.prototype.decode = function(string) {
        return base64_decode(string)
    };
    const base58 = function() {};
    ns.Class(base58, ns.type.Object, [coder]);
    base58.prototype.encode = function(data) {
        console.assert(false, 'Base58 encode not implemented');
        return null
    };
    base58.prototype.decode = function(string) {
        console.assert(false, 'Base58 decode not implemented');
        return null
    };
    const Lib = function(coder) {
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
    ns.format.register('BaseCoder');
    ns.format.register('Hex');
    ns.format.register('Base58');
    ns.format.register('Base64')
})(DIMP);
(function(ns) {
    'use strict';
    const utf8_encode = function(string) {
        const len = string.length;
        const array = new ns.type.Data(len);
        let c, l;
        for (let i = 0; i < len; ++i) {
            c = string.charCodeAt(i);
            if (0xD800 <= c && c <= 0xDBFF) {
                l = string.charCodeAt(++i);
                c = ((c - 0xD800) << 10) + 0x10000 + l - 0xDC00
            }
            if (c <= 0) {
                break
            } else if (c < 0x0080) {
                array.push(c)
            } else if (c < 0x0800) {
                array.push(0xC0 | ((c >> 6) & 0x1F));
                array.push(0x80 | ((c >> 0) & 0x3F))
            } else if (c < 0x10000) {
                array.push(0xE0 | ((c >> 12) & 0x0F));
                array.push(0x80 | ((c >> 6) & 0x3F));
                array.push(0x80 | ((c >> 0) & 0x3F))
            } else {
                array.push(0xF0 | ((c >> 18) & 0x07));
                array.push(0x80 | ((c >> 12) & 0x3F));
                array.push(0x80 | ((c >> 6) & 0x3F));
                array.push(0x80 | ((c >> 0) & 0x3F))
            }
        }
        return array.getBytes()
    };
    const utf8_decode = function(array) {
        let string = '';
        const len = array.length;
        let c, c2, c3, c4;
        for (let i = 0; i < len; ++i) {
            c = array[i];
            switch (c >> 4) {
                case 12:
                case 13:
                    c2 = array[++i];
                    c = ((c & 0x1F) << 6) | (c2 & 0x3F);
                    break;
                case 14:
                    c2 = array[++i];
                    c3 = array[++i];
                    c = ((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
                    break;
                case 15:
                    c2 = array[++i];
                    c3 = array[++i];
                    c4 = array[++i];
                    c = ((c & 0x07) << 18) | ((c2 & 0x3F) << 12) | ((c3 & 0x3F) << 6) | (c4 & 0x3F);
                    break
            }
            if (c < 0x10000) {
                string += String.fromCharCode(c)
            } else {
                c -= 0x10000;
                string += String.fromCharCode((c >> 10) + 0xD800);
                string += String.fromCharCode((c & 0x03FF) + 0xDC00)
            }
        }
        return string
    };
    const parser = function() {};
    ns.Interface(parser, null);
    parser.prototype.encode = function(object) {
        console.assert(false, 'implement me!');
        return null
    };
    parser.prototype.decode = function(data) {
        console.assert(false, 'implement me!');
        return null
    };
    const json = function() {};
    ns.Class(json, ns.type.Object, [parser]);
    json.prototype.encode = function(container) {
        const string = JSON.stringify(container);
        if (!string) {
            throw TypeError('failed to encode JSON object: ' + container);
        }
        return ns.format.UTF8.encode(string)
    };
    json.prototype.decode = function(json) {
        let string;
        if (typeof json === 'string') {
            string = json
        } else {
            string = ns.format.UTF8.decode(json)
        }
        if (!string) {
            throw TypeError('failed to decode JSON data: ' + json);
        }
        return JSON.parse(string)
    };
    const utf8 = function() {};
    ns.Class(utf8, ns.type.Object, [parser]);
    utf8.prototype.encode = utf8_encode;
    utf8.prototype.decode = utf8_decode;
    const Lib = function(parser) {
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
    ns.format.register('DataParser');
    ns.format.register('JSON');
    ns.format.register('UTF8')
})(DIMP);
(function(ns) {
    'use strict';
    const hash = function() {};
    ns.Interface(hash, null);
    hash.prototype.digest = function(data) {
        console.assert(false, 'implement me!');
        return null
    };
    const md5 = function() {};
    ns.Class(md5, ns.type.Object, [hash]);
    md5.prototype.digest = function(data) {
        console.assert(false, 'MD5 not implemented');
        return null
    };
    const sha256 = function() {};
    ns.Class(sha256, ns.type.Object, [hash]);
    sha256.prototype.digest = function(data) {
        console.assert(false, 'SHA256 not implemented');
        return null
    };
    const ripemd160 = function() {};
    ns.Class(ripemd160, ns.type.Object, [hash]);
    ripemd160.prototype.digest = function(data) {
        console.assert(false, 'RIPEMD160 not implemented');
        return null
    };
    const Lib = function(hash) {
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
    ns.digest.register('Hash');
    ns.digest.register('MD5');
    ns.digest.register('SHA256');
    ns.digest.register('RIPEMD160')
})(DIMP);
(function(ns) {
    'use strict';
    const Dictionary = ns.type.Dictionary;
    const CryptographyKey = function(key) {
        Dictionary.call(this, key)
    };
    ns.Class(CryptographyKey, Dictionary, null);
    CryptographyKey.prototype.getData = function() {
        console.assert(false, 'implement me!');
        return null
    };
    CryptographyKey.prototype.getSize = function() {
        console.assert(false, 'implement me!');
        return 0
    };
    CryptographyKey.createInstance = function(clazz, map) {
        if (typeof clazz.getInstance === 'function') {
            return clazz.getInstance(map)
        } else {
            return new clazz(map)
        }
    };
    ns.crypto.CryptographyKey = CryptographyKey
})(DIMP);
(function(ns) {
    'use strict';
    const EncryptKey = function() {};
    ns.Interface(EncryptKey, null);
    EncryptKey.prototype.encrypt = function(plaintext) {
        console.assert(false, 'implement me!');
        return null
    };
    const DecryptKey = function() {};
    ns.Interface(DecryptKey, null);
    DecryptKey.prototype.decrypt = function(ciphertext) {
        console.assert(false, 'implement me!');
        return null
    };
    const SignKey = function() {};
    ns.Interface(SignKey, null);
    SignKey.prototype.sign = function(data) {
        console.assert(false, 'implement me!');
        return null
    };
    const VerifyKey = function() {};
    ns.Interface(VerifyKey, null);
    VerifyKey.prototype.verify = function(data, signature) {
        console.assert(false, 'implement me!');
        return false
    };
    ns.crypto.EncryptKey = EncryptKey;
    ns.crypto.DecryptKey = DecryptKey;
    ns.crypto.SignKey = SignKey;
    ns.crypto.VerifyKey = VerifyKey;
    ns.crypto.register('EncryptKey');
    ns.crypto.register('DecryptKey');
    ns.crypto.register('SignKey');
    ns.crypto.register('VerifyKey')
})(DIMP);
(function(ns) {
    'use strict';
    const UTF8 = ns.format.UTF8;
    const CryptographyKey = ns.crypto.CryptographyKey;
    const EncryptKey = ns.crypto.EncryptKey;
    const DecryptKey = ns.crypto.DecryptKey;
    const promise = UTF8.encode('Moky loves May Lee forever!');
    const SymmetricKey = function(key) {
        CryptographyKey.call(this, key)
    };
    ns.Class(SymmetricKey, CryptographyKey, [EncryptKey, DecryptKey]);
    SymmetricKey.prototype.equals = function(other) {
        const ciphertext = other.encrypt(promise);
        const plaintext = this.decrypt(ciphertext);
        return ns.type.Arrays.equals(promise, plaintext)
    };
    SymmetricKey.generate = function(algorithm) {
        return this.getInstance({
            algorithm: algorithm
        })
    };
    const key_classes = {};
    SymmetricKey.register = function(algorithm, clazz) {
        key_classes[algorithm] = clazz
    };
    SymmetricKey.getInstance = function(key) {
        if (!key) {
            return null
        } else if (key instanceof SymmetricKey) {
            return key
        }
        const algorithm = key['algorithm'];
        const clazz = key_classes[algorithm];
        if (typeof clazz === 'function') {
            return CryptographyKey.createInstance(clazz, key)
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };
    SymmetricKey.AES = 'AES';
    SymmetricKey.DES = 'DES';
    ns.crypto.SymmetricKey = SymmetricKey;
    ns.crypto.register('SymmetricKey')
})(DIMP);
(function(ns) {
    'use strict';
    const CryptographyKey = ns.crypto.CryptographyKey;
    const AsymmetricKey = function(key) {
        CryptographyKey.call(this, key)
    };
    ns.Class(AsymmetricKey, CryptographyKey, null);
    AsymmetricKey.RSA = 'RSA';
    AsymmetricKey.ECC = 'ECC';
    ns.crypto.AsymmetricKey = AsymmetricKey;
    ns.crypto.register('AsymmetricKey')
})(DIMP);
(function(ns) {
    'use strict';
    const UTF8 = ns.format.UTF8;
    const CryptographyKey = ns.crypto.CryptographyKey;
    const AsymmetricKey = ns.crypto.AsymmetricKey;
    const VerifyKey = ns.crypto.VerifyKey;
    const promise = UTF8.encode('Moky loves May Lee forever!');
    const PublicKey = function(key) {
        AsymmetricKey.call(this, key)
    };
    ns.Class(PublicKey, AsymmetricKey, [VerifyKey]);
    PublicKey.prototype.matches = function(privateKey) {
        if (!privateKey) {
            return false
        }
        const publicKey = privateKey.getPublicKey();
        if (this.equals(publicKey)) {
            return true
        }
        const signature = privateKey.sign(promise);
        return this.verify(promise, signature)
    };
    const public_key_classes = {};
    PublicKey.register = function(algorithm, clazz) {
        public_key_classes[algorithm] = clazz
    };
    PublicKey.getInstance = function(key) {
        if (!key) {
            return null
        } else if (key instanceof PublicKey) {
            return key
        }
        const algorithm = key['algorithm'];
        const clazz = public_key_classes[algorithm];
        if (typeof clazz === 'function') {
            return CryptographyKey.createInstance(clazz, key)
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };
    ns.crypto.PublicKey = PublicKey;
    ns.crypto.register('PublicKey')
})(DIMP);
(function(ns) {
    'use strict';
    const CryptographyKey = ns.crypto.CryptographyKey;
    const AsymmetricKey = ns.crypto.AsymmetricKey;
    const SignKey = ns.crypto.SignKey;
    const PrivateKey = function(key) {
        AsymmetricKey.call(this, key)
    };
    ns.Class(PrivateKey, AsymmetricKey, [SignKey]);
    PrivateKey.prototype.equals = function(other) {
        const publicKey = this.getPublicKey();
        if (!publicKey) {
            return false
        }
        return publicKey.matches(other)
    };
    PrivateKey.prototype.getPublicKey = function() {
        console.assert(false, 'implement me!');
        return null
    };
    PrivateKey.generate = function(algorithm) {
        return this.getInstance({
            algorithm: algorithm
        })
    };
    const private_key_classes = {};
    PrivateKey.register = function(algorithm, clazz) {
        private_key_classes[algorithm] = clazz
    };
    PrivateKey.getInstance = function(key) {
        if (!key) {
            return null
        } else if (key instanceof PrivateKey) {
            return key
        }
        const algorithm = key['algorithm'];
        const clazz = private_key_classes[algorithm];
        if (typeof clazz === 'function') {
            return CryptographyKey.createInstance(clazz, key)
        }
        throw TypeError('key algorithm error: ' + algorithm);
    };
    ns.crypto.PrivateKey = PrivateKey;
    ns.crypto.register('PrivateKey')
})(DIMP);
