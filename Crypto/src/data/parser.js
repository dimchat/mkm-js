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
//! require 'json2.js' (https://github.com/douglascrockford/JSON-js)

!function (ns) {
    'use strict';

    /**
     *  Encode string to UTF8 data array
     *
     * @param {String} string
     * @returns {Uint8Array}
     */
    var utf8_encode = function (string) {
        var len = string.length;
        var array = new ns.type.Data(len);
        var c, l;
        for (var i = 0; i < len; ++i) {
            c = string.charCodeAt(i);
            if (0xD800 <= c && c <= 0xDBFF) {
                // Unicode SMP (Supplementary Multilingual Plane)
                l = string.charCodeAt(++i);
                c = ((c - 0xD800) << 10) + 0x10000 + l - 0xDC00;
            }
            if (c <= 0) {
                // end
                break;
            } else if (c < 0x0080) {
                // 0xxx xxxx
                array.push(c);
            } else if (c < 0x0800) {
                // 110x xxxx, 10xx xxxx
                array.push(0xC0 | ((c >>  6) & 0x1F));
                array.push(0x80 | ((c >>  0) & 0x3F));
            } else if (c < 0x10000) {
                // 1110 xxxx, 10xx xxxx, 10xx xxxx
                array.push(0xE0 | ((c >> 12) & 0x0F));
                array.push(0x80 | ((c >>  6) & 0x3F));
                array.push(0x80 | ((c >>  0) & 0x3F));
            } else {
                // 1111 0xxx, 10xx xxxx, 10xx xxxx, 10xx xxxx
                array.push(0xF0 | ((c >> 18) & 0x07));
                array.push(0x80 | ((c >> 12) & 0x3F));
                array.push(0x80 | ((c >>  6) & 0x3F));
                array.push(0x80 | ((c >>  0) & 0x3F));
            }
        }
        return array.getBytes(false);
    };

    /**
     *  Decode UTF8 data array to string
     *
     * @param {Uint8Array} array
     * @returns {String}
     */
    var utf8_decode = function (array) {
        var string = '';
        var len = array.length;
        var c, c2, c3, c4;
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
                case 15:
                    c2 = array[++i];
                    c3 = array[++i];
                    c4 = array[++i];
                    // 1111 0xxx, 10xx xxxx, 10xx xxxx, 10xx xxxx
                    c = ((c & 0x07) << 18) | ((c2 & 0x3F) << 12) | ((c3 & 0x3F) << 6) | (c4 & 0x3F);
                    break;
            }
            if (c < 0x10000) {
                string += String.fromCharCode(c);
            } else/* if (c < 0x110000)*/ {
                // Unicode SMP (Supplementary Multilingual Plane)
                c -= 0x10000;
                string += String.fromCharCode((c >> 10) + 0xD800);    // hi
                string += String.fromCharCode((c & 0x03FF) + 0xDC00); // lo
            }
        }
        return string;
    };

    //
    //  DataParser interface
    //
    var parser = function () {
    };
    ns.Interface(parser, null);
    // noinspection JSUnusedLocalSymbols
    /**
     *  Encode container/string object to bytes
     *
     * @param {{}|[]|String} object - Map, List, or String
     * @returns {Uint8Array} JsON or UTF-8 string bytes
     */
    parser.prototype.encode = function (object) {
        console.assert(false, 'implement me!');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Decode bytes to container/string object
     *
     * @param {Uint8Array} data - JsON or UTF-8 string bytes
     * @returns {{}|[]|String} Map, List, or String
     */
    parser.prototype.decode = function (data) {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  JSON
    //
    var json = function () {
    };
    ns.Class(json, ns.type.Object, [parser]);

    json.prototype.encode = function (container) {
        var string = JSON.stringify(container);
        if (!string) {
            throw TypeError('failed to encode JSON object: ' + container);
        }
        return ns.format.UTF8.encode(string);
    };
    json.prototype.decode = function (json) {
        var string;
        if (typeof json === 'string') {
            string = json;
        } else {
            // convert UTF-8 data bytes to String
            string = ns.format.UTF8.decode(json);
        }
        if (!string) {
            throw TypeError('failed to decode JSON data: ' + json);
        }
        return JSON.parse(string);
    };

    //
    //  UTF-8
    //
    var utf8 = function () {
    };
    ns.Class(utf8, ns.type.Object, [parser]);

    utf8.prototype.encode = utf8_encode;
    utf8.prototype.decode = utf8_decode;

    //
    //  Parser Lib
    //
    var Lib = function (parser) {
        this.parser = parser;
    };
    ns.Class(Lib, ns.type.Object, [parser]);

    Lib.prototype.encode = function (object) {
        return this.parser.encode(object);
    };
    Lib.prototype.decode = function (data) {
        return this.parser.decode(data);
    };

    //-------- namespace --------//
    ns.format.DataParser = parser;
    ns.format.JSON = new Lib(new json());
    ns.format.UTF8 = new Lib(new utf8());

    ns.format.register('DataParser');
    ns.format.register('JSON');
    ns.format.register('UTF8');

}(DIMP);
