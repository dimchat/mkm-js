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

//! require 'namespace.js'

!function (ns) {
    'use strict';

    /**
     *  Check whether the object is an instance of the interface
     *
     * @param object {Object} - instance
     * @param protocol {Class} - interface
     * @returns {boolean}
     */
    var conforms = function (object, protocol) {
        if (object instanceof protocol) {
            return true;
        }
        var child = Object.getPrototypeOf(object);
        var names = Object.getOwnPropertyNames(protocol.prototype);
        for (var i = 0; i < names.length; ++i) {
            if (!child.hasOwnProperty(names[i])) {
                return false;
            }
        }
        return true;
    };

    /**
     *  Inherits from an interface
     *
     * @param clazz {Class} - sub class
     * @param protocol {Class} - class or interface
     * @returns {Class}
     */
    var inherit = function (clazz, protocol) {
        var prototype = protocol.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        for (var i = 0; i < names.length; ++i) {
            var key = names[i];
            if (clazz.prototype.hasOwnProperty(key)) {
                continue;
            }
            var fn = prototype[key];
            if (typeof fn !== 'function') {
                continue;
            }
            clazz.prototype[key] = fn;
        }
        return clazz;
    };

    /**
     *  Inherits from interfaces
     *
     * @param clazz {Class} - subclass
     * @param interfaces {Class[]} - parent class or interfaces
     * @returns {Class}
     */
    var inherits = function (clazz, interfaces) {
        for (var i = 0; i < interfaces.length; ++i) {
            clazz = inherit(clazz, interfaces[i]);
        }
        return clazz;
    };

    /**
     *  Create an interface inherits from other interfaces
     *
     * @param child {Class} - sub interface
     * @param parent {Class[]} - parent interfaces
     */
    var interfacefy = function (child, parent) {
        if (!child) {
            child = function () {
            };
        }
        if (parent) {
            if (!(parent instanceof Array)) {
                // convert arguments to list
                var list = [];
                for (var i = 1; i < arguments.length; ++i) {
                    list.push(arguments[i]);
                }
                parent = list;
            }
            child = inherits(child, parent);
        }
        return child;
    };

    interfacefy.conforms = conforms;

    /**
     *  Create a child class inherits from parent class and interfaces
     *
     * @param child {Class} - subclass
     * @param parent {Class} - super class
     * @param interfaces {Class[]} - interfaces
     * @returns {Class}
     * @constructor
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
        inherit(child, parent);
        // implements Interface(s)
        if (interfaces) {
            if (!(interfaces instanceof Array)) {
                // convert arguments to list
                var list = [];
                for (var i = 2; i < arguments.length; ++i) {
                    list.push(arguments[i]);
                }
                interfaces = list;
            }
            child = inherits(child, interfaces);
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

}(DIMP);
