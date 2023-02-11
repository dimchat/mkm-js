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

if (typeof MONKEY !== 'object') {
    MONKEY = {};
}

(function (ns) {
    "use strict";

    //-------- namespaces --------
    if (typeof ns.type !== 'object') {
        ns.type = {};
    }
    if (typeof ns.format !== 'object') {
        ns.format = {};
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = {};
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = {};
    }

})(MONKEY);

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
    var check_class = function (constructor, protocol) {
        var interfaces = constructor._mk_interfaces;
        if (interfaces && check_interfaces(interfaces, protocol)) {
            // matched in this level
            return true;
        }
        // check next level (super class)
        var parent = constructor._mk_parent;
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
     *  Extends methods for child class/interface
     *
     * @param {Class} clazz
     * @param {{}} methods
     * @return {Class}
     */
    var def_methods = function (clazz, methods) {
        var names = Object.keys(methods);
        var key, fn;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
            fn = methods[key];
            if (typeof fn === 'function') {
                clazz.prototype[key] = fn;
            }
        }
        return clazz;
    };

    /**
     *  Create an interface inherits from other interfaces
     *
     * @param {Interface} child     - sub interface
     * @param {Interface[]} parents - super interfaces
     * @return {Interface} sub interface
     */
    var interfacefy = function (child, parents) {
        if (!child) {
            child = function () {};
        }
        // set super interfaces
        if (parents) {
            child._mk_parents = parents;
        }
        return child;
    };

    interfacefy.conforms = conforms;

    /**
     *  Create a child class inherits from parent class and interfaces
     *
     * @param {Class} child  - sub class
     * @param {Class} parent - super class
     * @param {Interface[]} interfaces
     * @param {{}} methods   - functions
     * @return {Class} sub class
     */
    var classify = function (child, parent, interfaces, methods) {
        if (!child) {
            child = function () {
                Object.call(this);
            };
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
        if (interfaces) {
            child._mk_interfaces = interfaces;
        }
        // extend functions
        if (methods) {
            def_methods(child, methods);
        }
        return child;
    };

    //-------- namespace --------
    ns.type.Interface = interfacefy;
    ns.type.Class = classify;

})(MONKEY);
