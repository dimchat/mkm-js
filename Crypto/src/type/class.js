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

//! require 'requires.js'


    /**
     *  Create a child class inherits from parent class and interfaces
     *
     * @param {Class|Function} child   - this class
     * @param {Class|Function} parent  - super class
     * @param {Interface[]} interfaces - interfaces
     * @return {Class|Function} this class
     */
    mk.type.Class = function (child, parent, interfaces) {
        if (!child) {
            // 1. create class
            child = function () {
                Object.call(this);
            };
        } else if (typeof child === 'function') {
            // 2. extend class
        } else {
            throw new TypeError('class params error: ' + child + ', ' + parent + ', ' + interfaces);
        }
        // extends super class
        if (typeof parent === 'function') {
            child._mk_super_class = parent;
        } else {
            parent = Object;
        }
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        // set interfaces
        if (interfaces instanceof Array) {
            child._mk_interfaces = interfaces;
        }
        return child;
    };
    var Class = mk.type.Class;

    /**
     *  Merge methods to the target class
     *
     * @param {Class|Function} clazz    - target class
     * @param {Function|Object} methods - functions
     */
    mk.type.Mixin = function (clazz, methods) {
        if (!clazz) {
            // 1. create mixin
            clazz = function () {};
        } else if (typeof clazz === 'function') {
            // 2. mixin methods to target class
        } else {
            throw new TypeError('mixin params error: ' + clazz + ', ' + methods);
        }
        if (typeof methods === 'function') {
            methods = methods.prototype;
        }
        return Implementation(clazz, methods);
    };
    var Mixin = mk.type.Mixin;

    /**
     *  Extends methods for target class
     *
     * @param {Class|Function} clazz - target class
     * @param {Object} methods       - functions
     */
    mk.type.Implementation = function (clazz, methods) {
        // Mapper.forEach(methods, function (name, fn) {
        //     clazz.prototype[name] = fn;
        //     return false;
        // });
        var names = Object.keys(methods);
        var key;
        for (var i = 0; i < names.length; ++i) {
            key = names[i];
            clazz.prototype[key] = methods[key];
        }
        return clazz;
    };
    var Implementation = mk.type.Implementation;

    /**
     *  Create an interface inherits from other interfaces
     *
     * @param {Interface|Function} child - this interface
     * @param {Interface[]} parents      - super interfaces
     * @return {Interface|Function} this interface
     */
    mk.type.Interface = function (child, parents) {
        if (!child) {
            // 1. create interface
            child = function () {};
        } else if (typeof child === 'function') {
            // 2. extend interface
        } else {
            throw new TypeError('interface params error: ' + child + ', ' + parents);
        }
        // set super interfaces
        if (parents instanceof Array) {
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
        if (!constructor) {
            return false;
        }
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
