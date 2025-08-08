;
// license: https://mit-license.org
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2025 Albert Moky
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

//! require 'crypto/keys.js'
//! require 'format/ted.js'
//! require 'format/pnf.js'


mk.plugins.TransportableDataHelper = Interface(null, null);
var TransportableDataHelper = mk.plugins.TransportableDataHelper;

TransportableDataHelper.prototype = {

    setTransportableDataFactory: function (algorithm, factory) {},
    getTransportableDataFactory: function (algorithm) {},

    createTransportableData: function (data, algorithm) {},

    parseTransportableData: function (ted) {}

};


mk.plugins.PortableNetworkFileHelper = Interface(null, null);
var PortableNetworkFileHelper = mk.plugins.PortableNetworkFileHelper;

PortableNetworkFileHelper.prototype = {

    setPortableNetworkFileFactory: function (factory) {},
    getPortableNetworkFileFactory: function () {},

    createPortableNetworkFile: function (data, filename, url, password) {},

    parsePortableNetworkFile: function (pnf) {}

};


/**
 *  Format FactoryManager
 *  ~~~~~~~~~~~~~~~~~~~~~
 */
mk.plugins.FormatExtensions = {

    /**
     *  Init TED helper
     *
     * @param {TransportableDataHelper} helper
     */
    setTEDHelper: function (helper) {
        tedHelper = helper;
    },
    getTEDHelper: function () {
        return tedHelper;
    },

    /**
     *  Init PNF helper
     *
     * @param {PortableNetworkFileHelper} helper
     */
    setPNFHelper: function (helper) {
        pnfHelper = helper;
    },
    getPNFHelper: function () {
        return pnfHelper;
    }

};
var FormatExtensions = mk.plugins.FormatExtensions;

var tedHelper = null;
var pnfHelper = null;
