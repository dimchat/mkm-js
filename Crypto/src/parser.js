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
    /**
     *  Encode container object to text string
     *
     * @param container
     * @returns {null|string}
     */
    parser.prototype.encode = function (container) {
        console.assert(container != null, 'container empty');
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Decode text string to object
     *
     * @param string
     * @returns {null|object}
     */
    parser.prototype.decode = function (string) {
        console.assert(string != null, 'string empty');
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  JSON
    //
    var json = function () {
    };
    json.inherits(parser);
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
    /**
     *  Encode public key to PEM content
     *
     * @param key
     * @returns {null|string}
     */
    parser.prototype.encodePublicKey = function (key) {
        console.assert(key != null, 'public key empty');
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Encode private key to PEM content
     *
     * @param key
     * @returns {null|string}
     */
    parser.prototype.encodePrivateKey = function (key) {
        console.assert(key != null, 'private key empty');
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Decode PEM content to public key
     *
     * @param pem
     * @returns {null|object}
     */
    parser.prototype.decodePublicKey = function (pem) {
        console.assert(pem != null, 'pem content empty');
        console.assert(false, 'implement me!');
        return null;
    };
    /**
     *  Decode PEM content to private key
     *
     * @param pem
     * @returns {null|object}
     */
    parser.prototype.decodePrivateKey = function (pem) {
        console.assert(pem != null, 'pem content empty');
        console.assert(false, 'implement me!');
        return null;
    };

    //
    //  PEM
    //
    var pem = function () {
    };
    pem.inherits(parser);
    pem.prototype.encodePublicKey = function (key) {
        console.assert(key != null, 'public key content empty');
        console.assert(false, 'PEM parser not implemented');
        return null;
    };
    pem.prototype.encodePrivateKey = function (key) {
        console.assert(key != null, 'private key content empty');
        console.assert(false, 'PEM parser not implemented');
        return null;
    };
    pem.prototype.decodePublicKey = function (pem) {
        console.assert(pem != null, 'pem content empty');
        console.assert(false, 'PEM parser not implemented');
        return null;
    };
    pem.prototype.decodePrivateKey = function (pem) {
        console.assert(pem != null, 'pem content empty');
        console.assert(false, 'PEM parser not implemented');
        return null;
    };

    //
    //  Parser Lib
    //
    var P = function (lib) {
        this.parser = lib;
    };
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
