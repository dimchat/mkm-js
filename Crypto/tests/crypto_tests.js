;

//
//  Test Cases
//
crypto_tests = [];

(function (ns) {
    'use strict';

    var assert = function (condition, message) {
        if (condition) {
            console.log('Assertion OK: ' + message);
        } else {
            console.assert(false, message);
        }
    };

    var Interface = ns.type.Interface;
    var Class = ns.type.Class;
    var BaseObject = ns.type.BaseObject;

    var Named = Interface(null, null);

    Named.prototype.getName = function () {
        throw new Error('NotImplemented');
    };

    // sing()
    var Singer = Interface(null, [Named]);

    Singer.prototype.sing = function () {
        throw new Error('NotImplemented');
    };

    // fly()
    var Flyer = Interface(null, [Named]);

    Flyer.prototype.fly = function () {
        throw new Error('NotImplemented');
    };

    // run()
    var Runner = Interface(null, [Named]);

    Runner.prototype.run = function () {
        throw new Error('NotImplemented');
    };

    // Bird extends BaseObject implements Singer, Flyer
    var Bird = function (name) {
        BaseObject.call(this);
        this.__name = name;
    };
    Class(Bird, BaseObject, [Singer, Flyer]);
    // Override
    Bird.prototype.getName = function () {
        return this.__name;
    };
    // Override
    Bird.prototype.sing = function () {
        var name = this.getName();
        console.log(name + ' is singing');
    };

    var Ostrich = function (name) {
        Bird.call(this, name);
    };
    Class(Ostrich, Bird, null);
    // Override
    Ostrich.prototype.fly = function () {
        var name = this.getName();
        console.log(name + ' cannot fly');
    };

    var test_class = function () {
        var ostrich = new Ostrich('ostrich');
        ostrich.sing();
        ostrich.fly();
        assert(ostrich instanceof BaseObject, 'ostrich instanceof BaseObject');
        assert(ostrich instanceof Named, 'ostrich instanceof Named');
        assert(ostrich instanceof Singer, 'ostrich instanceof Singer');
        assert(ostrich instanceof Flyer, 'ostrich instanceof Flyer');
        assert(ostrich instanceof Runner, 'ostrich instanceof Runner');
        assert(Interface.conforms(ostrich, Named), 'ostrich conforms Named');
        assert(Interface.conforms(ostrich, Singer), 'ostrich conforms Singer');
        assert(Interface.conforms(ostrich, Flyer), 'ostrich conforms Flyer');
        assert(Interface.conforms(ostrich, Runner), 'ostrich conforms Runner');
    };
    crypto_tests.push(test_class);

})(MONKEY);

(function (ns) {
    'use strict';

    var UTF8 = ns.format.UTF8;
    var Enum = ns.type.Enum;
    var Arrays = ns.type.Arrays;
    var Dictionary = ns.type.Dictionary;
    var ConstantString = ns.type.ConstantString;

    var test_dictionary = function () {
        var obj1 = {
            name: 'Moky',
            age: 18
        };
        var obj2 = {
            name: 'Moky',
            age: 18
        };
        var dict1 = new Dictionary(obj1);
        var dict2 = new Dictionary(obj2);
        var equals = Arrays.equals(dict1, dict2);
        assert(equals === true, 'dictionary compare error');
    };
    crypto_tests.push(test_dictionary);

    var test_enum = function () {
        var MetaType = Enum(null, {

            Default: (0x01),
            MKM:     (0x01),  // 0000 0001

            BTC:     (0x02),  // 0000 0010
            ExBTC:   (0x03),  // 0000 0011

            ETH:     (0x04),  // 0000 0100
            ExETH:   (0x05)   // 0000 0101
        });
        log('enum: ' + MetaType);

        /**
         *
         * @param version {MetaType}
         */
        var gen = function (version) {
            log('version: ', version.valueOf());
        };
        gen(MetaType.Default);

        var ver = new MetaType(0x02);
        log('ver:' , ver);
        gen(ver);
    };
    crypto_tests.push(test_enum);

    var test_string = function () {
        var data = 'Moky';
        var str = new ConstantString(data);
        log('string: ', str);
        assert(str.equalsIgnoreCase('moky') === true, 'String comparing error');
    };
    crypto_tests.push(test_string);

    var test_utf8 = function () {
        var data = '《道德经》';
        var str = new ConstantString(data);
        assert(str.getLength() === 5, 'UTF-8 length error');
        var bytes = UTF8.encode(str.toString());
        log('utf-8: ', bytes);
        assert(bytes.length === 15, 'bytes length error');
        var exp = [-29, -128, -118, -23, -127, -109, -27, -66, -73, -25, -69, -113, -29, -128, -117];
        exp = new Uint8Array(exp);
        assert(bytes.toString() === exp.toString(), 'UTF-8 bytes value error');

        var dec = new ConstantString(UTF8.decode(exp));
        assert(dec.equals(str) === true, 'UTF-8 decode error');
        assert(dec.toString() === data, 'UTF-8 string value error');
    };
    crypto_tests.push(test_utf8);

})(MONKEY);

(function (ns) {
    'use strict';

    var Arrays = ns.type.Arrays;
    var JsON = ns.format.JSON;

    var test_json = function () {
        var container = [1, 2, 3];
        var str = JsON.encode(container);
        log('json: ', str);
        var dec = JsON.decode(str);
        log('json dec: ', dec);
        assert(Arrays.equals(container, dec) === true, 'JSON decode error');
    };
    crypto_tests.push(test_json);

})(MONKEY);

(function (ns) {
    'use strict';

    var UTF8 = ns.format.UTF8;
    var Hex = ns.format.Hex;
    var Base64 = ns.format.Base64;
    var Base58 = ns.format.Base58;
    var ConstantString = ns.type.ConstantString;

    var str = new ConstantString('moky');
    var bytes = UTF8.encode(str.toString());

    var test_hex = function () {
        var enc = Hex.encode(bytes);
        log('hex: ' , enc);
        var exp = '6d6f6b79';
        assert(enc === exp, 'encode error');

        var dec = Hex.decode(exp);
        var str2 = new ConstantString(UTF8.decode(dec));
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'Hex decode error');
    };
    crypto_tests.push(test_hex);

    // base64(moky) = bW9reQ==
    var test_base64 = function () {
        var enc = Base64.encode(bytes);
        log('base64: ', enc);
        var exp = 'bW9reQ==';
        assert(enc === exp, 'encode error');

        var dec = Base64.decode(enc);
        var str2 = new ConstantString(UTF8.decode(dec));
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'BASE-64 decode error');
    };
    crypto_tests.push(test_base64);

    // base58(moky) = 3oF5MJ
    var test_base58 = function () {
        var enc = Base58.encode(bytes);
        log('base58: ', enc);
        var exp = '3oF5MJ';
        assert(enc === exp, 'Base-58 encode error');

        var dec = Base58.decode(enc);
        var str2 = new ConstantString(UTF8.decode(dec));
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'BASE-58 decode error');
    };
    crypto_tests.push(test_base58);

})(MONKEY);

(function (ns) {
    'use strict';

    var UTF8 = ns.format.UTF8;
    var Hex = ns.format.Hex;

    var MD5 = ns.digest.MD5;
    var SHA256 = ns.digest.SHA256;
    var RIPEMD160 = ns.digest.RIPEMD160;

    var ConstantString = ns.type.ConstantString;

    var str = new ConstantString('moky');
    var bytes = UTF8.encode(str.toString());

    // md5(moky) = d0e5edd3fd12b89154bbe7a5e4c82569
    var test_md5 = function () {
        var hash = MD5.digest(bytes);
        if (!hash) {
            return 'not implemented';
        }
        log('sha256: ' + Hex.encode(hash));
        var exp = 'd0e5edd3fd12b89154bbe7a5e4c82569';
        assert(Hex.encode(hash) === exp, 'MD5 digest error');
    };
    crypto_tests.push(test_md5);

    // sha256(moky）= cb98b739dd699aa44bb6ebba128d20f2d1e10bb3b4aa5ff4e79295b47e9ed76d
    var test_sha256 = function () {
        var hash = SHA256.digest(bytes);
        if (!hash) {
            return 'not implemented';
        }
        log('sha256: ' + Hex.encode(hash));
        var exp = 'cb98b739dd699aa44bb6ebba128d20f2d1e10bb3b4aa5ff4e79295b47e9ed76d';
        assert(Hex.encode(hash) === exp, 'SHA-256 digest error');
    };
    crypto_tests.push(test_sha256);

    // ripemd160(moky) = 44bd174123aee452c6ec23a6ab7153fa30fa3b91
    var test_ripemd160 = function () {
        var hash = RIPEMD160.digest(bytes);
        if (!hash) {
            return 'not implemented';
        }
        log('ripemd160: ' + Hex.encode(hash));
        var exp = '44bd174123aee452c6ec23a6ab7153fa30fa3b91';
        assert(Hex.encode(hash) === exp, 'RIPEMD-160 digest error');
    };
    crypto_tests.push(test_ripemd160);

})(MONKEY);

(function (ns) {
    'use strict';

    var UTF8 = ns.format.UTF8;
    var Hex = ns.format.Hex;
    var Base64 = ns.format.Base64;

    var Arrays = ns.type.Arrays;
    var ConstantString = ns.type.ConstantString;

    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PublicKey = ns.crypto.PublicKey;

    var str = new ConstantString('moky');
    var bytes = UTF8.encode(str.toString());

    var test_rsa = function () {
        var SK = PrivateKey.generate(AsymmetricKey.RSA);
        var PK = SK.getPublicKey();
        // test encryption
        var ciphertext = PK.encrypt(bytes);
        var plaintext = SK.decrypt(ciphertext);
        assert(Arrays.equals(plaintext, bytes) === true, 'RSA encryption error');
        // test signature
        var signature = SK.sign(bytes);
        assert(PK.verify(bytes, signature) === true, 'RSA signature error');

        // test with key data
        var key = {
            algorithm: AsymmetricKey.RSA,
            data: "-----BEGIN PUBLIC KEY-----\n"
                + "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDET7fvLupUBUc6ImwJejColybq\n"
                + "rU+Y6PwiCKhblGbwVqbvapD2A1hjEu4EtL6mm3v7hcgsO3Df33/ShRua6GW9/JQV\n"
                + "DLfdznLfuTg8w5Ug+dysJfbrmB1G7nbqDYEyXQXNRWpQsLHYSD/ihaSKWNnOuV0c\n"
                + "7ieJEzQAp++O+d3WUQIDAQAB\n"
                + "-----END PUBLIC KEY-----"
        };
        PK = PublicKey.parse(key);

        key = {
            algorithm: AsymmetricKey.RSA,
            data: "-----BEGIN RSA PRIVATE KEY-----\n"
                + "MIICXAIBAAKBgQDET7fvLupUBUc6ImwJejColybqrU+Y6PwiCKhblGbwVqbvapD2\n"
                + "A1hjEu4EtL6mm3v7hcgsO3Df33/ShRua6GW9/JQVDLfdznLfuTg8w5Ug+dysJfbr\n"
                + "mB1G7nbqDYEyXQXNRWpQsLHYSD/ihaSKWNnOuV0c7ieJEzQAp++O+d3WUQIDAQAB\n"
                + "AoGAA+J7dnBYWv4JPyth9ayNNLLcBmoUUIdwwNgow7orsM8YKdXzJSkjCT/dRarR\n"
                + "eIDMaulmcQiils2IjSEM7ytw4vEOPWY0AVj2RPhD83GcYyw9sUcTaz22R5UgsQ8X\n"
                + "7ikqBX+YO+diVBf2EqAoEihdO8App6jtlsQGsUjjlrKQIMECQQDSphyRLixymft9\n"
                + "bip7N6YZA5RoiO1yJhPn6X2EQ0QxX8IwKlV654jhDcLsPBUJsbxYK0bWfORZLi8V\n"
                + "+ambjnbxAkEA7pNmEvw/V+zw3DDGizeyRbhYgeZxAgKwXd8Vxd6pFl4iQRmvu0is\n"
                + "d94jZzryBycP6HSRKN11stnDJN++5TEVYQJALfTjoqDqPY5umazhQ8SeTjLDvBKz\n"
                + "iwXXre743VQ3mnYDzbJOt+OvrznrXtK03EqUhr/aUo0o3HQA/dBcOn3YYQJBAM98\n"
                + "yAh48wogGnYVwYbwgI3cPrVy2hO6jPKHAyOce4flhHsDwO7rzHtPaZDtFfMciNxN\n"
                + "DLXyrNtIQkx+f0JLBuECQCUfuJGL+qbExpD3tScBJPAIJ8ZVRVbTcL3eHC9q6gx3\n"
                + "7Fmn9KfbQrUHPwwdo5nuK+oVVYnFkyKGPSer7ras8ro=\n"
                + "-----END RSA PRIVATE KEY-----"
        };
        SK = PrivateKey.parse(key);
        log('PublicKey: ', PK);
        log('PrivateKey: ', SK);

        PK = SK.getPublicKey();
        log('PublicKey: ', PK);

        //
        //  sign/verify
        //
        var expect = 'Najk0Lv7/DGedw9LXP2lPhZZMKnuR9C5Z1JPun6NQxe98XoZu4puZAi0K7UFsFMHKjKwY26XF8sjakD9dlU8yoXrn8IJg/Ye+O2l6DzyYlW2NQEVbabpS3Wl4g4vEBe2aCqGMaib/wdnGxm5h6h0m35YUtk7pW7yVFlGTvyTgpk=';

        signature = SK.sign(bytes);
        log('RSA sign(', str, '): ', Hex.encode(signature));
        log('RSA sign(', str, '): ', Base64.encode(signature));
        assert(expect === Base64.encode(signature), 'RSA signature error');
        assert(PK.verify(bytes, signature) === true, 'RSA verify error');

        //
        //  encrypt/decrypt
        //
        expect = 'PGsWtfUm3m236XHT1QK/lkiG8ZEtn9WpAIdMO9Q3z/qI0pzujSn60rCc/1AFHUAPn7J9S/kqNVXtQwhRTdfLHFL6jWn6N8Id1xAeUVxQGkJRDudRQxbxkbqCuj+T8LjEEA24wq2j6Ekrz0x3tt5QUaD6WeLdcVQPh2SF9DJY3ZY=';

        var enc = PK.encrypt(bytes);
        log('RSA encrypt:(', str, '): ', Base64.encode(enc));
        var dec = SK.decrypt(enc);
        var result = new ConstantString(UTF8.decode(dec));
        log('RSA decrypt:', result);
        assert(str.toString() === result.toString(), 'RSA encrypt error');

        dec = SK.decrypt(Base64.decode(expect));
        result = new ConstantString(UTF8.decode(dec));
        log('RSA decrypt:', result);
        assert(str.toString() === result.toString(), 'RSA decrypt error');
    };
    crypto_tests.push(test_rsa);

})(MONKEY);

(function (ns) {
    'use strict';

    var UTF8 = ns.format.UTF8;
    var Hex = ns.format.Hex;
    var Base64 = ns.format.Base64;

    var Arrays = ns.type.Arrays;
    var ConstantString = ns.type.ConstantString;

    var SymmetricKey = ns.crypto.SymmetricKey;

    var str = new ConstantString('moky');
    var bytes = UTF8.encode(str.toString());

    var test_aes = function () {
        var password = SymmetricKey.generate(SymmetricKey.AES);
        // test encryption
        var ciphertext = password.encrypt(bytes);
        var plaintext = password.decrypt(ciphertext);
        assert(Arrays.equals(plaintext, bytes) === true, 'AES encryption error');

        // test with key data
        var key = {
            algorithm: SymmetricKey.AES,
            data: 'C2+xGizLL1G1+z9QLPYNdp/bPP/seDvNw45SXPAvQqk=',
            iv: 'SxPwi6u4+ZLXLdAFJezvSQ=='
        };
        var pwd = new SymmetricKey.parse(key);

        var expect = '0xtbqZN6x2aWTZn0DpCoCA==';

        var enc = pwd.encrypt(bytes);
        log('AES encrypt(', str, '): ', Hex.encode(enc));
        log('AES encrypt(', str, '): ', Base64.encode(enc));
        assert(Base64.encode(enc) === expect, 'AES encrypt error');

        var dec = pwd.decrypt(enc);
        var result = new ConstantString(UTF8.decode(dec));
        log('AES decrypt("' + expect + '"): "' + result + '"');
        assert(result.equals(str) === true, 'AES decrypt error');
    };
    crypto_tests.push(test_aes);

})(MONKEY);
