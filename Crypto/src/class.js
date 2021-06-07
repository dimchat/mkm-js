;
// license: https://mit-license.org
//
//  MONKEY: Memory Object aNd KEYs
//
//                               Written in 2020 by Moky <albert.moky@gmail.com>
//
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

//! require 'namespace.js'

(function (ns) {
    'use strict';

    /**
     *  Check whether the object is an instance of the interface
     *
     * @param {Object} object - instance
     * @param {Class} protocol - interface
     * @return {boolean}
     */
    var conforms = function (object, protocol) {
        if (!object) {
            return false;
        }
        if (object instanceof protocol) {
            return true;
        }
        var child = Object.getPrototypeOf(object);
        var names = Object.getOwnPropertyNames(protocol.prototype);
        for (var i = 0; i < names.length; ++i) {
            if (!child.hasOwnProperty(names[i])) {
                // TODO: check properties in ancestors' prototype?
                return false;
            }
        }
        return true;
    };

    /**
     *  Inherits from an interface
     *
     * @param {Class} child - sub class
     * @param {Class} parent - class or interface
     * @return {Class}
     */
    var inherits = function (child, parent) {
        var prototype = parent.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        var key;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
            if (child.prototype.hasOwnProperty(key)) {
                continue;
            }
            var fn = prototype[key];
            if (typeof fn !== 'function') {
                continue;
            }
            child.prototype[key] = fn;
        }
        return child;
    };

    /**
     *  Inherits from all interfaces
     *
     * @param {Class} child
     * @param {Class[]} interfaces
     * @return {Class}
     */
    var inherits_interfaces = function (child, interfaces) {
        for (var i = 0; i < interfaces.length; ++i) {
            child = inherits(child, interfaces[i]);
        }
        return child;
    };

    /**
     *  Create an interface inherits from other interfaces
     *
     * @param {Class} child         - sub interface
     * @param {Class|Array} parents - parent interfaces
     */
    var interfacefy = function (child, parents) {
        if (!child) {
            child = function () {
            };
        }
        if (parents) {
            var ancestors;
            if (parents instanceof Array) {
                ancestors = parents;
            } else {
                ancestors = [];
                for (var i = 1; i < arguments.length; ++i) {
                    ancestors.push(arguments[i]);
                }
            }
            child = inherits_interfaces(child, ancestors);
        }
        return child;
    };

    interfacefy.conforms = conforms;

    /**
     *  Create a child class inherits from parent class and interfaces
     *
     * @param {Class} child - sub class
     * @param {Class} parent - super class
     * @param {Class|Array} interfaces
     * @return {Class}
     */
    var classify = function (child, parent, interfaces) {
        if (!child) {
            child = function () {
            };
        }
        if (!parent) {
            parent = Object;
        }
        // extends BaseClass
        child.prototype = Object.create(parent.prototype);
        inherits(child, parent);
        // implements Interface(s)
        if (interfaces) {
            var ancestors;
            if (interfaces instanceof Array) {
                ancestors = interfaces;
            } else {
                ancestors = [];
                for (var i = 2; i < arguments.length; ++i) {
                    ancestors.push(arguments[i]);
                }
            }
            child = inherits_interfaces(child, ancestors);
        }
        // noinspection JSUnusedGlobalSymbols
        child.prototype.constructor = child;
        return child;
    };

    //-------- namespace --------
    ns.Interface = interfacefy;
    ns.Class = classify;

    ns.register('Interface');
    ns.register('Class');

})(MONKEY);
