;
(function (ns) {
    'use strict';

    var run = function (fn, name) {
        var dl = document.createElement('dl');
        var dt = document.createElement('dt');
        var dd = document.createElement('dd');
        dt.innerText = name;
        try {
            var res = fn();
            if (!res) {
                res = 'OK';
            }
            dd.innerText = res;
            if (res !== 'OK') {
                dl.className = 'warning';
            }
        } catch (e) {
            dd.innerText = e.toLocaleString();
            dl.className = 'error';
        }
        dl.appendChild(dt);
        dl.appendChild(dd);
        return dl;
    };

    var Runner = function (output) {
        var tray = output;
        if (typeof output === 'string') {
            tray = document.getElementById(output);
        }
        tray.innerHTML = '';
        this.tray = tray;
    };

    Runner.prototype.run = function (cases) {
        var fn, res;
        for (var i = 0; i < cases.length; ++i) {
            fn = cases[i];
            res = run(fn, fn.name);
            this.tray.appendChild(res);
        }
    };

    ns.Runner = Runner;

})(window);
