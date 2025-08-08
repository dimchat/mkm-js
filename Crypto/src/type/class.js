'use strict';
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

/**
 *  Create a child class inherits from parent class and interfaces
 *
 * @param {Class|Function} child  - sub class
 * @param {Class|Function} parent - super class
 * @param {Interface[]} interfaces
 * @param {{}} methods   - functions
 * @return {Class} sub class
 */
mk.type.Class = function (child, parent, interfaces, methods) {
    if (!child) {
        child = function () {
            Object.call(this);
        };
    }
    // extends super class
    if (parent) {
        child._mk_super_class = parent;
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
        override_methods(child, methods);
    }
    return child;
};
var Class = mk.type.Class;

/**
 *  Extends methods for child class/interface
 *
 * @param {Class|Function} clazz - sub class/interface
 * @param {{}} methods            - functions
 */
var override_methods = function (clazz, methods) {
    var names = Object.keys(methods);
    var key, fn;
    for (var i = 0; i < names.length; ++i) {
        key = names[i];
        fn = methods[key];
        if (typeof fn === 'function') {
            clazz.prototype[key] = fn;
        }
    }
};

/**
 *  Create an interface inherits from other interfaces
 *
 * @param {Interface|Function} child     - sub interface
 * @param {Interface[]} parents - super interfaces
 * @return {Interface} sub interface
 */
mk.type.Interface = function (child, parents) {
    if (!child) {
        child = function () {};
    }
    // set super interfaces
    if (parents) {
        child._mk_super_interfaces = parents;
    }
    return child;
};
var Interface = mk.type.Interface;

/**
 *  Check whether the object is an instance of the interface
 *
 * @param {Object} object - instance
 * @param {Interface} protocol - interface
 * @return {boolean}
 */
Interface.conforms = function (object, protocol) {
    if (!object) {
        return false;
    } else if (object instanceof protocol) {
        return true;
    // } else if (mk.type.Object.isBaseType(object)) {
    //     // ignore base types: String, Number, Boolean, Date, ...
    //     return false;
    }
    // var child = Object.getPrototypeOf(object);
    // if (child === Object.getPrototypeOf({})) {
    //     // define interface methods directly?
    //     return false;
    // }
    return check_extends(object.constructor, protocol);
};

var check_extends = function (constructor, protocol) {
    var interfaces = constructor._mk_interfaces;
    if (interfaces && check_implements(interfaces, protocol)) {
        // matched in this level
        return true;
    }
    // check next level (super class)
    var parent = constructor._mk_super_class;
    return parent && check_extends(parent, protocol);
};

var check_implements = function (interfaces, protocol) {
    var child, parents;
    for (var i = 0; i < interfaces.length; ++i) {
        child = interfaces[i];
        if (child === protocol) {
            // found the interface in this level
            return true;
        }
        // check next level (super interfaces)
        parents = child._mk_super_interfaces;
        if (parents && check_implements(parents, protocol)) {
            // matched in next level
            return true;
        }
    }
    return false;
};
