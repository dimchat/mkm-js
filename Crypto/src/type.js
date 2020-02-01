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
//! require 'parser.js'

!function (ns) {
    'use strict';

    //
    //  Object wrapper
    //
    var obj = function (value) {
        if (value instanceof obj) {
            this.value = value.value;
        } else {
            this.value = value;
        }
    };

    obj.prototype.equals = function (other) {
        if (other instanceof obj) {
            return this.value === other.value;
        } else {
            return this.value === other;
        }
    };

    obj.prototype.valueOf = function () {
        return this.value.valueOf();
    };

    obj.prototype.toString = function () {
        return this.value.toString();
    };

    obj.prototype.toLocaleString = function () {
        return this.value.toLocaleString();
    };

    obj.prototype.toJSON = function () {
        return ns.format.JSON.encode(this.value);
    };

    //-------- namespace --------
    if (typeof ns.type !== 'object') {
        ns.type = {}
    }
    ns.type.Object = obj;

}(DIMP);

!function (ns) {
    'use strict';

    var obj = ns.type.Object;

    //
    //  UTF-8
    //
    var UTF8 = {
        /**
         *  Encode string to UTF8 data array
         *
         * @param str
         * @returns {[]}
         */
        encode: function (str) {
            var array = [];
            var len = str.length;
            var c;
            for (var i = 0; i < len; ++i) {
                c = str.charCodeAt(i);
                if (c <= 0) {
                    // end
                    break;
                } else if (c < 0x0080) {
                    // 0xxx xxxx
                    array.push(c);
                } else if (c < 0x0800) {
                    // 110x xxxx, 10xx xxxx
                    array.push(0xC0 | ((c >>  6) & 0x001F));
                    array.push(0x80 | ((c >>  0) & 0x003F));
                } else {
                    // 1110 xxxx, 10xx xxxx, 10xx xxxx
                    array.push(0xE0 | ((c >> 12) & 0x000F));
                    array.push(0x80 | ((c >>  6) & 0x003F));
                    array.push(0x80 | ((c >>  0) & 0x003F));
                }
            }
            return array;
        },
        /**
         *  Decode UTF8 data array to string
         *
         * @param array
         * @returns {string}
         */
        decode: function (array) {
            var string = '';
            var len = array.length;
            var c, c2, c3;
            for (var i = 0; i < len; ++i) {
                c = array[i];
                switch (c >> 4) {
                    // case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    //     // 0xxx xxxx
                    //     break;
                    case 12: case 13:
                        // 110x xxxx, 10xx xxxx
                        c2 = array[++i];
                        c = ((c & 0x1F) << 6) | (c2 & 0x3F);
                        break;
                    case 14:
                        // 1110 xxxx, 10xx xxxx, 10xx xxxx
                        c2 = array[++i];
                        c3 = array[++i];
                        c = ((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
                        break;
                }
                string += String.fromCharCode(c);
            }
            return string;
        }
    };

    //
    //  String
    //
    var str = function (data, charset) {
        if (data instanceof Array) {
            // decode data array
            if (!charset || charset === 'UTF-8') {
                data = UTF8.decode(data);
            } else {
                throw Error('only UTF-8 now');
            }
        }
        obj.call(this, data);
    };
    str.inherits(obj);

    /**
     *  Encode str to UTF8 data array
     *
     * @param charset
     * @returns {*[]}
     */
    str.prototype.getBytes = function (charset) {
        if (!charset || charset === 'UTF-8') {
            return UTF8.encode(this.value);
        }
        // TODO: other charset
        return this.value;
    };

    str.prototype.equals = function (other) {
        if (!other) {
            return !this.value;
        } else if (other instanceof str) {
            return this.value === other.value;
        }
        // console.assert(other instanceof String, 'other string error');
        return this.value === other;
    };

    var equalsIgnoreCase = function (str1, str2) {
        if (str1.length !== str2.length) {
            return false;
        }
        var low1 = str1.toLowerCase();
        var low2 = str2.toLowerCase();
        return low1 === low2;
    };

    str.prototype.equalsIgnoreCase = function (other) {
        if (!other) {
            return !this.value;
        } else if (other instanceof str) {
            return equalsIgnoreCase(this.value, other.value);
        }
        // console.assert(other instanceof String, 'other string error');
        return equalsIgnoreCase(this.value, other);
    };

    str.prototype.getLength = function() {
        return this.value.length;
    };

    //-------- namespace --------
    ns.type.String = str;

}(DIMP);

!function (ns) {
    'use strict';

    var obj = ns.type.Object;

    //
    //  Array
    //
    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function (item, start) {
            if (!start) {
                start = 0;
            }
            var length = this.length;
            for (var i = start; i < length; ++i) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        }
    }
    if (typeof Array.prototype.contains !== 'function') {
        Array.prototype.contains = function (item) {
            return this.indexOf(item) >= 0;
        }
    }
    if (typeof Array.prototype.remove !== 'function') {
        Array.prototype.remove = function (item) {
            var index = this.indexOf(item);
            if (index < 0) {
                return null;
            }
            return this.splice(index, 1);
        }
    }

    var arrays = {
        equals: function (a1, a2) {
            if (a1 === a2) {
                // same object
                return true;
            }
            if (a1.length !== a2.length) {
                return false;
            }
            for (var k in a1) {
                // noinspection JSUnfilteredForInLoop
                if (a1[k] !== a2[k]) {
                    return false;
                }
            }
            return true;
        }
    };

    //
    //  Dictionary
    //
    var map = function (map) {
        obj.call(this, map);
    };
    map.inherits(obj);

    map.prototype.equals = function (other) {
        if (!other) {
            return !this.value;
        } else if (other instanceof map) {
            return arrays.equals(this.value, other.value);
        }
        return arrays.equals(this.value, other);
    };

    map.prototype.toString = function () {
        return this.toJSON();
    };

    map.prototype.toLocaleString = function () {
        return this.toJSON();
    };

    /**
     *  Get inner dictionary
     *
     * @param copy - clone when true
     * @returns {map}
     */
    map.prototype.getMap = function (copy) {
        if (copy) {
            var json = ns.format.JSON.encode(this.value);
            return ns.format.JSON.decode(json);
        } else {
            return this.value;
        }
    };

    /**
     *  Get all keys in dictionary
     *
     * @returns {string[]}
     */
    map.prototype.allKeys = function() {
        return Object.keys(this.value);
    };

    /**
     *  Get value for key
     *
     * @param key
     * @returns {*}
     */
    map.prototype.getValue = function (key) {
        return this.value[key];
    };

    /**
     *  Set value for key
     *
     * @param key
     * @param value
     */
    map.prototype.setValue = function (key, value) {
        if (value !== null) {
            this.value[key] = value;
        } else if (this.value.hasOwnProperty(key)) {
            delete this.value[key];
        }
    };

    //-------- namespace --------
    ns.type.Dictionary = map;
    ns.type.Arrays = arrays;

}(DIMP);

!function (ns) {
    'use strict';

    var obj = ns.type.Object;

    //
    //  Enumeration
    //
    var enu = function(elements) {
        // get alias name from exist elements
        var get_name = function (value, enumeration) {
            if (value instanceof enumeration) {
                return value.alias;
            }
            // searching exists elements for alias
            var e;
            for (var k in enumeration) {
                // noinspection JSUnfilteredForInLoop
                e = enumeration[k];
                if (e instanceof enumeration) {
                    if (e.equals(value)) {
                        return e.alias;
                    }
                }
            }
            return null;
        };
        // template for enumeration
        var enumeration = function (value, alias) {
            if (!alias) {
                alias = get_name(value, enumeration);
                if (!alias) {
                    throw RangeError('enum error: ' + value);
                }
            }
            obj.call(this, value);
            this.alias = alias;
        };
        enumeration.inherits(obj);
        enumeration.prototype.toString = function () {
            return '<' + this.alias.toString()
                + ': ' + this.value.toString() + '>';
        };
        enumeration.prototype.toLocaleString = function () {
            return '<' + this.alias.toLocaleString()
                + ': ' + this.value.toLocaleString() + '>';
        };
        var e, v;
        for (var name in elements) {
            // noinspection JSUnfilteredForInLoop
            v = elements[name];
            if (typeof v === 'function') {
                continue;
            }
            // noinspection JSUnfilteredForInLoop
            e = new enumeration(v, name);
            // noinspection JSUnfilteredForInLoop
            enumeration[name] = e;
        }
        return enumeration;
    };

    //-------- namespace --------
    ns.type.Enum = enu;

}(DIMP);
