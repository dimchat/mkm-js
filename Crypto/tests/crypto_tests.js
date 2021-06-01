;

//
//  Test Cases
//
crypto_tests = [];

!function (ns) {
    'use strict';

    const Data = ns.type.Data;
    const Dictionary = ns.type.Dictionary;
    const UTF8 = ns.format.UTF8;

    const test_dictionary = function () {
        const obj1 = {
            name: 'Moky',
            age: 18
        };
        const obj2 = {
            name: 'Moky',
            age: 18
        };
        const dict1 = new Dictionary(obj1);
        const dict2 = new Dictionary(obj2);
        const equals = ns.type.Arrays.equals(dict1, dict2);
        assert(equals === true, 'dictionary compare error');
    };
    crypto_tests.push(test_dictionary);

    const test_bytes = function () {
        const data = new Data(4);
        data.push(0x000F);
        data.push(0x00FF);
        data.push(0x0FFF);
        data.push(0xFFFF);
        const bytes = data.getBytes();
        log('bytes: ', bytes);
        assert(bytes.length === 4, 'bytes length error');
        const exp = [0x0F, 0xFF, 0xFF, 0xFF];
        assert(data.equals(exp) === true, 'bytes values error');
        // test concat
        const merged = data.concat([1, 2], [3]).toArray();
        log('merged: ', merged);
        assert(merged.length === 7, 'concat error');
        data.setByte(4, 0xF4);
        assert(data.getByte(4) === 0xF4, 'data error');
        const array = data.toArray();
        log('array after set: ', array);
        ns.type.Arrays.remove(array, 0xF4);
        log('array after removed: ', array);
        assert(data instanceof ns.type.Object, 'super class error');
    };
    crypto_tests.push(test_bytes);

    const test_enum = function () {
        const MetaType = ns.type.Enum(null, {

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
        const gen = function (version) {
            log('version: ', version.valueOf());
        };
        gen(MetaType.Default);

        const ver = new MetaType(0x02);
        log('ver:' , ver);
        gen(ver);
    };
    crypto_tests.push(test_enum);

    const test_string = function () {
        const data = 'Moky';
        const str = new ns.type.String(data);
        log('string: ', str);
        assert(str.equalsIgnoreCase('moky') === true, 'String comparing error');
    };
    crypto_tests.push(test_string);

    const test_utf8 = function () {
        const data = '《道德经》';
        const str = new ns.type.String(data);
        console.assert(str.getLength() === 5, 'UTF-8 length error');
        const bytes = UTF8.encode(str.toString());
        log('utf-8: ', bytes);
        assert(bytes.length === 15, 'bytes length error');
        let exp = [-29, -128, -118, -23, -127, -109, -27, -66, -73, -25, -69, -113, -29, -128, -117];
        exp = new Uint8Array(exp);
        assert(bytes.toString() === exp.toString(), 'UTF-8 bytes value error');

        const dec = new ns.type.String(UTF8.decode(exp));
        assert(dec.equals(str) === true, 'UTF-8 decode error');
        assert(dec.toString() === data, 'UTF-8 string value error');
    };
    crypto_tests.push(test_utf8);

}(DIMP);

!function (ns) {
    'use strict';

    const UTF8 = ns.format.UTF8;
    const Hex = ns.format.Hex;
    const Base64 = ns.format.Base64;
    const Base58 = ns.format.Base58;

    const str = new ns.type.String('moky');
    const bytes = UTF8.encode(str.toString());

    const test_hex = function () {
        const enc = Hex.encode(bytes);
        log('hex: ' , enc);
        const exp = '6d6f6b79';
        assert(enc === exp, 'encode error');

        const dec = Hex.decode(exp);
        const str2 = new ns.type.String(UTF8.decode(dec));
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'Hex decode error');
    };
    crypto_tests.push(test_hex);

    // base64(moky) = bW9reQ==
    const test_base64 = function () {
        const enc = Base64.encode(bytes);
        log('base64: ', enc);
        const exp = 'bW9reQ==';
        assert(enc === exp, 'encode error');

        const dec = Base64.decode(enc);
        const str2 = new ns.type.String(UTF8.decode(dec));
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'BASE-64 decode error');
    };
    crypto_tests.push(test_base64);

    // base58(moky) = 3oF5MJ
    const test_base58 = function () {
        const enc = Base58.encode(bytes);
        log('base58: ', enc);
        const exp = '3oF5MJ';
        assert(enc === exp, 'Base-58 encode error');

        const dec = Base58.decode(enc);
        const str2 = new ns.type.String(UTF8.decode(dec));
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'BASE-58 decode error');
    };
    crypto_tests.push(test_base58);

}(DIMP);

!function (ns) {
    'use strict';

    const UTF8 = ns.format.UTF8;
    const Hex = ns.format.Hex;

    const MD5 = ns.digest.MD5;
    const SHA256 = ns.digest.SHA256;
    const RIPEMD160 = ns.digest.RIPEMD160;

    const str = new ns.type.String('moky');
    const bytes = UTF8.encode(str.toString());

    // md5(moky) = d0e5edd3fd12b89154bbe7a5e4c82569
    const test_md5 = function () {
        const hash = MD5.digest(bytes);
        if (!hash) {
            return 'not implemented';
        }
        log('sha256: ' + Hex.encode(hash));
        const exp = 'd0e5edd3fd12b89154bbe7a5e4c82569';
        assert(Hex.encode(hash) === exp, 'MD5 digest error');
    };
    crypto_tests.push(test_md5);

    // sha256(moky）= cb98b739dd699aa44bb6ebba128d20f2d1e10bb3b4aa5ff4e79295b47e9ed76d
    const test_sha256 = function () {
        const hash = SHA256.digest(bytes);
        if (!hash) {
            return 'not implemented';
        }
        log('sha256: ' + Hex.encode(hash));
        const exp = 'cb98b739dd699aa44bb6ebba128d20f2d1e10bb3b4aa5ff4e79295b47e9ed76d';
        assert(Hex.encode(hash) === exp, 'SHA-256 digest error');
    };
    crypto_tests.push(test_sha256);

    // ripemd160(moky) = 44bd174123aee452c6ec23a6ab7153fa30fa3b91
    const test_ripemd160 = function () {
        const hash = RIPEMD160.digest(bytes);
        if (!hash) {
            return 'not implemented';
        }
        log('ripemd160: ' + Hex.encode(hash));
        const exp = '44bd174123aee452c6ec23a6ab7153fa30fa3b91';
        assert(Hex.encode(hash) === exp, 'RIPEMD-160 digest error');
    };
    crypto_tests.push(test_ripemd160);

}(DIMP);

!function (ns) {
    'use strict';

    const Arrays = ns.type.Arrays;
    const JSON = ns.format.JSON;

    const test_json = function () {
        const container = [1, 2, 3];
        const str = JSON.encode(container);
        log('json: ', str);
        const dec = JSON.decode(str);
        log('json dec: ', dec);
        assert(Arrays.equals(container, dec) === true, 'JSON decode error');
    };
    crypto_tests.push(test_json);

}(DIMP);

!function (ns) {
    'use strict';

    const UTF8 = ns.format.UTF8;
    const Hex = ns.format.Hex;
    const Base64 = ns.format.Base64;

    const Arrays = ns.type.Arrays;

    const AsymmetricKey = ns.crypto.AsymmetricKey;
    const PrivateKey = ns.crypto.PrivateKey;
    const PublicKey = ns.crypto.PublicKey;

    const str = new ns.type.String('moky');
    const bytes = UTF8.encode(str.toString());

    const test_rsa = function () {
        let SK = PrivateKey.generate(AsymmetricKey.RSA);
        let PK = SK.getPublicKey();
        // test encryption
        const ciphertext = PK.encrypt(bytes);
        const plaintext = SK.decrypt(ciphertext);
        assert(Arrays.equals(plaintext, bytes) === true, 'RSA encryption error');
        // test signature
        let signature = SK.sign(bytes);
        assert(PK.verify(bytes, signature) === true, 'RSA signature error');

        // test with key data
        let key = {
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

        //
        //  sign/verify
        //
        let expect = 'Najk0Lv7/DGedw9LXP2lPhZZMKnuR9C5Z1JPun6NQxe98XoZu4puZAi0K7UFsFMHKjKwY26XF8sjakD9dlU8yoXrn8IJg/Ye+O2l6DzyYlW2NQEVbabpS3Wl4g4vEBe2aCqGMaib/wdnGxm5h6h0m35YUtk7pW7yVFlGTvyTgpk=';

        signature = SK.sign(bytes);
        log('RSA sign(', str, '): ', Hex.encode(signature));
        log('RSA sign(', str, '): ', Base64.encode(signature));
        assert(expect === Base64.encode(signature), 'RSA signature error');
        assert(PK.verify(bytes, signature) === true, 'RSA verify error');

        //
        //  encrypt/decrypt
        //
        expect = 'PGsWtfUm3m236XHT1QK/lkiG8ZEtn9WpAIdMO9Q3z/qI0pzujSn60rCc/1AFHUAPn7J9S/kqNVXtQwhRTdfLHFL6jWn6N8Id1xAeUVxQGkJRDudRQxbxkbqCuj+T8LjEEA24wq2j6Ekrz0x3tt5QUaD6WeLdcVQPh2SF9DJY3ZY=';

        const enc = PK.encrypt(bytes);
        log('RSA encrypt:(', str, '): ', Base64.encode(enc));
        let dec = SK.decrypt(enc);
        let result = new ns.type.String(UTF8.decode(dec));
        log('RSA decrypt:', result);
        assert(str.toString() === result.toString(), 'RSA encrypt error');

        dec = SK.decrypt(Base64.decode(expect));
        result = new ns.type.String(UTF8.decode(dec));
        log('RSA decrypt:', result);
        assert(str.toString() === result.toString(), 'RSA decrypt error');
    };
    crypto_tests.push(test_rsa);

}(DIMP);

!function (ns) {
    'use strict';

    const UTF8 = ns.format.UTF8;
    const Hex = ns.format.Hex;
    const Base64 = ns.format.Base64;

    const Arrays = ns.type.Arrays;

    const SymmetricKey = ns.crypto.SymmetricKey;

    const str = new ns.type.String('moky');
    const bytes = UTF8.encode(str.toString());

    const test_aes = function () {
        const password = SymmetricKey.generate(SymmetricKey.AES);
        // test encryption
        const ciphertext = password.encrypt(bytes);
        const plaintext = password.decrypt(ciphertext);
        assert(Arrays.equals(plaintext, bytes) === true, 'AES encryption error');

        // test with key data
        const key = {
            algorithm: SymmetricKey.AES,
            data: 'C2+xGizLL1G1+z9QLPYNdp/bPP/seDvNw45SXPAvQqk=',
            iv: 'SxPwi6u4+ZLXLdAFJezvSQ=='
        };
        const pwd = new SymmetricKey.getInstance(key);

        const expect = '0xtbqZN6x2aWTZn0DpCoCA==';

        const enc = pwd.encrypt(bytes);
        log('AES encrypt(', str, '): ', Hex.encode(enc));
        log('AES encrypt(', str, '): ', Base64.encode(enc));
        assert(Base64.encode(enc) === expect, 'AES encrypt error');

        const dec = pwd.decrypt(enc);
        const result = new ns.type.String(UTF8.decode(dec));
        log('AES decrypt("' + expect + '"): "' + result + '"');
        assert(result.equals(str) === true, 'AES decrypt error');
    };
    crypto_tests.push(test_aes);

}(DIMP);
