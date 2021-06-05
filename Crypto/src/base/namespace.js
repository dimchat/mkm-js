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

(function (ns) {
    "use strict";

    /**
     *  Make an object to be a namespace
     *
     * @param {namespace} space
     * @return {namespace}
     */
    var namespacefy = function (space) {
        if (!space) {
            space = new namespace();
        } else if (!is_space(space)) {
            space.__all__ = [];
            space.register = namespace.prototype.register;
            space.exports = namespace.prototype.exports;
        }
        return space;
    };

    var is_space = function (space) {
        if (space instanceof namespace) {
            return true;
        }
        if (typeof space.exports !== 'function') {
            return false;
        }
        if (typeof space.register !== 'function') {
            return false;
        }
        return space.__all__ instanceof Array;
    };

    //
    //  Namespace
    //
    var namespace = function () {
        // all registered names
        this.__all__ = [];  // Array<String>
    };

    /**
     *  Register a class into current namespace with name
     *
     * @param {String} name to export from ths space
     */
    namespace.prototype.register = function (name/*, clazz*/) {
        if (this.__all__.indexOf(name) < 0) {
            this.__all__.push(name);
            // space[name] = clazz;
            return true;
        } else {
            // throw new Error('conflict name: ' + name);
            return false;
        }
    };

    /**
     *  Export from classes in current namespace
     *
     * @param {namespace} outerSpace - outer namespace
     */
    namespace.prototype.exports = function (outerSpace) {
        // make sure the outer is a namespace
        namespacefy(outerSpace);
        // copy all registered objects from inner space to outer space
        var all = this.__all__;
        var name, inner;
        for (var i = 0; i < all.length; ++i) {
            name = all[i];
            inner = this[name];
            if (!inner) {
                throw new Error('empty object: ' + name);
            }
            if (is_space(inner)) {
                // inner space
                if (typeof outerSpace[name] !== 'object') {
                    outerSpace[name] = new namespace();
                }
                inner.exports(outerSpace[name]);
            } else if (outerSpace.hasOwnProperty(name)) {
                // throw new Error('conflict name: ' + name);
            } else {
                outerSpace[name] = inner;
            }
            outerSpace.register(name);
        }
        return outerSpace;
    };

    //-------- namespace --------
    ns.Namespace = namespacefy;

    namespacefy(ns);

    ns.register('Namespace');

})(DIMP);

(function (ns) {
    "use strict";

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

    ns.Namespace(ns.type);
    ns.Namespace(ns.format);
    ns.Namespace(ns.digest);
    ns.Namespace(ns.crypto);

    ns.register('type');
    ns.register('format');
    ns.register('digest');
    ns.register('crypto');

})(DIMP);
