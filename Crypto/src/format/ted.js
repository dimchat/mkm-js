;
// license: https://mit-license.org
//
//  MONKEY: Memory Object aNd KEYs
//
//                               Written in 2024 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2024 Albert Moky
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
//! require 'type/mapper.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Mapper = ns.type.Mapper;

    /** Transportable Data
     *  ~~~~~~~~~~~~~~~~~~
     *  TED - Transportable Encoded Data
     *
     *      0. "{BASE64_ENCODE}"
     *      1. "base64,{BASE64_ENCODE}"
     *      2. "data:image/png;base64,{BASE64_ENCODE}"
     *      3. {
     *              algorithm : "base64",
     *              data      : "...",      // base64_encode(data)
     *              ...
     *         }
     */
    var TransportableData = Interface(null, [Mapper]);

    TransportableData.DEFAULT = 'base64';
    TransportableData.BASE64  = 'base64';
    TransportableData.BASE58  = 'base58';
    TransportableData.HEX     = 'hex';

    /**
     *  Get encode algorithm
     *
     * @return 'base64'
     */
    TransportableData.prototype.getAlgorithm = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Get original data
     *
     * @return plaintext
     */
    TransportableData.prototype.getData = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  Get encoded string
     *
     * @return {String} "{BASE64_ENCODE}}", or
     *                  "base64,{BASE64_ENCODE}", or
     *                  "data:image/png;base64,{BASE64_ENCODE}", or
     *                  "{...}"
     */
    TransportableData.prototype.toString = function () {
        throw new Error('NotImplemented');
    };

    /**
     *  toJson()
     *
     * @return {String|{}}
     */
    TransportableData.prototype.toObject = function () {
        throw new Error('NotImplemented');
    };

    //
    //  Conveniences
    //

    TransportableData.encode = function (data) {
        var ted = TransportableData.create(data);
        return ted.toObject();
    };
    TransportableData.decode = function (encoded) {
        var ted = TransportableData.parse(encoded);
        if (!ted) {
            return null;
        }
        return ted.getData();
    };

    //
    //  Factory methods
    //

    var general_factory = function () {
        var man = ns.format.FormatFactoryManager;
        return man.generalFactory;
    };

    TransportableData.create = function (data, algorithm) {
        if (!algorithm) {
            algorithm = TransportableData.DEFAULT;
        }
        var gf = general_factory();
        return gf.createTransportableData(algorithm, data);
    };

    TransportableData.parse = function (ted) {
        var gf = general_factory();
        return gf.parseTransportableData(ted);
    };

    TransportableData.setFactory = function (algorithm, factory) {
        var gf = general_factory();
        return gf.setTransportableDataFactory(algorithm, factory);
    };
    TransportableData.getFactory = function (algorithm) {
        var gf = general_factory();
        return gf.getTransportableDataFactory(algorithm);
    };

    /**
     *  TED Factory
     *  ~~~~~~~~~~~
     */
    var TransportableDataFactory = Interface(null, null);

    /**
     *  Create TED
     *
     * @param {Uint8Array} data - original data
     * @return {TransportableData} TED object
     */
    TransportableDataFactory.prototype.createTransportableData = function (data) {
        throw new Error('NotImplemented');
    };

    /**
     *  Parse map object to TED
     *
     * @param {*} ted - TED info
     * @return {TransportableData} TED object
     */
    TransportableDataFactory.prototype.parseTransportableData = function (ted) {
        throw new Error('NotImplemented');
    };

    TransportableData.Factory = TransportableDataFactory;

    //-------- namespace --------
    ns.format.TransportableData = TransportableData;
    ns.format.TransportableDataFactory = TransportableDataFactory;

})(MONKEY);
