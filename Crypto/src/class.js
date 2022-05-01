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
     * @param {Interface} protocol - interface
     * @return {boolean}
     */
    var conforms = function (object, protocol) {
        if (!object) {
            return false;
        } else if (object instanceof protocol) {
            return true;
        // } else if (ns.type.Object.isBaseType(object)) {
        //     // ignore base types: String, Number, Boolean, Date, ...
        //     return false;
        }
        // var child = Object.getPrototypeOf(object);
        // if (child === Object.getPrototypeOf({})) {
        //     // define interface methods directly?
        //     return false;
        // }
        return check_class(object.constructor, protocol);
    };

    var check_class = function (child, protocol) {
        var interfaces = child._mk_interfaces;
        if (!interfaces) {
            // reach the root
            return false;
        } else if (check_interfaces(interfaces, protocol)) {
            // matched in this level
            return true;
        }
        // check next level (super class)
        var parent = child._mk_parent;
        return parent && check_class(parent, protocol);
    };
    var check_interfaces = function (interfaces, protocol) {
        var child, parents;
        for (var i = 0; i < interfaces.length; ++i) {
            child = interfaces[i];
            if (child === protocol) {
                // found the interface in this level
                return true;
            }
            // check next level (super interfaces)
            parents = child._mk_parents;
            if (parents && check_interfaces(parents, protocol)) {
                // matched in next level
                return true;
            }
        }
        return false;
    };

    /**
     *  Get interfaces
     * @param {Interface|Array} interfaces
     * @return {Interface[]}
     */
    var get_interfaces = function (interfaces) {
        if (!interfaces) {
            return [];
        } else if (interfaces instanceof Array) {
            return interfaces;
        } else {
            return [interfaces];
        }
    };

    /**
     *  Extends function for child class/interface
     *
     * @param {Class|Interface} child
     * @param {{}} functions
     * @return {Class|Interface}
     */
    var set_functions = function (child, functions) {
        if (functions) {
            var names = Object.getOwnPropertyNames(functions);
            var key, fn;
            for (var idx = 0; idx < names.length; ++idx) {
                key = names[idx];
                if (key === 'constructor') {
                    continue;
                }
                fn = functions[key];
                if (typeof fn === 'function') {
                    child.prototype[key] = fn;
                }
            }
        }
        return child;
    };

    /**
     *  Create an interface inherits from other interfaces
     *
     * @param {Interface} child         - sub interface
     * @param {Interface|Array} parents - super interfaces
     */
    var interfacefy = function (child, parents) {
        if (!child) {
            child = function () {};
        }
        // set super interfaces
        child._mk_parents = get_interfaces(parents);
        return child;
    };

    interfacefy.conforms = conforms;

    /**
     *  Create a child class inherits from parent class and interfaces
     *
     * @param {Class} child  - sub class
     * @param {Class} parent - super class
     * @param {Interface|Array} interfaces
     * @param {{}} functions
     * @return {Class}
     */
    var classify = function (child, parent, interfaces, functions) {
        if (!child) {
            child = function () {};
        }
        // extends super class
        if (parent) {
            child._mk_parent = parent;
        } else {
            parent = Object;
        }
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        // set interfaces
        child._mk_interfaces = get_interfaces(interfaces);
        // extends functions
        set_functions(child, functions);
        return child;
    };

    //-------- namespace --------
    ns.Interface = interfacefy;
    ns.Class = classify;

    ns.registers('Interface');
    ns.registers('Class');

})(MONKEY);
