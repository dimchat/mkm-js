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
     *  Create data bytes with capacity length, or another data bytes
     *
     * @param length - capacity
     */
    var bytes = function (length) {
        ns.type.Object.call(this);
        var value = length ? arguments[0] : 0;
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
    ns.type.Class(bytes, ns.type.Object);

    /**
     *  Get inner array
     *
     * @param copy
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
    bytes.prototype.getByte = function (index) {
        if (index < this.length) {
            return this.array[index];
        } else {
            return 0;
        }
    };
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

    var add_one = function (value) {
        if (this.length >= this.array.length) {
            // expand the inner array
            expand.call(this, this.length * 2);
        }
        this.array[this.length] = value;
        ++this.length;
    };
    bytes.prototype.push = function (value) {
        if (typeof value === 'number') {
            add_one.call(this, value);
            return;
        }
        var array;
        if (value instanceof Uint8Array) {
            array = value;
        } else if (value instanceof bytes) {
            array = value.getBytes();
        } else {
            // try to convert array
            array = new Uint8Array(value);
        }
        for (var i = 0; i < array.length; ++i) {
            add_one.call(this, array[i]);
        }
    };
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
     *  Convert Uint8Array to Array
     *
     * @returns {int[]}
     */
    bytes.prototype.toArray = function () {
        if (typeof Array.from === 'function') {
            return Array.from(this.array);
        } else {
            return [].slice.call(this.array);
        }
    };

    bytes.from = function (array) {
        return new bytes(array);
    };

    //-------- namespace --------
    ns.type.Data = bytes;

    ns.type.register('Data');

}(DIMP);
