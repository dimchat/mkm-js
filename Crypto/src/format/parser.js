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

    //
    //  DataParser interface
    //
    var parser = function () {
    };
    ns.Interface(parser, null);
    // noinspection JSUnusedLocalSymbols
    /**
     *  Encode container object to text string
     *
     * @param {{}|[]} container
     * @returns {String}
     */
    parser.prototype.encode = function (container) {
        console.assert(false, 'implement me!');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Decode text string to container object
     *
     * @param {String} string
     * @returns {{}|[]}
     */
    parser.prototype.decode = function (string) {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  JSON
    //
    var json = function () {
    };
    ns.Class(json, ns.type.Object, parser);

    json.prototype.encode = function (container) {
        return JSON.stringify(container);
    };
    json.prototype.decode = function (string) {
        return JSON.parse(string);
    };

    //
    //  Parser Lib
    //
    var P = function (lib) {
        this.parser = lib;
    };
    ns.Class(P, ns.type.Object, parser);

    P.prototype.encode = function (container) {
        return this.parser.encode(container);
    };
    P.prototype.decode = function (string) {
        return this.parser.decode(string);
    };

    //-------- namespace --------//
    ns.format.DataParser = parser;
    ns.format.JSON = new P(new json());

    ns.format.register('DataParser');
    ns.format.register('JSON');

}(DIMP);

!function (ns) {
    'use strict';

    //
    //  KeyParser interface
    //
    var parser = function () {
    };
    ns.Interface(parser, null);
    // noinspection JSUnusedLocalSymbols
    /**
     *  Encode public key data to PEM content
     *
     * @param {Uint8Array} key - key data
     * @returns {String} PEM string
     */
    parser.prototype.encodePublicKey = function (key) {
        console.assert(false, 'implement me!');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Encode private key data to PEM content
     *
     * @param {Uint8Array} key - key data
     * @returns {String} PEM string
     */
    parser.prototype.encodePrivateKey = function (key) {
        console.assert(false, 'implement me!');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Decode PEM content to public key data
     *
     * @param {String} pem - key data in PEM format
     * @returns {Uint8Array} key data
     */
    parser.prototype.decodePublicKey = function (pem) {
        console.assert(false, 'implement me!');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Decode PEM content to private key data
     *
     * @param {String} pem - key data in PEM format
     * @returns {Uint8Array} key data
     */
    parser.prototype.decodePrivateKey = function (pem) {
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  PEM
    //
    var pem = function () {
    };
    ns.Class(pem, ns.type.Object, parser);
    // noinspection JSUnusedLocalSymbols
    pem.prototype.encodePublicKey = function (key) {
        console.assert(false, 'PEM parser not implemented');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    pem.prototype.encodePrivateKey = function (key) {
        console.assert(false, 'PEM parser not implemented');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    pem.prototype.decodePublicKey = function (pem) {
        console.assert(false, 'PEM parser not implemented');
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    pem.prototype.decodePrivateKey = function (pem) {
        console.assert(false, 'PEM parser not implemented');
        return null;
    };

    //
    //  Parser Lib
    //
    var P = function (lib) {
        this.parser = lib;
    };
    ns.Class(P, ns.type.Object, parser);

    P.prototype.encodePublicKey = function (key) {
        return this.parser.encodePublicKey(key);
    };
    P.prototype.encodePrivateKey = function (key) {
        return this.parser.encodePrivateKey(key);
    };
    P.prototype.decodePublicKey = function (pem) {
        return this.parser.decodePublicKey(pem);
    };
    P.prototype.decodePrivateKey = function (pem) {
        return this.parser.decodePrivateKey(pem);
    };

    //-------- namespace --------
    ns.format.KeyParser = parser;
    ns.format.PEM = new P(new pem());

    ns.format.register('KeyParser');
    ns.format.register('PEM');

}(DIMP);
