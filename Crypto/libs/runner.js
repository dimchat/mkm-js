;
(function (ns) {
    'use strict';

    const run = function (fn, name) {
        const dl = document.createElement('dl');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.innerText = name;
        try {
            let res = fn();
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

    const Runner = function (output) {
        let tray = output;
        if (typeof output === 'string') {
            tray = document.getElementById(output);
        }
        tray.innerHTML = '';
        this.tray = tray;
    };

    Runner.prototype.run = function (cases) {
        let fn, res;
        for (let i = 0; i < cases.length; ++i) {
            fn = cases[i];
            res = run(fn, fn.name);
            this.tray.appendChild(res);
        }
    };

    ns.Runner = Runner;

})(window);
