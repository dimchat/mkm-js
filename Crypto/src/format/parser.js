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

//! require 'object.js'

(function (ns) {
    'use strict';

    //
    //  DataParser interface
    //
    var parser = function () {
    };
    ns.Interface(parser, null);

    /**
     *  Encode container/string object to bytes
     *
     * @param {{}|[]|String} object - Map, List, or String
     * @return {Uint8Array} JsON or UTF-8 string bytes
     */
    parser.prototype.encode = function (object) {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Decode bytes to container/string object
     *
     * @param {Uint8Array} data - JsON or UTF-8 string bytes
     * @return {{}|[]|String} Map, List, or String
     */
    parser.prototype.decode = function (data) {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  Parser Lib
    //
    var lib = function (parser) {
        this.parser = parser;
    };
    ns.Class(lib, ns.type.Object, [parser]);

    lib.prototype.encode = function (object) {
        return this.parser.encode(object);
    };
    lib.prototype.decode = function (data) {
        return this.parser.decode(data);
    };

    //-------- namespace --------//
    ns.format.DataParser = parser;
    ns.format.ParserLib = lib;

    ns.format.register('DataParser');
    ns.format.register('ParserLib');

})(DIMP);
