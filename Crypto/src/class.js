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

!function () {
    'use strict';

    var is_instanceof = function (clazz) {
        if (this instanceof clazz) {
            return true;
        }
        var me = Object.getPrototypeOf(this);
        var prototype = clazz.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        for (var j = 0; j < names.length; ++j) {
            var key = names[j];
            // noinspection JSUnfilteredForInLoop
            if (!me.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };

    var implement = function (protocol) {
        var prototype = protocol.prototype;
        var names = Object.getOwnPropertyNames(prototype);
        for (var j = 0; j < names.length; ++j) {
            var key = names[j];
            // noinspection JSUnfilteredForInLoop
            if (this.prototype.hasOwnProperty(key)) {
                continue;
            }
            // noinspection JSUnfilteredForInLoop
            var fn = prototype[key];
            if (typeof fn !== 'function') {
                continue;
            }
            this.prototype[key] = fn;
        }
        return this;
    };

    var extend = function (base) {
        this.prototype = Object.create(base.prototype);
        this.prototype.constructor = this;
        return this;
    };

    var inherits = function () {
        // extends BaseClass
        extend.call(this, arguments[0]);
        // implements Interface(s)
        for (var i = 0; i < arguments.length; ++i) {
            implement.call(this, arguments[i]);
        }
        return this;
    };

    //-------- patch --------

    if (typeof Object.prototype.isinstanceof !== 'function') {
        Object.prototype.isinstanceof = is_instanceof;
    }

    if (typeof Function.prototype.inherits !== 'function') {
        Function.prototype.inherits = inherits;
    }

    //
    //  Array
    //
    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function (item, start) {
            if (!start) {
                start = 0;
            }
            var length = this.length;
            for (var i = start; i < length; ++i) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        }
    }
    if (typeof Array.prototype.contains !== 'function') {
        Array.prototype.contains = function (item) {
            return this.indexOf(item) >= 0;
        }
    }
    if (typeof Array.prototype.remove !== 'function') {
        Array.prototype.remove = function (item) {
            var index = this.indexOf(item);
            if (index < 0) {
                return null;
            }
            return this.splice(index, 1);
        }
    }

}();
