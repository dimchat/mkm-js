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

//! require 'type/class.js'


    /**
     *  Data Coder
     *  ~~~~~~~~~~
     *  Hex, Base58, Base64, ...
     *
     *  1. encode binary data to string;
     *  2. decode string to binary data.
     */
    mk.format.DataCoder = Interface(null, null);
    var DataCoder = mk.format.DataCoder;

    DataCoder.prototype = {

        /**
         *  Encode binary data to local string
         *
         * @param {Uint8Array} data
         * @return {String}
         */
        encode: function (data) {},

        /**
         *  Decode local string to binary data
         *
         * @param {string} string
         * @return {Uint8Array}
         */
        decode: function (string) {}

    };


    /**
     *  Object Coder
     *  ~~~~~~~~~~~~
     *  JsON, XML, ...
     *
     *  1. encode object to string;
     *  2. decode string to object.
     */
    mk.format.ObjectCoder = Interface(null, null);
    var ObjectCoder = mk.format.ObjectCoder;

    ObjectCoder.prototype = {

        /**
         *  Encode Map/List object to string
         *
         * @param {{}|[]} object - Map or List
         * @return {String} serialized string
         */
        encode: function (object) {},

        /**
         *  Decode string to Map/List object
         *
         * @param {string} string - serialized string
         * @return {{}|[]} Map or List
         */
        decode: function (string) {}

    };


    /**
     *  String Coder
     *  ~~~~~~~~~~~~
     *  UTF-8, UTF-16, GBK, GB2312, ...
     *
     *  1. encode string to binary data;
     *  2. decode binary data to string.
     */
    mk.format.StringCoder = Interface(null, null);
    var StringCoder = mk.format.StringCoder;

    StringCoder.prototype = {

        /**
         *  Encode local string to binary data
         *
         * @param {string} string
         * @return {Uint8Array}
         */
        encode: function (string) {},

        /**
         *  Decode binary data to local string
         *
         * @param {Uint8Array} data
         * @return {String}
         */
        decode: function (data) {}

    };
