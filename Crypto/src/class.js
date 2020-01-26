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

!function () {

    var extend = function (base) {
        this.prototype = Object.create(base.prototype);
        this.prototype.constructor = this;
        return this;
    };
    var implement = function () {
        for (var index = 0; index < arguments.length; ++index) {
            var prototype = arguments[index].prototype;
            for (var key in prototype) {
                // noinspection JSUnfilteredForInLoop
                if (this.prototype.hasOwnProperty(key)) {
                    continue;
                }
                // noinspection JSUnfilteredForInLoop
                this.prototype[key] = prototype[key];
            }
        }
        return this;
    };

    var inherit = function () {
        // extends BaseClass
        this.prototype = Object.create(arguments[0].prototype);
        // implements Interface(s)
        for (var index = 1; index < arguments.length; ++index) {
            var prototype = arguments[index].prototype;
            for (var key in prototype) {
                // noinspection JSUnfilteredForInLoop
                if (this.prototype.hasOwnProperty(key)) {
                    continue;
                }
                // noinspection JSUnfilteredForInLoop
                this.prototype[key] = prototype[key];
            }
        }
        this.prototype.constructor = this;
        return this;
    };

    //-------- patch --------\\
    if (typeof Function.prototype.inherits !== 'function') {
        Function.prototype.inherits = inherit;
    }

    if (typeof Function.prototype.extends !== 'function') {
        Function.prototype.extends = extend;
    }
    if (typeof Function.prototype.implements !== 'function') {
        Function.prototype.implements = implement;
    }

}();
