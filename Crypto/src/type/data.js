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

//! require 'class.js'

!function (ns) {
    'use strict';

    /**
     *  Create data bytes with capacity, or another data bytes
     *
     * @param {Number|bytes|Uint8Array|Number[]} capacity - capacity or data array
     */
    var bytes = function (capacity) {
        ns.type.Object.call(this);
        var value = capacity ? arguments[0] : 0;
        if (typeof value === 'number') {
            // create empty array with capacity
            if (value < 1) {
                value = 1;
            }
            this.array = new Uint8Array(value);
            this.length = 0;
        } else if (value instanceof bytes) {
            // create from another object
            // this will share the same ArrayBuffer
            this.array = value.array;
            this.length = value.length;
        } else if (value instanceof Uint8Array) {
            // create with another array
            // this will share the same ArrayBuffer
            this.array = value;
            this.length = value.length;
        } else {
            // try to convert array
            value = new Uint8Array(value);
            this.array = value;
            this.length = value.length;
        }
    };
    ns.Class(bytes, ns.type.Object, null);

    /**
     *  Check whether bytes equal
     *
     * @param {bytes|Uint8Array|Array} other - another array
     * @returns {boolean}
     */
    bytes.prototype.equals = function (other) {
        if (!other) {
            // empty array
            return this.length === 0;
        // } else if (ns.type.Object.prototype.equals.call(this, other)) {
        //     return true;
        } else if (other instanceof bytes) {
            if (this.length !== other.length) {
                // check before get bytes
                return false;
            } else if (this.array === other.array) {
                // same object
                return true;
            }
            return ns.type.Arrays.equals(this.getBytes(false), other.getBytes(false));
        // } else if (other instanceof Uint8Array) {
        //     return ns.type.Arrays.equals(this.getBytes(), other);
        } else {
            // // try to convert to Uint8Array
            // other = new Uint8Array(other);
            return ns.type.Arrays.equals(this.getBytes(false), other);
        }
    };

    /**
     *  Get inner array
     *
     * @param {boolean} copy - whether copy data to new buffer
     * @returns {Uint8Array}
     */
    bytes.prototype.getBytes = function (copy) {
        if (this.length < 1) {
            return null;
        }
        var view;
        if (this.length === this.array.length) {
            view = this.array;
        } else {
            view = this.array.subarray(0, this.length);
        }
        if (copy) {
            var array = new Uint8Array(this.length);
            array.set(view);
            return array;
        } else {
            return view;
        }
    };

    /**
     *  Get value with index
     *
     * @param {Number} index
     * @returns {uint}
     */
    bytes.prototype.getByte = function (index) {
        if (index < this.length) {
            return this.array[index];
        } else {
            return 0;
        }
    };
    /**
     *  Set value with index
     *
     * @param {Number} index
     * @param {uint} value
     */
    bytes.prototype.setByte = function (index, value) {
        if (index >= this.array.length) {
            // expand the inner array
            expand.call(this, index + 1);
        }
        this.array[index] = value;
        if (index >= this.length) {
            this.length = index + 1;
        }
    };

    var expand = function (size) {
        var bigger = new Uint8Array(size);
        bigger.set(this.array);
        this.array = bigger;
    };

    var add_item = function (value) {
        if (this.length >= this.array.length) {
            // expand the inner array
            expand.call(this, this.length << 1);
        }
        this.array[this.length] = value;
        ++this.length;
    };
    var add_array = function (array) {
        if (!array) {
            return;
        }
        var size = array.length;
        if (size < 1) {
            return;
        }
        size += this.length;
        var capacity = this.array.length;
        if (size > capacity) {
            // expand the inner array
            while (capacity < size) {
                capacity = capacity << 1;
            }
            expand.call(this, capacity);
        }
        this.array.set(array, this.length);
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
            var array;
            if (items instanceof Uint8Array) {
                array = items;
            } else if (items instanceof bytes) {
                array = items.getBytes(false);
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
     * @returns {uint}
     */
    bytes.prototype.pop = function () {
        if (this.length < 1) {
            throw RangeError('bytes empty');
        }
        this.length -= 1;
        var last = this.array[this.length];
        this.array[this.length] = 0; // erase it
        return last;
    };

    /**
     *  Clone bytes
     *
     * @returns {bytes}
     */
    bytes.prototype.copy = function () {
        return new bytes(this.getBytes(true));
    };

    /**
     *  Combines two or more arrays.
     *
     * @param {bytes|Uint8Array|Number[]} items - Additional items to add to the end of new array.
     * @returns {bytes}
     */
    bytes.prototype.concat = function (items) {
        var clone = this.copy();
        for (var i = 0; i < arguments.length; ++i) {
            clone.push(arguments[i]);
        }
        return clone;
    };

    /**
     *  Convert Uint8Array to Array
     *
     * @returns {Number[]}
     */
    bytes.prototype.toArray = function () {
        var array = this.getBytes(false);
        if (typeof Array.from === 'function') {
            return Array.from(array);
        } else {
            return [].slice.call(array);
        }
    };

    /**
     *  Creates bytes from an array-like or iterable object.
     *
     * @param {Uint8Array|Number[]} array - An array-like or iterable object to convert to Uint8Array.
     * @returns {bytes}
     */
    bytes.from = function (array) {
        return new bytes(array);
    };

    //-------- namespace --------
    ns.type.Data = bytes;

    ns.type.register('Data');

}(DIMP);
