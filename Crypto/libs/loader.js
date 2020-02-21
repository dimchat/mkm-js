;

!function (ns) {
    'use strict';

    function loadJS(src) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.async = false;
        script.defer = true;

        // callback
        script.onload = function(ev) {
            // TODO:
        };
        script.onreadystatechange = function(ev) { // IE
            if (this.readyState === "complete") {
                script.onload(ev);
            }
        };

        var heads = document.getElementsByTagName("head");
        var head = (heads && heads.length > 0) ? heads[0] : document.documentElement;
        head.appendChild(script);
    }

    var Loader = function (base) {
        this.base = base;
    };

    Loader.prototype.importJS = function (src) {
        var url = src;
        if (src.indexOf('://') < 0) {
            url = this.base + src;
        }
        loadJS(url);
    };

    ns.Loader = Loader;

    //
    //  onload
    //
    if (typeof ns.$ !== 'function') {
        ns.$ = function (fn) {
            var onload = window.onload;
            window.onload = function (ev) {
                if (typeof onload === 'function') {
                    onload(ev);
                }
                fn(ev);
            };
        }
    }

}(window);
