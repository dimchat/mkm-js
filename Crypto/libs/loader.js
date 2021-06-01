;
(function (ns) {
    'use strict';

    function loadJS(src) {
        const script = document.createElement("script");
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

        const heads = document.getElementsByTagName("head");
        const head = (heads && heads.length > 0) ? heads[0] : document.documentElement;
        head.appendChild(script);
    }

    const Loader = function (base) {
        this.base = base;
    };

    Loader.prototype.importJS = function (src) {
        if (!src) {
            return;
        }
        let url;
        if (src.indexOf('://') > 0) {
            // absolute URL
            url = src;
        } else if (src[0] === '/') {
            // absolute path
            let pos = this.base.indexOf('://');
            pos = this.base.indexOf('/', pos + 3);
            url = this.base.substring(0, pos) + src;
        } else {
            // relative path
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
            const onload = window.onload;
            window.onload = function (ev) {
                if (typeof onload === 'function') {
                    onload(ev);
                }
                fn(ev);
            };
        }
    }

})(window);
