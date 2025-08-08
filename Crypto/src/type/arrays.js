'use strict';
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

var is_array = function (obj) {
    return obj instanceof Array || is_number_array(obj);
};

var is_number_array = function (obj) {
    if (obj instanceof Uint8ClampedArray) {
        return true;
    } else if (obj instanceof Uint8Array) {
        return true;
    } else if (obj instanceof Int8Array) {
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

var number_arrays_equal = function (array1, array2) {
    var pos = array1.length;
    if (pos !== array2.length) {
        return false;
    }
    while (pos > 0) {
        pos -= 1;
        if (array1[pos] !== array2[pos]) {
            return false;
        }
    }
    return true;
};

var arrays_equal = function (array1, array2) {
    if (is_number_array(array1) || is_number_array(array2)) {
        return number_arrays_equal(array1, array2);
    }
    var pos = array1.length;
    if (pos !== array2.length) {
        return false;
    }
    while (pos > 0) {
        pos -= 1;
        if (!objects_equal(array1[pos], array2[pos], false)) {
            return false;
        }
    }
    return true;
};

var maps_equal = function (dict1, dict2) {
    var keys1 = Object.keys(dict1);
    var keys2 = Object.keys(dict2);
    var pos = keys1.length;
    if (pos !== keys2.length) {
        return false;
    }
    var key;  // String
    while (pos > 0) {
        pos -= 1;
        key = keys1[pos];
        // check key
        if (!key || key.length === 0) {
            // should not happen
            continue;
            // throw new TypeError('map key error: ' + key);
        }
        // check value
        //    if the key starts with '_', means it is a private field,
        //    only check its value shallowly (to avoid infinite loops)
        if (!objects_equal(dict1[key], dict2[key], key.charAt(0) === '_')) {
            return false;
        }
    }
    return true;
};

var objects_equal = function (obj1, obj2, shallow) {
    // 1. compare directly
    if (!obj1) {
        return !obj2;
    } else if (!obj2) {
        return false;
    } else if (obj1 === obj2) {
        // same object
        return true;
    }
    // 2. compare via 'equals()'
    if (typeof obj1['equals'] === 'function') {
        return obj1.equals(obj2);
    } else if (typeof obj2['equals'] === 'function') {
        return obj2.equals(obj1);
    }
    // 3. compare for arrays
    if (is_array(obj1)) {
        return is_array(obj2) && arrays_equal(obj1, obj2);
    } else if (is_array(obj2)) {
        // types not matched
        return false;
    }
    // 4. compare for base type
    if (obj1 instanceof Date) {
        return obj2 instanceof Date && obj1.getTime() === obj2.getTime();
    } else if (obj2 instanceof Date) {
        // types not matched
        return false;
    } else if (IObject.isBaseType(obj1)) {
        // already compared: obj1 === obj2
        return false;
    } else if (IObject.isBaseType(obj2)) {
        // already compared: obj1 === obj2
        return false;
    }
    // 5. compare as maps, if needs deep comparison
    return !shallow && maps_equal(obj1, obj2);
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
 * @param {number} index
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
 * @param {number} index
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
 * @return {boolean} false on not found
 */
var remove_item = function (array, item) {
    var index = find_item(array, item);
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

/**
 *  Find item in the array
 *
 * @param {[]} array
 * @param {*} item
 * @return {int} first position of the item, -1 on not found
 */
var find_item = function (array, item) {
    for (var i = 0; i < array.length; ++i) {
        if (objects_equal(array[i], item, false)) {
            return i;
        }
    }
    return -1;
};

mk.type.Arrays = {
    insert : insert_item,
    update : update_item,
    remove : remove_item,
    find   : find_item,

    equals : function (array1, array2) {
        // return arrays_equal(array1, array2);
        return objects_equal(array1, array2, false);
    },
    copy   : copy_items,
    isArray: is_array
};
var Arrays = mk.type.Arrays;
