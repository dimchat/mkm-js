;
// license: https://mit-license.org
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2020 Albert Moky
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// =============================================================================
//

//! require 'object.js'

!function (ns) {
    'use strict';

    const Arrays = ns.type.Arrays;

    /**
     *  Create data bytes with capacity, or another data bytes
     *
     *  Usages:
     *      1. new Data();
     *      2. new Data(capacity);
     *      3. new Data(other);
     *      4. new Data(buffer);
     *      5. new Data(buffer, offset, length);
     */
    const bytes = function () {
        ns.type.Object.call(this);
        if (arguments.length === 0) {
            // 1. default capacity
            this.buffer = new Uint8Array(4);
            this.offset = 0;
            this.length = 0;
        } else if (arguments.length === 1) {
            const arg = arguments[0];
            if (typeof arg === 'number') {
                // 2. create empty buffer with capacity
                this.buffer = new Uint8Array(arg);
                this.offset = 0;
                this.length = 0;
            } else if (arg instanceof bytes) {
                // 3. create from another object
                // (this will share the same ArrayBuffer)
                this.buffer = arg.buffer;
                this.offset = arg.buffer;
                this.length = arg.length;
            } else {
                // 4. create with another array
                if (arg instanceof Uint8Array) {
                    this.buffer = arg;
                } else {
                    this.buffer = new Uint8Array(arg);
                }
                this.offset = 0;
                this.length = arg.length;
            }
        } else if (arguments.length === 3) {
            // 5. create with another array, and offset, length
            this.buffer = arguments[0];
            this.offset = arguments[1];
            this.length = arguments[2];
        } else {
            this.buffer = null;
            this.offset = 0;
            this.length = 0;
            throw SyntaxError('arguments error: ' + arguments);
        }
    };
    ns.Class(bytes, ns.type.Object, null);

    bytes.ZERO = new bytes(null, 0, 0);

    /**
     *  Check whether bytes equal
     *
     * @param {bytes|Uint8Array|Array} other - another array
     * @returns {boolean}
     */
    bytes.prototype.equals = function (other) {
        if (!other || other.length === 0) {
            // empty array
            return this.length === 0;
        } else if (this === other) {
            // same object
            return true;
        }
        let otherBuffer, otherOffset, otherLength;
        if (other instanceof bytes) {
            otherBuffer = other.buffer;
            otherOffset = other.offset;
            otherLength = other.length;
        } else {  // if (other instanceof Array)
            otherBuffer = other;
            otherOffset = 0;
            otherLength = other.length;
        }
        // pre-checking
        if (this.length !== otherLength) {
            return false;
        } else if (this.buffer === otherBuffer && this.offset === otherOffset) {
            return true;
        }
        // check items one by one
        const buffer = this.buffer;
        let pos1 = this.offset + this.length - 1;
        let pos2 = otherOffset + otherLength - 1;
        for (; pos2 >= otherOffset; --pos1, --pos2) {
            if (buffer[pos1] !== otherBuffer[pos2]) {
                return false;
            }
        }
        return true;
    };

    // adjust the position within range [0, len)
    const adjust = function (pos, len) {
        if (pos < 0) {
            pos += len;    // count from right hand
            if (pos < 0) {
                return 0;  // too small
            }
        } else if (pos > len) {
            return len;    // too big
        }
        return pos;
    };

    //
    //  Searching
    //

    /**
     *  Search value in range [start, end)
     *
     * @param {int} value - element value
     * @param {int} start - start position (include)
     * @param {int} end   - end position (exclude)
     * @returns -1 on not found
     */
    const find_value = function (value, start, end) {
        // adjust position
        start += this.offset;
        end += this.offset;
        for (; start < end; ++start) {
            if (this.buffer[start] === value) {
                // got it
                return start - this.offset;
            }
        }
        return -1;
    };

    /**
     *  Search sub data in range [start, end)
     *
     * @param {bytes} sub - sub data
     * @param {int} start - start position (include)
     * @param {int} end   - end position (exclude)
     * @returns -1 on not found
     */
    const find_sub = function (sub, start, end) {
        if ((end - start) < sub.length) {
            return -1;
        }
        start += this.offset;
        end += this.offset - sub.length + 1;
        if (this.buffer === sub.buffer) {
            // same buffer
            if (start === sub.offset) {
                return start - this.offset;
            }
            // NOTICE: if (start < sub.offset < end), then the position (sub.offset - this.offset) is right,
            //         but we cannot confirm this is the first position it appeared,
            //         so we still need to do searching.
        }
        let index;
        for (; start < end; ++start) {
            for (index = 0; index < sub.length; ++index) {
                if (this.buffer[start + index] !== sub.buffer[sub.offset + index]) {
                    // not match
                    break;
                }
            }
            if (index === sub.length) {
                // got it
                return start - this.offset;
            }
        }
        return -1;
    };

    /**
     *  Find item value or sub bytes
     *
     *  Usages:
     *      1. find(value);
     *      2. find(value, start);
     *      3. find(value, start, end);
     *      4. find(sub);
     *      5. find(sub, start);
     *      6. find(sub, start, end);
     *
     * @returns -1 on not found
     */
    bytes.prototype.find = function () {
        let sub, start, end;
        if (arguments.length === 1) {
            sub = arguments[0];
            start = 0;
            end = this.length;
        } else if (arguments.length === 2) {
            sub = arguments[0];
            start = arguments[1];
            end = this.length;
            start = adjust(start, this.length);
        } else if (arguments.length === 3) {
            sub = arguments[0];
            start = arguments[1];
            end = arguments[2];
            start = adjust(start, this.length);
            end = adjust(end, this.length);
        } else {
            throw SyntaxError('arguments error: ' + arguments);
        }
        if (typeof sub === 'number') {
            return find_value.call(this, sub & 0xFF, start, end);
        } else if (sub instanceof bytes) {
            return find_sub.call(this, sub, start, end);
        } else {
            return find_sub.call(this, new bytes(sub), start, end);
        }
    };

    /**
     *  Get value with index
     *
     * @param {Number} index
     * @returns {char}
     */
    bytes.prototype.getByte = function (index) {
        // check position
        if (index < 0) {
            index += this.length;
            if (index < 0) {
                throw RangeError('error index: ' + (index - this.length) + ', length: ' + this.length);
            }
        } else if (index >= this.length) {
            throw RangeError('error index: ' + index + ', length: ' + this.length);
        }
        return this.buffer[this.offset + index];
    };

    /**
     *  Get bytes within range [start, end)
     *
     * @param {int} start - start position (include)
     * @param {int} end   - end position (exclude)
     * @returns {Uint8Array} sub bytes
     */
    const get_bytes = function (start, end) {
        start += this.offset;
        end += this.offset;
        // check range
        if (start === 0 && end === this.buffer.length) {
            // who buffer
            return this.buffer;
        } else if (start < end) {
            // sub view
            this.buffer.subarray(start, end);
        } else {
            // empty buffer
            return this.ZERO.getBytes();
        }
    };

    /**
     *  Get bytes within range [start, end)
     *
     *  Usages:
     *      1. getBytes();
     *      2. getBytes(start);
     *      3. getBytes(start, end);
     *
     * @returns {Uint8Array}
     */
    bytes.prototype.getBytes = function () {
        let start, end;
        if (arguments.length === 0) {
            start = 0;
            end = this.length;
        } else if (arguments.length === 1) {
            start = arguments[0];
            end = this.length;
            start = adjust(start, this.length);
        } else if (arguments.length === 2) {
            start = arguments[0];
            end = arguments[1];
            start = adjust(start, this.length);
            end = adjust(end, this.length);
        } else {
            throw SyntaxError('arguments error: ' + arguments);
        }
        return get_bytes.call(this, start, end);
    };

    /**
     *  Get sub data within range [start, end)
     *
     *  Usages:
     *      1. slice(start);
     *      2. slice(start, end);
     *
     * @returns {bytes}
     */
    bytes.prototype.slice = function (start) {
        let end;
        if (arguments.length === 2) {
            end = arguments[1];
            end = adjust(end, this.length);
        } else {
            end = this.length;
        }
        start = adjust(start, this.length);
        return slice(this, start, end);
    };

    const slice = function (data, start, end) {
        if (start === 0 && end === data.length) {
            // whole data
            return data;
        } else if (start < end) {
            // sub view
            return new bytes(data.buffer, data.offset + start, end - start);
        } else {
            // error
            return bytes.ZERO;
        }
    };

    /**
     *  Combines two or more data.
     *
     *  Usages:
     *      1. concat(other);
     *      2. concat(other1, other2, ...);
     *
     * @returns {bytes}
     */
    bytes.prototype.concat = function () {
        let result = this;
        let arg, other;
        for (let i = 0; i < arguments.length; ++i) {
            arg = arguments[i];
            if (arg instanceof bytes) {
                other = arg;
            } else {
                other = new bytes(arg);
            }
            result = concat(result, other);
        }
        return result;
    };

    const concat = function (left, right) {
        if (left.length === 0) {
            return right;
        } else if (right.length === 0) {
            return left;
        } else if (left.buffer === right.buffer && (left.offset + left.length) === right.offset) {
            // sticky data
            return new bytes(left.buffer, left.offset, left.length + right.length);
        } else {
            const joined = new Uint8Array(left.length + right.length);
            Arrays.copy(left.buffer, left.offset, joined, 0, left.length);
            Arrays.copy(right.buffer, right.offset, joined, left.length, right.length);
            return new bytes(joined, 0, joined.length);
        }
    };

    /**
     *  Clone data
     *
     * @returns {bytes}
     */
    bytes.prototype.copy = function () {
        return new bytes(this.buffer, this.offset, this.length);
    };

    bytes.prototype.mutableCopy = function () {
        let buffer = this.getBytes();
        buffer = new Uint8Array(buffer);
        return new bytes(buffer, 0, buffer.length);
    };

    /**
     *  Convert Uint8Array to Array
     *
     * @returns {Number[]}
     */
    bytes.prototype.toArray = function () {
        const array = this.getBytes();
        if (typeof Array.from === 'function') {
            return Array.from(array);
        } else {
            return [].slice.call(array);
        }
    };

    //-------- namespace --------
    ns.type.Data = bytes;

    ns.type.register('Data');

// }(DIMP);
//
// !function (ns) {
//     'use strict';
//
//     /**
//      *  Mutable Data View
//      */
//     const bytes = ns.type.Data;

    bytes.prototype.getCapacity = function () {
        return this.buffer.length - this.offset;
    };

    const resize = function (size) {
        const bigger = new Uint8Array(size);
        Arrays.copy(this.buffer, this.offset, bigger, 0, this.length);
        this.buffer = bigger;
        this.offset = 0;
    };

    const expand = function () {
        const capacity = this.getCapacity();
        if (capacity > 4) {
            resize.call(this, capacity << 1);
        } else {
            resize.call(this, 8);
        }
    };

    /**
     *  Set value with index
     *
     * @param {Number} index
     * @param {char}   value
     */
    bytes.prototype.setByte = function (index, value) {
        // adjust position
        if (index < 0) {
            index += this.length;  // count from right hand
            if (index < 0) {
                return false;      // too small
                //throw RangeError('error index: ' + (index - this.length) + ', length: ' + this.length);
            }
        }
        // check position
        if (index >= this.length) {
            // target position is out of range [offset, offset + length)
            // check empty spaces on the right
            if (this.offset + index >= this.buffer.length) {
                // empty spaces on the right not enough
                // check empty spaces on the left
                if (index < this.buffer.length) {
                    // move all data left
                    Arrays.copy(this.buffer, this.offset, this.buffer, 0, this.length);
                    this.offset = 0;
                } else {
                    // current space not enough, expand it
                    resize.call(this, index + 1);
                }
            }
            // TODO: fill range [offset + length, offset + index) with ZERO?
            this.length = index + 1;
        }
        this.buffer[this.offset + index] = value & 0xFF;
        return true;
    };

    /**
     *  Copy values from source buffer with range [start, end)
     *
     * @param {int} pos           - copy to self buffer from this position
     * @param {Uint8Array} source - source buffer
     * @param {int} start         - source start position (include)
     * @param {int} end           - source end position (exclude)
     */
    const copy_buffer = function (pos, source, start, end) {
        // adjust position
        if (pos < 0) {
            pos += this.length;  // count from right hand
            if (pos < 0) {
                throw RangeError('error position: ' + (pos - this.length) + ', length: ' + this.length);
            }
        }
        const copyLen = end - start;
        if (copyLen > 0) {
            const destPos = this.offset + pos;
            const copyEnd = pos + copyLen;  // relative to offset
            if (source !== this.buffer || destPos !== start) {
                // not sticky data
                if (this.getCapacity() < copyEnd) {
                    // expend the buffer to this size
                    resize.call(this, copyEnd);
                }
                // copy buffer
                Arrays.copy(source, start, this.buffer, 0, copyLen);
            }
            // reset view length
            if (copyEnd > this.length) {
                this.length = copyEnd;
            }
        }
    };

    bytes.prototype.fill = function (pos, source) {
        let data, start, end;
        if (source instanceof bytes) {
            data = source;
        } else {
            data = new bytes(source);
        }
        if (arguments.length === 4) {
            // fill(pos, source, start, end);
            start = arguments[2];
            end = arguments[3];
            start = adjust(start, data.length);
            end = adjust(end, data.length);
        } else if (arguments.length === 3) {
            // fill(pos, source, start);
            start = arguments[2];
            end = data.length;
            start = adjust(start, data.length);
        } else {
            // fill(pos, source);
            start = 0;
            end = data.length;
        }
        copy_buffer.call(this, pos, data, start, end);
    };

    //
    //  Expanding
    //

    /**
     *  Insert the value to this position
     *
     * @param {int}  index - position
     * @param {char} value - value
     * @return false for ArrayIndexOutOfBoundsException
     */
    bytes.prototype.insert = function (index, value) {
        // check position
        if (index < 0) {
            index += this.length;  // count from right hand
            if (index < 0) {
                return false;      // too small
                //throw RangeError('error index: ' + (index - this.length) + ', length: ' + this.length);
            }
        }
        if (index >= this.length) {
            // target position is out of range [offset, offset + length)
            // set it directly
            return this.setByte(index, value);
        }
        if (index === 0) {
            // insert to the head
            if (this.offset > 0) {
                // empty spaces exist before the queue, no need to move elements
                this.offset -= 1;
            } else {
                // no empty space before the queue
                if (this.length === this.buffer.length) {
                    // the buffer is full, expand it
                    expand.call(this);
                }
                // move the queue to right
                Arrays.copy(this.buffer, 0, this.buffer, 1, this.length);
            }
        } else if (index < (this.length >> 1)) {
            // target position is near the head
            if (this.offset > 0) {
                // empty spaces found before the queue, move left part
                Arrays.copy(this.buffer, this.offset, this.buffer, this.offset - 1, index);
                this.offset -= 1;
            } else {
                if ((this.offset + this.length) === this.buffer.length) {
                    // the space is full, expand it
                    expand.call(this);
                }
                // move right part
                Arrays.copy(this.buffer, this.offset + index,
                    this.buffer, this.offset + index + 1, this.length - index);
            }
        } else {
            // target position is near the tail
            if ((this.offset + this.length) < this.buffer.length) {
                // empty spaces found after the queue, move right part
                Arrays.copy(this.buffer, this.offset + index,
                    this.buffer, this.offset + index + 1, this.length - index);
            } else if (this.offset > 0) {
                // empty spaces found before the queue, move left part
                Arrays.copy(this.buffer, this.offset, this.buffer, this.offset - 1, index);
                this.offset -= 1;
            } else {
                // the space is full, expand it
                expand.call(this);
                // move right part
                Arrays.copy(this.buffer, this.offset + index,
                    this.buffer, this.offset + index + 1, this.length - index);
            }
        }
        this.buffer[this.offset + index] = value & 0xFF;
        this.length += 1;
        return true;
    }

    const add_item = function (value) {
        const pos = this.offset + this.length;
        if (pos >= this.buffer.length) {
            // expand the inner array
            expand.call(this, this.length << 1);
        }
        this.buffer[this.offset + this.length] = value;
        ++this.length;
    };
    const add_array = function (array) {
        if (!array) {
            return;
        }
        let size = array.length;
        if (size < 1) {
            return;
        }
        size += this.length;
        let capacity = this.buffer.length - this.offset;
        if (size > capacity) {
            // expand the inner array
            while (capacity < size) {
                capacity = capacity << 1;
            }
            expand.call(this, capacity);
        }
        Arrays.copy(array, 0, this.buffer, this.offset + this.length, array.length);
        this.length = size;
    };

    /**
     *  Appends new elements to an array, and returns the new length of the array.
     *
     * @param {Number|bytes|Uint8Array|Number[]} items - New elements of the Array.
     * @returns {number}
     */
    bytes.prototype.push = function (items) {
        if (typeof items === 'number') {
            add_item.call(this, items);
        } else {
            let array;
            if (items instanceof Uint8Array) {
                array = items;
            } else if (items instanceof bytes) {
                array = items.getBytes();
            } else {
                // try to convert array
                array = new Uint8Array(items);
            }
            add_array.call(this, array);
        }
        return this.length;
    };

    /**
     *  Removes the last element from an array and returns it.
     *
     * @returns {char}
     */
    bytes.prototype.pop = function () {
        if (this.length < 1) {
            throw RangeError('bytes empty');
        }
        this.length -= 1;
        return this.buffer[this.offset + this.length];
    };

    //-------- namespace --------
    ns.type.MutableData = bytes;

    ns.type.register('MutableData');

}(DIMP);
