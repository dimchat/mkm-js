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

//! require 'data.js'

(function (ns) {
    'use strict';

    const Arrays = ns.type.Arrays;

    /**
     *  Mutable Data View
     */
    const bytes = ns.type.Data;
    const adjust = bytes.adjust;

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
     * @param {int}    value
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
    };

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

})(DIMP);
