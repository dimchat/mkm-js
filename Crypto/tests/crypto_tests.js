;

//
//  Test Cases
//
crypto_tests = [];

!function (ns) {
    'use strict';

    var Data = ns.type.Data;

    var test_bytes = function () {
        var data = new Data();
        data.push(0x000F);
        data.push(0x00FF);
        data.push(0x0FFF);
        data.push(0xFFFF);
        var bytes = data.getBytes();
        log('bytes: ', bytes);
        assert(bytes.length === 4, 'bytes length error');
        var exp = [0x0F, 0xFF, 0xFF, 0xFF];
        assert(data.equals(exp) === true, 'bytes values error');
        // test concat
        var merged = data.concat([1, 2], 3).toArray();
        log('merged: ', merged);
        assert(merged.length === 7, 'concat error');
    };
    crypto_tests.push(test_bytes);

    var test_string = function () {
        var data = 'Moky';
        var str = new ns.type.String(data);
        log('string: ', str);
        assert(str.equalsIgnoreCase('moky') === true, 'String comparing error');
    };
    crypto_tests.push(test_string);

    var test_utf8 = function () {
        var data = '《道德经》';
        var str = new ns.type.String(data);
        console.assert(str.getLength() === 5, 'UTF-8 length error');
        var bytes = str.getBytes();
        log('utf-8: ', bytes);
        assert(bytes.length === 15, 'bytes length error');
        var exp = [-29, -128, -118, -23, -127, -109, -27, -66, -73, -25, -69, -113, -29, -128, -117];
        exp = new Uint8Array(exp);
        assert(bytes.toString() === exp.toString(), 'UTF-8 bytes value error');

        var dec = new ns.type.String(exp);
        assert(dec.equals(str) === true, 'UTF-8 decode error');
        assert(dec.toString() === data, 'UTF-8 string value error');
    };
    crypto_tests.push(test_utf8);

}(DIMP);

!function (ns) {
    'use strict';

    var Hex = ns.format.Hex;
    var Base64 = ns.format.Base64;
    var Base58 = ns.format.Base58;

    var test_hex = function () {
        var str = ns.type.String.from('moky');
        var bytes = str.getBytes();
        var enc = Hex.encode(bytes);
        log('hex: ' , enc);
        var exp = '6d6f6b79';
        assert(enc === exp, 'encode error');

        var dec = Hex.decode(exp);
        var str2 = new ns.type.String(dec);
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'Hex decode error');
    };
    crypto_tests.push(test_hex);

    // base64(moky) = bW9reQ==
    var test_base64 = function () {
        var str = ns.type.String.from('moky');
        var bytes = str.getBytes();
        var enc = Base64.encode(bytes);
        log('base64: ', enc);
        var exp = 'bW9reQ==';
        assert(enc === exp, 'encode error');

        var dec = Base64.decode(enc);
        var str2 = new ns.type.String(dec);
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'BASE-64 decode error');
    };
    crypto_tests.push(test_base64);

    // base58(moky) = 3oF5MJ
    var test_base58 = function () {
        var str = ns.type.String.from('moky');
        var bytes = str.getBytes();
        var enc = Base58.encode(bytes);
        log('base58: ', enc);
        var exp = '3oF5MJ';
        assert(enc === exp, 'Base-58 encode error');

        var dec = Base58.decode(enc);
        var str2 = new ns.type.String(dec);
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'BASE-58 decode error');
    };
    crypto_tests.push(test_base58);

}(DIMP);

!function (ns) {
    'use strict';

    var Hex = ns.format.Hex;

    var MD5 = ns.digest.MD5;
    var SHA256 = ns.digest.SHA256;
    var RIPEMD160 = ns.digest.RIPEMD160;

    // md5(moky) = d0e5edd3fd12b89154bbe7a5e4c82569
    var test_md5 = function () {
        var str = ns.type.String.from('moky');
        var bytes = str.getBytes();
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
        var str = ns.type.String.from('moky');
        var bytes = str.getBytes();
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
        var str = ns.type.String.from('moky');
        var bytes = str.getBytes();
        var hash = RIPEMD160.digest(bytes);
        if (!hash) {
            return 'not implemented';
        }
        log('ripemd160: ' + Hex.encode(hash));
        var exp = '44bd174123aee452c6ec23a6ab7153fa30fa3b91';
        assert(Hex.encode(hash) === exp, 'RIPEMD-160 digest error');
    };
    crypto_tests.push(test_ripemd160);

}(DIMP);

!function (ns) {
    'use strict';

    var Arrays = ns.type.Arrays;
    var JSON = ns.format.JSON;

    var test_json = function () {
        var container = [1, 2, 3];
        var str = JSON.encode(container);
        log('json: ', str);
        var dec = JSON.decode(str);
        log('json dec: ', dec);
        assert(Arrays.equals(container, dec) === true, 'JSON decode error');
    };
    crypto_tests.push(test_json);

}(DIMP);

!function (ns) {
    'use strict';

    var Hex = ns.format.Hex;
    var Base64 = ns.format.Base64;

    var Arrays = ns.type.Arrays;

    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;
    var PublicKey = ns.crypto.PublicKey;

    var test_rsa = function () {
        var str = ns.type.String.from('moky');
        var data = str.getBytes();
        var SK = PrivateKey.generate(AsymmetricKey.RSA);
        var PK = SK.getPublicKey();
        // test encryption
        var ciphertext = PK.encrypt(data);
        var plaintext = SK.decrypt(ciphertext);
        assert(Arrays.equals(plaintext, data) === true, 'RSA encryption error');
        // test signature
        var signature = SK.sign(data);
        assert(PK.verify(data, signature) === true, 'RSA signature error');

        // test with key data
        var key;
        key = {
            algorithm: AsymmetricKey.RSA,
            data: "-----BEGIN PUBLIC KEY-----\n"
                + "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDET7fvLupUBUc6ImwJejColybq\n"
                + "rU+Y6PwiCKhblGbwVqbvapD2A1hjEu4EtL6mm3v7hcgsO3Df33/ShRua6GW9/JQV\n"
                + "DLfdznLfuTg8w5Ug+dysJfbrmB1G7nbqDYEyXQXNRWpQsLHYSD/ihaSKWNnOuV0c\n"
                + "7ieJEzQAp++O+d3WUQIDAQAB\n"
                + "-----END PUBLIC KEY-----"
        };
        PK = PublicKey.getInstance(key);

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
        SK = PrivateKey.getInstance(key);
        log('PublicKey: ', PK);
        log('PrivateKey: ', SK);

        PK = SK.getPublicKey();
        log('PublicKey: ', PK);

        str = 'moky';
        str = new ns.type.String(str);
        data = str.getBytes('UTF-8');

        //
        //  sign/verify
        //
        var expect = 'Najk0Lv7/DGedw9LXP2lPhZZMKnuR9C5Z1JPun6NQxe98XoZu4puZAi0K7UFsFMHKjKwY26XF8sjakD9dlU8yoXrn8IJg/Ye+O2l6DzyYlW2NQEVbabpS3Wl4g4vEBe2aCqGMaib/wdnGxm5h6h0m35YUtk7pW7yVFlGTvyTgpk=';

        signature = SK.sign(data);
        log('RSA sign(', str, '): ', Hex.encode(signature));
        log('RSA sign(', str, '): ', Base64.encode(signature));
        assert(expect === Base64.encode(signature), 'RSA signature error');
        assert(PK.verify(data, signature) === true, 'RSA verify error');

        //
        //  encrypt/decrypt
        //
        expect = 'PGsWtfUm3m236XHT1QK/lkiG8ZEtn9WpAIdMO9Q3z/qI0pzujSn60rCc/1AFHUAPn7J9S/kqNVXtQwhRTdfLHFL6jWn6N8Id1xAeUVxQGkJRDudRQxbxkbqCuj+T8LjEEA24wq2j6Ekrz0x3tt5QUaD6WeLdcVQPh2SF9DJY3ZY=';

        var enc = PK.encrypt(data);
        log('RSA encrypt:(', str, '): ', Base64.encode(enc));
        var dec = SK.decrypt(enc);
        var result = new ns.type.String(dec);
        log('RSA decrypt:', result);
        assert(str.toString() === result.toString(), 'RSA encrypt error');

        dec = SK.decrypt(Base64.decode(expect));
        result = new ns.type.String(dec);
        log('RSA decrypt:', result);
        assert(str.toString() === result.toString(), 'RSA decrypt error');
    };
    crypto_tests.push(test_rsa);

}(DIMP);

!function (ns) {
    'use strict';

    var Hex = ns.format.Hex;
    var Base64 = ns.format.Base64;

    var Arrays = ns.type.Arrays;

    var SymmetricKey = ns.crypto.SymmetricKey;

    var test_aes = function () {
        var str = ns.type.String.from('moky');
        var data = str.getBytes();
        var password = SymmetricKey.generate(SymmetricKey.AES);
        // test encryption
        var ciphertext = password.encrypt(data);
        var plaintext = password.decrypt(ciphertext);
        assert(Arrays.equals(plaintext, data) === true, 'AES encryption error');

        // test with key data
        var key = {
            algorithm: SymmetricKey.AES,
            data: 'C2+xGizLL1G1+z9QLPYNdp/bPP/seDvNw45SXPAvQqk=',
            iv: 'SxPwi6u4+ZLXLdAFJezvSQ=='
        };
        var pwd = new SymmetricKey.getInstance(key);

        str = new ns.type.String('moky');
        data = str.getBytes('UTF-8');
        var expect = '0xtbqZN6x2aWTZn0DpCoCA==';

        var enc = pwd.encrypt(data);
        log('AES encrypt(', str, '): ', Hex.encode(enc));
        log('AES encrypt(', str, '): ', Base64.encode(enc));
        assert(Base64.encode(enc) === expect, 'AES encrypt error');

        var dec = pwd.decrypt(enc);
        var result = new ns.type.String(dec);
        log('AES decrypt: "' + result, '"');
        assert(result.equals(str) === true, 'AES decrypt error');
    };
    crypto_tests.push(test_aes);

}(DIMP);
