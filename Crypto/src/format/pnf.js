;
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

//! require 'ted.js'


/** Transportable File
 *  ~~~~~~~~~~~~~~~~~~
 *  PNF - Portable Network File
 *
 *      0. "{URL}"
 *      1. "base64,{BASE64_ENCODE}"
 *      2. "data:image/png;base64,{BASE64_ENCODE}"
 *      3. {
 *              data     : "...",        // base64_encode(fileContent)
 *              filename : "avatar.png",
 *
 *              URL      : "http://...", // download from CDN
 *              // before fileContent uploaded to a public CDN,
 *              // it can be encrypted by a symmetric key
 *              key      : {             // symmetric key to decrypt file content
 *                  algorithm : "AES",   // "DES", ...
 *                  data      : "{BASE64_ENCODE}",
 *                  ...
 *              }
 *         }
 */
mk.format.PortableNetworkFile = Interface(null, [Mapper], {

    /**
     *  When file data is too big, don't set it in this dictionary,
     *  but upload it to a CDN and set the download URL instead.
     *
     * @param {Uint8Array} fileData
     */
    setData: function (fileData) {},
    getData: function () {},

    /**
     *  Set file name
     *
     * @param {string} filename
     */
    setFilename: function (filename) {},
    getFilename: function () {},

    /**
     *  Download URL
     *
     * @param {URL} url
     */
    setURL: function (url) {},
    getURL: function () {},

    /**
     *  Password for decrypting the downloaded data from CDN,
     *  default is a plain key, which just return the same data when decrypting.
     *
     * @param {DecryptKey} key
     */
    setPassword: function (key) {},
    getPassword: function () {},

    /**
     *  Get encoded string
     *
     * @return {String} "URL", or
     *                  "base64,{BASE64_ENCODE}", or
     *                  "data:image/png;base64,{BASE64_ENCODE}", or
     *                  "{...}"
     */
    toString: function () {},

    /**
     *  toJson()
     *
     * @return {String|{}} String, or Map
     */
    toObject: function () {}

});
var PortableNetworkFile = mk.format.PortableNetworkFile;

//
//  Factory methods
//

PortableNetworkFile.createFromURL = function (url, password) {
    return PortableNetworkFile.create(null, null, url, password);
};
PortableNetworkFile.createFromData = function (ted, filename) {
    return PortableNetworkFile.create(ted, filename, null, null);
};
PortableNetworkFile.create = function (ted, filename, url, password) {
    var helper = FormatExtensions.getPNFHelper();
    return helper.createPortableNetworkFile(ted, filename, url, password);
};
PortableNetworkFile.parse = function (pnf) {
    var helper = FormatExtensions.getPNFHelper();
    return helper.parsePortableNetworkFile(pnf);
};

PortableNetworkFile.setFactory = function (factory) {
    var helper = FormatExtensions.getPNFHelper();
    return helper.setPortableNetworkFileFactory(factory);
};
PortableNetworkFile.getFactory = function () {
    var helper = FormatExtensions.getPNFHelper();
    return helper.getPortableNetworkFileFactory();
};


/**
 *  PNF Factory
 *  ~~~~~~~~~~~
 */
PortableNetworkFile.Factory = Interface(null, null, {

    /**
     *  Create PNF
     *
     * @param {TransportableData} ted - file data (not encrypted)
     * @param {String} filename       - file name
     * @param {URL} url               - download URL
     * @param {DecryptKey} password   - decrypt key for downloaded data
     * @return {PortableNetworkFile} PNF object
     */
    createPortableNetworkFile: function (ted, filename, url, password) {},

    /**
     *  Parse map object to PNF
     *
     * @param {*} pnf - PNF info
     * @return {PortableNetworkFile} PNF object
     */
    parsePortableNetworkFile: function (pnf) {}

});
var PortableNetworkFileFactory = PortableNetworkFile.Factory;
