/**
 * Cryptography JavaScript Library v0.1.0
 *
 * @author    moKy <albert.moky at gmail.com>
 * @date      Jan. 27, 2020
 * @copyright (c) 2020 Albert Moky
 * @license   {@link https://mit-license.org | MIT License}
 */
! function() {
    var c = function(d) {
        this.prototype = Object.create(d.prototype);
        this.prototype.constructor = this;
        return this
    };
    var b = function(i) {
        var e = i.prototype;
        var h = Object.getOwnPropertyNames(e);
        for (var d = 0; d < h.length; ++d) {
            var f = h[d];
            if (this.prototype.hasOwnProperty(f)) {
                continue
            }
            var g = e[f];
            if (typeof g !== "function") {
                continue
            }
            this.prototype[f] = g
        }
        return this
    };
    var a = function() {
        c.call(this, arguments[0]);
        for (var d = 1; d < arguments.length; ++d) {
            b.call(this, arguments[d])
        }
        return this
    };
    if (typeof Function.prototype.inherits !== "function") {
        Function.prototype.inherits = a
    }
}();
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(b) {
    var c = function() {};
    c.prototype.encode = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    c.prototype.decode = function(g) {
        console.assert(g != null, "string empty");
        console.assert(false, "implement me!");
        return null
    };
    var e = function() {};
    e.inherits(c);
    e.prototype.encode = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "HEX encode not implemented");
        return null
    };
    e.prototype.decode = function(g) {
        console.assert(g != null, "string empty");
        console.assert(false, "HEX decode not implemented");
        return null
    };
    var d = function() {};
    d.inherits(c);
    d.prototype.encode = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "Base58 encode not implemented");
        return null
    };
    d.prototype.decode = function(g) {
        console.assert(g != null, "string empty");
        console.assert(false, "Base58 decode not implemented");
        return null
    };
    var a = function() {};
    a.inherits(c);
    a.prototype.encode = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "Base64 encode not implemented");
        return null
    };
    a.prototype.decode = function(g) {
        console.assert(g != null, "string empty");
        console.assert(false, "Base64 decode not implemented");
        return null
    };
    var f = function(g) {
        this.coder = g
    };
    f.prototype.encode = function(g) {
        return this.coder.encode(g)
    };
    f.prototype.decode = function(g) {
        return this.coder.decode(g)
    };
    if (typeof b.format !== "object") {
        b.format = {}
    }
    b.format.BaseCoder = c;
    b.format.Hex = new f(new e());
    b.format.Base58 = new f(new d());
    b.format.Base64 = new f(new a())
}(DIMP);
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(a) {
    var f = function() {};
    f.prototype.digest = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var d = function() {};
    d.inherits(f);
    d.prototype.digest = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "MD5 not implemented");
        return null
    };
    var c = function() {};
    c.inherits(f);
    c.prototype.digest = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "SHA256 not implemented");
        return null
    };
    var e = function() {};
    e.inherits(f);
    e.prototype.digest = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "RIPEMD160 not implemented");
        return null
    };
    var b = function(g) {
        this.hash = g
    };
    b.prototype.digest = function(g) {
        return this.hash.digest(g)
    };
    if (typeof a.digest !== "object") {
        a.digest = {}
    }
    a.digest.Hash = f;
    a.digest.MD5 = new b(new d());
    a.digest.SHA256 = new b(new c());
    a.digest.RIPEMD160 = new b(new e())
}(DIMP);
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(a) {
    var d = function() {};
    d.prototype.encode = function(e) {
        console.assert(e != null, "container empty");
        console.assert(false, "implement me!");
        return null
    };
    d.prototype.decode = function(e) {
        console.assert(e != null, "string empty");
        console.assert(false, "implement me!");
        return null
    };
    var b = function() {};
    b.inherits(d);
    b.prototype.encode = function(e) {
        return JSON.stringify(e)
    };
    b.prototype.decode = function(e) {
        return JSON.parse(e)
    };
    var c = function(e) {
        this.parser = e
    };
    c.prototype.encode = function(e) {
        return this.parser.encode(e)
    };
    c.prototype.decode = function(e) {
        return this.parser.decode(e)
    };
    if (typeof a.format !== "object") {
        a.format = {}
    }
    a.format.DataParser = d;
    a.format.JSON = new c(new b())
}(DIMP);
! function(a) {
    var d = function() {};
    d.prototype.encodePublicKey = function(e) {
        console.assert(e != null, "public key empty");
        console.assert(false, "implement me!");
        return null
    };
    d.prototype.encodePrivateKey = function(e) {
        console.assert(e != null, "private key empty");
        console.assert(false, "implement me!");
        return null
    };
    d.prototype.decodePublicKey = function(e) {
        console.assert(e != null, "pem content empty");
        console.assert(false, "implement me!");
        return null
    };
    d.prototype.decodePrivateKey = function(e) {
        console.assert(e != null, "pem content empty");
        console.assert(false, "implement me!");
        return null
    };
    var c = function() {};
    c.inherits(d);
    c.prototype.encodePublicKey = function(e) {
        console.assert(e != null, "public key content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    c.prototype.encodePrivateKey = function(e) {
        console.assert(e != null, "private key content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    c.prototype.decodePublicKey = function(e) {
        console.assert(e != null, "pem content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    c.prototype.decodePrivateKey = function(e) {
        console.assert(e != null, "pem content empty");
        console.assert(false, "PEM parser not implemented");
        return null
    };
    var b = function(e) {
        this.parser = e
    };
    b.prototype.encodePublicKey = function(e) {
        return this.parser.encodePublicKey(e)
    };
    b.prototype.encodePrivateKey = function(e) {
        return this.parser.encodePrivateKey(e)
    };
    b.prototype.decodePublicKey = function(e) {
        return this.parser.decodePublicKey(e)
    };
    b.prototype.decodePrivateKey = function(e) {
        return this.parser.decodePrivateKey(e)
    };
    if (typeof a.format !== "object") {
        a.format = {}
    }
    a.format.KeyParser = d;
    a.format.PEM = new b(new c())
}(DIMP);
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(a) {
    var f = {
        encode: function(j) {
            var l = [];
            var g = j.length;
            var k;
            for (var h = 0; h < g; ++h) {
                k = j.charCodeAt(h);
                if (k <= 0) {
                    break
                } else {
                    if (k < 128) {
                        l.push(k)
                    } else {
                        if (k < 2048) {
                            l.push(192 | ((k >> 6) & 31));
                            l.push(128 | ((k >> 0) & 63))
                        } else {
                            l.push(224 | ((k >> 12) & 15));
                            l.push(128 | ((k >> 6) & 63));
                            l.push(128 | ((k >> 0) & 63))
                        }
                    }
                }
            }
            return l
        },
        decode: function(n) {
            var j = "";
            var g = n.length;
            var m, l, h;
            for (var k = 0; k < g; ++k) {
                m = n[k];
                switch (m >> 4) {
                    case 12:
                    case 13:
                        l = n[++k];
                        m = ((m & 31) << 6) | (l & 63);
                        break;
                    case 14:
                        l = n[++k];
                        h = n[++k];
                        m = ((m & 15) << 12) | ((l & 63) << 6) | (h & 63);
                        break
                }
                j += String.fromCharCode(m)
            }
            return j
        }
    };
    var d = function(g) {
        this.data = g
    };
    d.prototype.equals = function(g) {
        console.assert(false, "implement me!");
        return false
    };
    d.prototype.toString = function() {
        return this.data.toString()
    };
    d.prototype.toLocaleString = function() {
        return this.data.toLocaleString()
    };
    d.prototype.toJSON = function() {
        return a.format.JSON.encode(this.data)
    };
    var e = function(g, h) {
        if (h === "UTF-8") {
            g = f.decode(g)
        }
        d.call(this, g)
    };
    e.inherits(d);
    e.prototype.equals = function(g) {
        if (!g) {
            return !this.data
        } else {
            if (g instanceof e) {
                return this.data === g.data
            }
        }
        return this.data === g
    };
    e.prototype.getBytes = function(g) {
        if (!g || g === "UTF-8") {
            return f.encode(this.data)
        }
        return this.data
    };
    var b = {
        equals: function(h, g) {
            if (h === g) {
                return true
            }
            if (h.length !== g.length) {
                return false
            }
            for (var i in h) {
                if (h[i] !== g[i]) {
                    return false
                }
            }
            return true
        },
    };
    var c = function(g) {
        d.call(this, g)
    };
    c.inherits(d);
    c.prototype.equals = function(g) {
        if (!g) {
            return !this.data
        } else {
            if (g instanceof c) {
                return b.equals(this.data, g.data)
            }
        }
        return b.equals(this.data, g)
    };
    c.prototype.allKeys = function() {
        return Object.keys(this.data)
    };
    c.prototype.getValue = function(g) {
        return this.data[g]
    };
    c.prototype.setValue = function(g, h) {
        this.data[g] = h
    };
    if (typeof a.type !== "object") {
        a.type = {}
    }
    a.type.String = e;
    a.type.Dictionary = c;
    a.type.Arrays = b
}(DIMP);
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(b) {
    var e = function() {};
    e.prototype.equals = function(g) {
        console.assert(g != null, "other key empty");
        console.assert(false, "implement me!");
        return false
    };
    e.prototype.getData = function() {
        console.assert(false, "implement me!");
        return null
    };
    e.prototype.getSize = function() {
        console.assert(false, "implement me!");
        return 0
    };
    e.createInstance = function(g, h) {
        if (typeof g.createInstance === "function") {
            return g.createInstance(h)
        } else {
            return new g(h)
        }
    };
    var f = function() {};
    f.inherits(e);
    f.prototype.encrypt = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var c = function() {};
    c.inherits(e);
    c.prototype.decrypt = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var a = function() {};
    a.inherits(e);
    a.prototype.sign = function(g) {
        console.assert(g != null, "data empty");
        console.assert(false, "implement me!");
        return null
    };
    var d = function() {};
    d.inherits(e);
    d.prototype.verify = function(h, g) {
        console.assert(h != null, "data empty");
        console.assert(g != null, "signature empty");
        console.assert(false, "implement me!");
        return false
    };
    if (typeof b.crypto !== "object") {
        b.crypto = {}
    }
    b.crypto.CryptographyKey = e;
    b.crypto.EncryptKey = f;
    b.crypto.DecryptKey = c;
    b.crypto.SignKey = a;
    b.crypto.VerifyKey = d
}(DIMP);
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(a) {
    var g = a.crypto.CryptographyKey;
    var h = a.crypto.EncryptKey;
    var b = a.crypto.DecryptKey;
    var d = a.type.Arrays;
    var f = new a.type.String("Moky loves May Lee forever!");
    f = f.getBytes();
    var e = function() {};
    e.inherits(h, b);
    e.prototype.equals = function(i) {
        var k = i.encrypt(f);
        var j = this.decrypt(k);
        return d.equals(k, j)
    };
    e.generate = function(i) {
        return this.getInstance({
            algorithm: i
        })
    };
    var c = {};
    e.register = function(i, j) {
        c[i] = j
    };
    e.getInstance = function(k) {
        if (k === null) {
            return null
        } else {
            if (k instanceof e) {
                return k
            }
        }
        var i = k["algorithm"];
        var j = c[i];
        if (typeof j === "function") {
            return g.createInstance(j, k)
        }
        throw TypeError("key algorithm error: " + i)
    };
    e.AES = "AES";
    e.DES = "DES";
    a.crypto.SymmetricKey = e
}(DIMP);
if (typeof DIMP !== "object") {
    DIMP = {}
}! function(a) {
    var c = a.crypto.CryptographyKey;
    var b = function() {};
    b.inherits(c);
    b.RSA = "RSA";
    b.ECC = "ECC";
    a.crypto.AsymmetricKey = b
}(DIMP);
! function(b) {
    var g = b.crypto.CryptographyKey;
    var c = b.crypto.AsymmetricKey;
    var f = b.crypto.VerifyKey;
    var e = new b.type.String("Moky loves May Lee forever!");
    e = e.getBytes();
    var d = function() {};
    d.inherits(c, f);
    d.prototype.matches = function(i) {
        if (i === null) {
            return false
        }
        var j = i.getPublicKey();
        if (this.equals(j)) {
            return true
        }
        var h = i.sign(e);
        return this.verify(e, h)
    };
    var a = {};
    d.register = function(h, i) {
        a[h] = i
    };
    d.getInstance = function(j) {
        if (j === null) {
            return null
        } else {
            if (j instanceof d) {
                return j
            }
        }
        var h = j["algorithm"];
        var i = a[h];
        if (typeof i === "function") {
            return g.createInstance(i, j)
        }
        throw TypeError("key algorithm error: " + h)
    };
    b.crypto.PublicKey = d
}(DIMP);
! function(b) {
    var e = b.crypto.CryptographyKey;
    var c = b.crypto.AsymmetricKey;
    var a = b.crypto.SignKey;
    var d = function() {};
    d.inherits(c, a);
    d.prototype.equals = function(g) {
        var h = this.getPublicKey();
        if (h === null) {
            return false
        }
        return h.matches(g)
    };
    d.prototype.getPublicKey = function() {
        console.assert(false, "implement me!");
        return null
    };
    d.generate = function(g) {
        return this.getInstance({
            algorithm: g
        })
    };
    var f = {};
    d.register = function(g, h) {
        f[g] = h
    };
    d.getInstance = function(i) {
        if (i === null) {
            return null
        } else {
            if (i instanceof d) {
                return i
            }
        }
        var g = i["algorithm"];
        var h = f[g];
        if (typeof h === "function") {
            return e.createInstance(h, i)
        }
        throw TypeError("key algorithm error: " + g)
    };
    b.crypto.PrivateKey = d
}(DIMP);
