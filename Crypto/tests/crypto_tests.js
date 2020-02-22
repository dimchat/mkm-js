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

    var test_pem = function () {
        return 'not test';
    };
    crypto_tests.push(test_pem);

}(DIMP);

!function (ns) {
    'use strict';

    var Arrays = ns.type.Arrays;

    var SymmetricKey = ns.crypto.SymmetricKey;
    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;

    var test_aes = function () {
        var str = ns.type.String.from('moky');
        var data = str.getBytes();
        var password = SymmetricKey.generate(SymmetricKey.AES);
        // test encryption
        var ciphertext = password.encrypt(data);
        var plaintext = password.decrypt(ciphertext);
        assert(Arrays.equals(plaintext, data) === true, 'AES encryption error');
    };
    crypto_tests.push(test_aes);

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
    };
    crypto_tests.push(test_rsa);

    var test_ecc = function () {
        var str = ns.type.String.from('moky');
        var data = str.getBytes();
        var SK = PrivateKey.generate(AsymmetricKey.ECC);
        var PK = SK.getPublicKey();
        // test signature
        var signature = SK.sign(data);
        assert(PK.verify(data, signature) === true, 'ECC signature error');
    };
    crypto_tests.push(test_ecc);

}(DIMP);
