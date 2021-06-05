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

    var Arrays = ns.type.Arrays;

    /**
     *  Mutable Data View
     */
    var bytes = ns.type.Data;
    var adjust = bytes.adjust;

    var resize = function (size) {
        var bigger = new Uint8Array(size);
        Arrays.copy(this.buffer, this.offset, bigger, 0, this.length);
        this.buffer = bigger;
        this.offset = 0;
    };

    var expand = function () {
        var capacity = this.buffer.length - this.offset;
        if (capacity > 4) {
            resize.call(this, capacity << 1);
        } else {
            resize.call(this, 8);
        }
    };

    /**
     *  Set value with index
     *
     * @param {int}  index
     * @param {uint} value
     */
    bytes.prototype.setByte = function (index, value) {
        // adjust position
        if (index < 0) {
            index += this.length;  // count from right hand
            if (index < 0) {
                return false;      // too small
                //throw new RangeError('error index: ' + (index - this.length) + ', length: ' + this.length);
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
     * @param {bytes} data        - self
     * @param {int} pos           - copy to self buffer from this position
     * @param {Uint8Array} source - source buffer
     * @param {int} start         - source start position (include)
     * @param {int} end           - source end position (exclude)
     */
    var copy_buffer = function (data, pos, source, start, end) {
        var copyLen = end - start;
        if (copyLen > 0) {
            var copyEnd = pos + copyLen;  // relative to offset
            if (source !== data.buffer || (data.offset + pos) !== start) {
                // not sticky data
                if (data.offset + copyEnd > data.buffer.length) {
                    // expend the buffer to this size
                    resize.call(data, copyEnd);
                }
                // copy buffer
                Arrays.copy(source, start, data.buffer, data.offset + pos, copyLen);
            }
            // reset view length
            if (copyEnd > data.length) {
                data.length = copyEnd;
            }
        }
    };

    /**
     *  Copy data from source to position
     *
     *  Usages:
     *      1. fill(pos, bytes);
     *      2. fill(pos, bytes, start);
     *      3. fill(pos, bytes, start, end);
     *
     * @param pos    - self position to copy data
     * @param source - data source
     */
    bytes.prototype.fill = function (pos, source) {
        if (pos < 0) {
            pos += this.length;  // count from right hand
            if (pos < 0) {
                throw new RangeError('error position: ' + (pos - this.length) + ', length: ' + this.length);
            }
        }
        var start, end;
        if (arguments.length === 4) {
            // fill(pos, source, start, end);
            start = arguments[2];
            end = arguments[3];
            start = adjust(start, source.length);
            end = adjust(end, source.length);
        } else if (arguments.length === 3) {
            // fill(pos, source, start);
            start = arguments[2];
            end = source.length;
            start = adjust(start, source.length);
        } else {
            // fill(pos, source);
            start = 0;
            end = source.length;
        }
        if (source instanceof bytes) {
            copy_buffer(this, pos, source.buffer, source.offset + start, source.offset + end);
        } else {
            copy_buffer(this, pos, source, start, end);
        }
    };

    //
    //  Expanding
    //

    /**
     *  Append data from source
     *
     *  Usages:
     *      1. append(bytes);
     *      2. append(bytes, start);
     *      3. append(bytes, start, end);
     *      4. append(bytes1, bytes2, ...);
     *
     * @param source - data source
     */
    bytes.prototype.append = function (source) {
        if (arguments.length > 1 && typeof arguments[1] !== 'number') {
            // append(bytes1, bytes2, ...);
            for (var i = 0; i < arguments.length; ++i) {
                this.append(arguments[i]);
            }
            return
        }
        var start, end;
        if (arguments.length === 3) {
            // append(bytes, start, end);
            start = arguments[1];
            end = arguments[2];
            start = adjust(start, source.length);
            end = adjust(end, source.length);
        } else if (arguments.length === 2) {
            // append(bytes, start);
            start = arguments[1];
            end = source.length;
            start = adjust(start, source.length);
        } else {
            // append(bytes);
            start = 0;
            end = source.length;
        }
        if (source instanceof bytes) {
            copy_buffer(this, this.length, source.buffer, source.offset + start, source.offset + end);
        } else {
            copy_buffer(this, this.length, source, start, end);
        }
    };

    /**
     *  Insert the value to this position
     *
     * @param {int}  index - position
     * @param {uint} value - value
     * @return false for ArrayIndexOutOfBoundsException
     */
    bytes.prototype.insert = function (index, value) {
        // check position
        if (index < 0) {
            index += this.length;  // count from right hand
            if (index < 0) {
                return false;      // too small
                //throw new RangeError('error index: ' + (index - this.length) + ', length: ' + this.length);
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

    //
    //  Erasing
    //

    /**
     *  Remove element at this position and return its value
     *
     * @param {int} index - position
     * @return {uint} value removed
     * @throws RangeError on error
     */
    bytes.prototype.remove = function (index) {
        // adjust position
        if (index < 0) {
            index += this.length;  // count from right hand
            if (index < 0) {       // too small
                throw new RangeError('error index: ' + (index - this.length) + ', length: ' + this.length);
            }
        } else if (index >= this.length) {  // too big
            throw new RangeError('index error: ' + index + ', length: ' + this.length);
        }
        if (index === 0) {
            // remove the first element
            return this.shift();
        } else if (index === (this.length - 1)) {
            // remove the last element
            return this.pop();
        }
        // remove inside element
        var erased = this.buffer[this.offset + index];
        if (index < (this.length >> 1)) {
            // target position is near the head, move the left part
            Arrays.copy(this.buffer, this.offset, this.buffer, this.offset + 1, index);
        } else {
            // target position is near the tail, move the right part
            Arrays.copy(this.buffer, this.offset + index + 1,
                this.buffer, this.offset + index, this.length - index - 1);
        }
        return erased;
    };

    /**
     *  Remove element from the head position and return its value
     *
     * @return {uint} value (removed) at the first place
     * @throws RangeError on data empty
     */
    bytes.prototype.shift = function () {
        if (this.length < 1) {
            throw new RangeError('data empty!');
        }
        var erased = this.buffer[this.offset];
        this.offset += 1;
        this.length -= 1;
        return erased;
    };

    /**
     *  Remove element from the tail position and return its value
     *
     * @return {uint} value (removed) at the last place
     * @throws RangeError on data empty
     */
    bytes.prototype.pop = function () {
        if (this.length < 1) {
            throw new RangeError('data empty!');
        }
        this.length -= 1;
        return this.buffer[this.offset + this.length];
    };

    /**
     *  Append the element to the tail
     *
     * @param {uint} element - new item value
     */
    bytes.prototype.push = function (element) {
        this.setByte(this.length, element);
    };

    //-------- namespace --------
    ns.type.MutableData = bytes;

    ns.type.register('MutableData');

})(DIMP);
