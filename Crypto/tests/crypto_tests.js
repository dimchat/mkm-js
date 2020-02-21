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
        assert(bytes.length === 4, 'length error');
        var exp = new Uint8Array([0x0F, 0xFF, 0xFF, 0xFF]);
        assert(bytes.toString() === exp.toString(), 'values error');
    };
    crypto_tests.push(test_bytes);

    var test_string = function () {
        var data = 'Moky';
        var str = new ns.type.String(data);
        log('string: ', str);
        assert(str.equalsIgnoreCase('moky') === true, 'comparing error');
    };
    crypto_tests.push(test_string);

    var test_utf8 = function () {
        var data = '《道德经》';
        var str = new ns.type.String(data);
        console.assert(str.getLength() === 5, 'length error');
        var bytes = str.getBytes();
        log('utf-8: ', bytes);
        assert(bytes.length === 15, 'bytes length error');
        var exp = [-29, -128, -118, -23, -127, -109, -27, -66, -73, -25, -69, -113, -29, -128, -117];
        exp = new Uint8Array(exp);
        assert(bytes.toString() === exp.toString(), 'bytes value error');

        var dec = new ns.type.String(exp);
        assert(dec.equals(str) === true, 'decode error');
        assert(dec.toString() === data, 'string value error');
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
        assert(str2.equals(str) === true, 'decode error');
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
        assert(str2.equals(str) === true, 'decode error');
    };
    crypto_tests.push(test_base64);

    // base58(moky) = 3oF5MJ
    var test_base58 = function () {
        var str = ns.type.String.from('moky');
        var bytes = str.getBytes();
        var enc = Base58.encode(bytes);
        log('base58: ', enc);
        var exp = '3oF5MJ';
        assert(enc === exp, 'encode error');

        var dec = Base58.decode(enc);
        var str2 = new ns.type.String(dec);
        log('str2: ', str2);
        assert(str2.equals(str) === true, 'decode error');
    };
    crypto_tests.push(test_base58);

}(DIMP);

!function (ns) {
    'use strict';
    
    var Hex = ns.format.Hex;

    var MD5 = ns.digest.MD5;
    var SHA256 = ns.digest.SHA256;
    var RIPEMD160 = ns.digest.RIPEMD160;

    var test_md5 = function () {
        var str = ns.type.String.from('moky');
        var bytes = str.getBytes();
        var hash = MD5.digest(bytes);
        if (!hash) {
            return 'not implemented';
        }
        log('sha256: ' + Hex.encode(hash));
    };
    crypto_tests.push(test_md5);

    // sha256（moky）= cb98b739dd699aa44bb6ebba128d20f2d1e10bb3b4aa5ff4e79295b47e9ed76d
    var test_sha256 = function () {
        var str = ns.type.String.from('moky');
        var bytes = str.getBytes();
        var hash = SHA256.digest(bytes);
        if (!hash) {
            return 'not implemented';
        }
        log('sha256: ' + Hex.encode(hash));
        
        var exp = 'cb98b739dd699aa44bb6ebba128d20f2d1e10bb3b4aa5ff4e79295b47e9ed76d';
        assert(Hex.encode(hash) === exp, 'digest error');
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
        assert(Hex.encode(hash) === exp, 'digest error');
    };
    crypto_tests.push(test_ripemd160);

}(DIMP);

!function (ns) {
    'use strict';

    var test_json = function () {
        return 'not test';
    };
    crypto_tests.push(test_json);

    var test_pem = function () {
        return 'not test';
    };
    crypto_tests.push(test_pem);

}(DIMP);

!function (ns) {
    'use strict';

    var test_aes = function () {
        return 'not test';
    };
    crypto_tests.push(test_aes);

    var test_rsa = function () {
        return 'not test';
    };
    crypto_tests.push(test_rsa);

    var test_ecc = function () {
        return 'not test';
    };
    crypto_tests.push(test_ecc);

}(DIMP);
