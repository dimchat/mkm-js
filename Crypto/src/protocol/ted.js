'use strict';
// license: https://mit-license.org
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
    mk.protocol.TransportableData = Interface(null, [Mapper]);
    var TransportableData = mk.protocol.TransportableData;

    TransportableData.prototype = {

        /**
         *  Get encode algorithm
         *
         * @return 'base64'
         */
        getAlgorithm: function () {},

        /**
         *  Get original data
         *
         * @return plaintext
         */
        getData: function () {},

        /**
         *  Get encoded string
         *
         * @return {String} "{BASE64_ENCODE}}", or
         *                  "base64,{BASE64_ENCODE}", or
         *                  "data:image/png;base64,{BASE64_ENCODE}", or
         *                  "{...}"
         */
        toString: function () {},

        /**
         *  toJson()
         *
         * @return {String|{}}
         */
        toObject: function () {}

    };

    // TransportableData.DEFAULT = 'base64';
    // TransportableData.BASE64  = 'base64';
    // TransportableData.BASE58  = 'base58';
    // TransportableData.HEX     = 'hex';

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

    TransportableData.create = function (data, algorithm) {
        var helper = FormatExtensions.getTEDHelper();
        return helper.createTransportableData(data, algorithm);
    };

    TransportableData.parse = function (ted) {
        var helper = FormatExtensions.getTEDHelper();
        return helper.parseTransportableData(ted);
    };

    TransportableData.setFactory = function (algorithm, factory) {
        var helper = FormatExtensions.getTEDHelper();
        return helper.setTransportableDataFactory(algorithm, factory);
    };
    TransportableData.getFactory = function (algorithm) {
        var helper = FormatExtensions.getTEDHelper();
        return helper.getTransportableDataFactory(algorithm);
    };

    /**
     *  TED Factory
     *  ~~~~~~~~~~~
     */
    TransportableData.Factory = Interface(null, null);
    var TransportableDataFactory = TransportableData.Factory;

    TransportableDataFactory.prototype = {

        /**
         *  Create TED
         *
         * @param {Uint8Array} data - original data
         * @return {mk.protocol.TransportableData} TED object
         */
        createTransportableData: function (data) {},

        /**
         *  Parse map object to TED
         *
         * @param {*} ted - TED info
         * @return {mk.protocol.TransportableData} TED object
         */
        parseTransportableData: function (ted) {}

    };
