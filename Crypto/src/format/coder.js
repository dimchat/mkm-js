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

    /**
     *  Data Coder
     *  ~~~~~~~~~~
     *  Hex, Base58, Base64, ...
     *
     *  1. encode binary data to string;
     *  2. decode string to binary data.
     */
    var DataCoder = function () {};
    ns.Interface(DataCoder, null);

    /**
     *  Encode binary data to local string
     *
     * @param {Uint8Array} data
     * @return {String}
     */
    DataCoder.prototype.encode = function (data) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Decode local string to binary data
     *
     * @param {String} string
     * @return {Uint8Array}
     */
    DataCoder.prototype.decode = function (string) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Object Coder
     *  ~~~~~~~~~~~~
     *  JsON, XML, ...
     *
     *  1. encode object to string;
     *  2. decode string to object.
     */
    var ObjectCoder = function () {};
    ns.Interface(ObjectCoder, null);

    /**
     *  Encode Map/List object to string
     *
     * @param {{}|[]} object - Map or List
     * @return {String} serialized string
     */
    ObjectCoder.prototype.encode = function (object) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Decode string to Map/List object
     *
     * @param {String} string - serialized string
     * @return {{}|[]} Map or List
     */
    ObjectCoder.prototype.decode = function (string) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  String Coder
     *  ~~~~~~~~~~~~
     *  UTF-8, UTF-16, GBK, GB2312, ...
     *
     *  1. encode string to binary data;
     *  2. decode binary data to string.
     */
    var StringCoder = function () {};
    ns.Interface(StringCoder, null);

    /**
     *  Encode local string to binary data
     *
     * @param {String} string
     * @return {Uint8Array}
     */
    StringCoder.prototype.encode = function (string) {
        ns.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Decode binary data to local string
     *
     * @param {Uint8Array} data
     * @return {String}
     */
    StringCoder.prototype.decode = function (data) {
        ns.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.format.DataCoder = DataCoder;
    ns.format.ObjectCoder = ObjectCoder;
    ns.format.StringCoder = StringCoder;

    ns.format.registers('DataCoder');
    ns.format.registers('ObjectCoder');
    ns.format.registers('StringCoder');

})(MONKEY);
