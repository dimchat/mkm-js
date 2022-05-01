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

    /**
     *  Make an object to be a namespace
     *
     * @param {namespace} space
     * @return {namespace}
     */
    var namespacefy = function (space) {
        space.__all__ = [];
        space.registers = namespace.prototype.registers;
        space.exports = namespace.prototype.exports;
        return space;
    };

    /**
     *  Check whether the space is a namespace
     *
     * @param {Object} space
     * @return {boolean}
     */
    var is_space = function (space) {
        if (space instanceof namespace) {
            return true;
        }
        if (typeof space.exports !== 'function') {
            return false;
        }
        if (typeof space.registers !== 'function') {
            return false;
        }
        return space.__all__ instanceof Array;
    };

    /**
     *  Namespace
     *  ~~~~~~~~~
     */
    var namespace = function () {
        // all registered names
        this.__all__ = [];  // Array<String>
    };

    /**
     *  Register a name in a namespace
     *
     * @param {String} name - class name
     * @throws {SyntaxError} on conflicted
     */
    namespace.prototype.registers = function (name) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name);
        // } else {
        //     throw new SyntaxError('conflict name: ' + name);
        }
    };

    /**
     *  Export this namespace to another namespace
     *
     * @param {namespace} to - another namespace
     * @return {namespace} outer namespace
     */
    namespace.prototype.exports = function (to) {
        var names = this.__all__;
        var name;
        for (var i = 0; i < names.length; ++i) {
            name = names[i];
            export_one(this, to, name);
            to.registers(name);
        }
        return to;
    };
    var export_one = function (from, to, name) {
        var source = from[name];
        var target = to[name];
        if (source === target) {
            // same object, do nothing
        } else if (typeof target === 'undefined') {
            // target not exists, copy directly
            to[name] = source;
        } else if (is_space(source)) {
            // copying namespace to target
            if (!is_space(target)) {
                namespacefy(target);
            }
            source.exports(target);
        } else {
            // copying properties to target
            export_all(source, target);
        }
    };
    var export_all = function (from, to) {
        var names = Object.getOwnPropertyNames(from);
        for (var i = 0; i < names.length; ++i) {
            export_one(from, to, names[i]);
        }
    };

    //-------- namespace --------
    ns.Namespace = namespace;

    namespacefy(ns);

    ns.registers('Namespace');

})(MONKEY);

(function (ns) {
    "use strict";

    ns.assert = console.assert;

    //-------- namespaces --------
    if (typeof ns.type !== 'object') {
        ns.type = new ns.Namespace();
    }
    if (typeof ns.format !== 'object') {
        ns.format = new ns.Namespace();
    }
    if (typeof ns.digest !== 'object') {
        ns.digest = new ns.Namespace();
    }
    if (typeof ns.crypto !== 'object') {
        ns.crypto = new ns.Namespace();
    }

    ns.registers('type');
    ns.registers('format');
    ns.registers('digest');
    ns.registers('crypto');

})(MONKEY);
