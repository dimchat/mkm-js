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

if (typeof DIMP !== 'object') {
    DIMP = {};
}

!function (ns) {
    "use strict";

    var is_space = function (space) {
        if (typeof space.exports !== 'function') {
            return false;
        }
        if (typeof space.register !== 'function') {
            return false;
        }
        return space.__all__ instanceof Array;
    };

    /**
     *  Register a class into current namespace with name
     *
     * @param name
     */
    var register = function (name/*, clazz*/) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name);
            // space[name] = clazz;
            return true;
        } else {
            // throw Error('conflict name: ' + name);
            return false;
        }
    };

    /**
     *  Export from classes in current namespace
     *
     * @param outerSpace - namespace
     */
    var exports = function (outerSpace) {
        if (!is_space(outerSpace)) {
            // make sure the outer is a namespace
            namespace(outerSpace);
        }
        // copy all registered objects from inner space to outer space
        var all = this.__all__;
        var name, inner;
        for (var i = 0; i < all.length; ++i) {
            name = all[i];
            inner = this[name];
            if (!inner) {
                throw Error('empty object: ' + name);
            }
            if (is_space(inner)) {
                // inner space
                if (typeof outerSpace[name] !== 'object') {
                    outerSpace[name] = {};
                }
                inner.exports(outerSpace[name]);
            } else if (outerSpace.hasOwnProperty(name)) {
                // throw Error('conflict name: ' + name);
            } else {
                outerSpace[name] = inner;
            }
            outerSpace.register(name);
        }
        return outerSpace;
    };

    /**
     *  Make an object to be a namespace
     *
     * @param space
     */
    var namespace = function (space) {
        if (!space) {
            space = {};
        }
        if (!(space.__all__ instanceof Array)) {
            space.__all__ = [];
        }
        space.register = register;
        space.exports = exports;
        return space;
    };

    //-------- namespace --------
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

    namespace(ns);
    namespace(ns.type);
    namespace(ns.format);
    namespace(ns.digest);
    namespace(ns.crypto);

    ns.namespace = namespace;
    ns.register('type');
    ns.register('format');
    ns.register('digest');
    ns.register('crypto');

}(DIMP);
