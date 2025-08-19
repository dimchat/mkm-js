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

//! require 'coder.js'


mk.format.JSON = {
    /**
     *  Encode Map/List object to JsON string
     *
     * @param {{}|[]} object - Map or List
     * @return {String} JsON string
     */
    encode: function (object) {
        return this.getCoder().encode(object);
    },

    /**
     *  Decode JsON string to Map/List object
     *
     * @param {string} string - JsON string
     * @return {{}|[]} Map or List
     */
    decode: function (string) {
        return this.getCoder().decode(string);
    },

    /**
     *  Get JsON Coder
     *
     * @return {mk.format.ObjectCoder}
     */
    getCoder: function () {
        return jsonCoder;
    },

    /**
     *  Set JsON Coder
     *
     * @param {mk.format.ObjectCoder} coder
     */
    setCoder: function (coder) {
        jsonCoder = coder
    }
};
// var JSON = mk.format.JSON;

var jsonCoder = null;


mk.format.JSONMap = {
    encode: function (dictionary) {
        return this.getCoder().encode(dictionary);
    },
    decode: function (string) {
        return this.getCoder().decode(string);
    },
    getCoder: function () {
        return jsonCoder;
    },
    setCoder: function (coder) {
        jsonCoder = coder
    }
};
var JSONMap = mk.format.JSONMap;
