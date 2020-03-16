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

//! require 'namespace.js'

!function (ns) {
    'use strict';

    //
    //  Object
    //
    var obj = function () {
    };
    ns.Class(obj, Object, null);

    obj.prototype.equals = function (other) {
        return this === other;
    };

    //-------- namespace --------
    ns.type.Object = obj;

    ns.type.register('Object');

}(DIMP);

!function (ns) {
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

    var is_arrays_equal = function (array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        for (var i = 0; i < array1.length; ++i) {
            if (!is_objects_equal(array1[i], array2[i])) {
                return false;
            }
        }
        return true;
    };

    var is_dictionary_equal = function (dict1, dict2) {
        var keys1 = Object.keys(dict1);
        var keys2 = Object.keys(dict2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        var k;
        for (var i = 0; i < keys1.length; ++i) {
            k = keys1[i];
            if (!is_objects_equal(dict1[k], dict2[k])) {
                return false;
            }
        }
        return true;
    };

    var is_objects_equal = function (obj1, obj2) {
        // compare directly
        if (obj1 === obj2) {
            return true; // same objects
        } else if (!obj1) {
            return !obj2; // object1 is undefined but object2 is not
        } else if (!obj2) {
            return false; // object2 is undefined but object1 is not
        } else if (typeof obj1['equals'] === 'function') {
            return obj1.equals(obj2);
        } else if (typeof obj2['equals'] === 'function') {
            return obj2.equals(obj1);
        }
        // check array
        if (is_array(obj1)) {
            if (is_array(obj2)) {
                // compare as array
                return is_arrays_equal(obj1, obj2);
            } else {
                return false;
            }
        } else if (is_array(obj2)) {
            return false;
        }
        // compare as dictionary
        return is_dictionary_equal(obj1, obj2);
    };

    //
    //  Array
    //
    var arrays = {
        /**
         *  Remove the item from array
         *
         * @param {[]} array
         * @param {*} item
         * @returns {[]}
         */
        remove: function (array, item) {
            var index = array.indexOf(item);
            if (index < 0) {
                return null;
            }
            return array.splice(index, 1);
        },

        /**
         *  Check whether the two arrays are equal
         *
         * @param {Uint8Array|[]|{}} array1
         * @param {Uint8Array|[]|{}} array2
         * @returns {boolean}
         */
        equals: is_objects_equal
    };

    //-------- namespace --------
    ns.type.Arrays = arrays;

    ns.type.register('Arrays');

}(DIMP);
