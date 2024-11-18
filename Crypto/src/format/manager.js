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
//! require 'type/object.js'
//! require 'type/mapper.js'
//! require 'type/stringer.js'
//! require 'type/converter.js'

//! require 'ted.js'
//! require 'pnf.js'

(function (ns) {
    'use strict';

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var IObject = ns.type.Object;
    var Mapper = ns.type.Mapper;
    var Stringer = ns.type.Stringer;
    var Converter = ns.type.Converter

    var TransportableData = ns.format.TransportableData;
    var PortableNetworkFile = ns.format.PortableNetworkFile;

    /**
     *  Split text string to array: ["{TEXT}", "{algorithm}", "{content-type}"]
     */
    var split = function (text) {
        // "{TEXT}", or
        // "base64,{BASE64_ENCODE}", or
        // "data:image/png;base64,{BASE64_ENCODE}"
        var pos1 = text.indexOf('://');
        if (pos1 > 0) {
            // [URL]
            return [text];
        } else {
            // skip 'data:'
            pos1 = text.indexOf(':') + 1;
        }
        var array = [];
        // seeking for 'content-type'
        var pos2 = text.indexOf(';', pos1);
        if (pos2 > pos1) {
            array.push(text.substring(pos1, pos2));
            pos1 = pos2 + 1;
        }
        // seeking for 'algorithm'
        pos2 = text.indexOf(',', pos1);
        if (pos2 > pos1) {
            array.unshift(text.substring(pos1, pos2));
            pos1 = pos2 + 1;
        }
        if (pos1 === 0) {
            // [data]
            array.unshift(text);
        } else {
            // [data, algorithm, type]
            array.unshift(text.substring(pos1));
        }
        return array;
    };
    
    var decode = function (data, defaultKey) {
        var text;
        if (Interface.conforms(data, Mapper)) {
            return data.toMap();
        } else if (Interface.conforms(data, Stringer)) {
            text = data.toString();
        } else if (IObject.isString(data)) {
            text = data;
        } else {
            // Map
            return data;
        }
        if (text.length === 0) {
            return null;
        } else if (text.charAt(0) === '{'
            && text.charAt(text.length - 1) === '}') {
            ns.type.JSON.decode(text);
        }
        var info = {};
        var array = split(text);
        var size = array.length;
        if (size === 1) {
            info[defaultKey] = array[0];
        } else {
            info['data'] = array[0];
            info['algorithm'] = array[1];
            if (size > 2) {
                // 'data:...;...,...'
                info['content-type'] = array[2];
                if (text.length > 5 && text.substring(0, 5) === 'data:') {
                    info['URL'] = text;
                }
            }
        }
        return info;
    };

    /**
     *  Format GeneralFactory
     *  ~~~~~~~~~~~~~~~~~~~~~
     */
    var GeneralFactory = function () {
        this.__tedFactories = {};  // name => TransportableData.Factory
        this.__pnfFactory = null;
    };
    Class(GeneralFactory, null, null, null);

    ///
    ///   TED - Transportable Encoded Data
    ///

    GeneralFactory.prototype.getDataAlgorithm = function (ted, defaultValue) {
        return Converter.getString(ted['algorithm'], defaultValue);
    };

    GeneralFactory.prototype.setTransportableDataFactory = function (algorithm, factory) {
        this.__tedFactories[algorithm] = factory;
    };
    GeneralFactory.prototype.getTransportableDataFactory = function (algorithm) {
        return this.__tedFactories[algorithm];
    };

    GeneralFactory.prototype.createTransportableData = function (algorithm, data) {
        var factory = this.getTransportableDataFactory(algorithm);
        return factory.createTransportableData(data);
    };

    GeneralFactory.prototype.parseTransportableData = function (ted) {
        if (!ted) {
            return null;
        } else if (Interface.conforms(ted, TransportableData)) {
            return ted;
        }
        // unwrap
        var info = decode(ted, 'data');
        if (!info) {
            return null;
        }
        var algorithm = this.getDataAlgorithm(info, '*');
        var factory = this.getTransportableDataFactory(algorithm);
        if (!factory) {
            factory = this.getTransportableDataFactory('*');
        }
        return factory.parseTransportableData(info);
    };

    ///
    ///   PNF - Portable Network File
    ///

    GeneralFactory.prototype.setPortableNetworkFileFactory = function (factory) {
        this.__pnfFactory = factory;
    };
    GeneralFactory.prototype.getPortableNetworkFileFactory = function () {
        return this.__pnfFactory;
    };

    GeneralFactory.prototype.createPortableNetworkFile = function (ted, filename, url, password) {
        var factory = this.getPortableNetworkFileFactory();
        return factory.createPortableNetworkFile(ted, filename, url, password);
    };

    GeneralFactory.prototype.parsePortableNetworkFile = function (pnf) {
        if (!pnf) {
            return null;
        } else if (Interface.conforms(pnf, PortableNetworkFile)) {
            return pnf;
        }
        // unwrap
        var info = decode(pnf, 'URL');
        if (!info) {
            return null;
        }
        var factory = this.getPortableNetworkFileFactory();
        return factory.parsePortableNetworkFile(info);
    };

    /**
     *  Format FactoryManager
     *  ~~~~~~~~~~~~~~~~~~~~~
     */
    var FactoryManager = {
        generalFactory: new GeneralFactory()
    };

    //-------- namespace --------
    ns.format.FormatGeneralFactory = GeneralFactory;
    ns.format.FormatFactoryManager = FactoryManager;

})(MONKEY);
