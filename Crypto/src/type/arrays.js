;
// license: https://mit-license.org
//
//  MONKEY: Memory Object aNd KEYs
//
//                               Written in 2020 by Moky <albert.moky@gmail.com>
//
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

(function (ns) {
    'use strict';

    var is_array = function (obj) {
        if (obj instanceof Array) {
            return true;
        } else if (obj instanceof Uint8Array) {
            return true;
        } else if (obj instanceof Int8Array) {
            return true;
        } else if (obj instanceof Uint8ClampedArray) {
            return true;
        } else if (obj instanceof Uint16Array) {
            return true;
        } else if (obj instanceof Int16Array) {
            return true;
        } else if (obj instanceof Uint32Array) {
            return true;
        } else if (obj instanceof Int32Array) {
            return true;
        } else if (obj instanceof Float32Array) {
            return true;
        } else if (obj instanceof Float64Array) {
            return true;
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
            if (!objects_equal(dict1[k], dict2[k])) {
                return false;
            }
        }
        return true;
    };

    var objects_equal = function (obj1, obj2) {
        // compare directly
        if (obj1 === obj2) {
            return true; // same objects
        } else if (!obj1) {
            return !obj2; // object1 is undefined but object2 is not
        } else if (!obj2) {
            return false; // object2 is undefined but object1 is not
        } else if (typeof obj1 === 'string' || typeof obj2 === 'string') {
            return false; // obj1 === obj2;
        } else if (typeof obj1['equals'] === 'function') {
            return obj1.equals(obj2);
        } else if (typeof obj2['equals'] === 'function') {
            return obj2.equals(obj1);
        }
        // check array
        if (is_array(obj1)) {
            if (is_array(obj2)) {
                // compare as array
                return arrays_equal(obj1, obj2);
            } else {
                return false;
            }
        } else if (is_array(obj2)) {
            return false;
        }
        // compare as dictionary
        return maps_equal(obj1, obj2);
    };

    /**
     *  Copy array
     *
     * @param {Uint8Array} src
     * @param {int}        srcPos
     * @param {Uint8Array} dest
     * @param {int}        destPos
     * @param {int}        length
     */
    var copy_items = function (src, srcPos, dest, destPos, length) {
        if (srcPos !== 0 || length !== src.length) {
            src = src.subarray(srcPos, srcPos + length);
        }
        dest.set(src, destPos);
    };

    /**
     *  Insert the item in the position of array,
     *  all items after this position (includes) will be moved
     *
     * @param {[]} array
     * @param {Number} index
     * @param {*} item
     * @return {boolean}
     */
    var insert_item = function (array, index, item) {
        if (index < 0) {
            // for update the same position after inserted,
            // here should add 1 because array.length increased
            index += array.length + 1;
            if (index < 0) {
                return false;
            }
        }
        if (index === 0) {
            // insert to head
            array.unshift(item);
        } else if (index === array.length) {
            // push to tail
            array.push(item);
        } else if (index > array.length) {
            // NOTICE: this function will skip empty spaces
            array[index] = item;
        } else {
            // NOTICE: this will push the item to tail if index > array.length
            array.splice(index, 0, item);
        }
        return true;
    };

    /**
     *  Update the position of array with item
     *
     * @param {[]} array
     * @param {Number} index
     * @param {*} item
     * @return {boolean}
     */
    var update_item = function (array, index, item) {
        if (index < 0) {
            index += array.length;
            if (index < 0) {
                return false;
            }
        }
        // skip empty spaces
        array[index] = item;
        return true;
    };

    /**
     *  Remove the item from array
     *
     * @param {[]} array
     * @param {*} item
     * @return {boolean}
     */
    var remove_item = function (array, item) {
        var index = array.indexOf(item);
        if (index < 0/* || index >= array.length*/) {
            return false;
        } else if (index === 0) {
            // remove head
            array.shift();
        } else if ((index+1) === array.length) {
            // remove tail
            array.pop();
        } else {
            array.splice(index, 1);
        }
        return true;
    };

    //-------- namespace --------
    ns.type.Arrays = {
        insert: insert_item,
        update: update_item,
        remove: remove_item,
        equals: objects_equal,
        isArray: is_array,
        copy: copy_items
    };

    ns.type.register('Arrays');

})(MONKEY);
