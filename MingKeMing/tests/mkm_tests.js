;

//
//  Test Cases
//
mkm_tests = [];

(function (ns) {
    'use strict';

    var NetworkType = ns.protocol.NetworkType;
    var ID = ns.protocol.ID;

    var test_broadcast_id = function () {
        var anyone = ID.ANYONE;
        log('anyone: ' , anyone);
        assert(NetworkType.MAIN.equals(anyone.getType()) === true, 'ID type error');
    };
    mkm_tests.push(test_broadcast_id);

    var test_id = function () {
        var moky = ID.parse('moky@4DnqXWdTV8wuZgfqSCX9GjE2kNq7HJrUgQ');
        log('moky', moky);
        assert(moky.isUser() === true, 'ID type error');
    };
    mkm_tests.push(test_id);

})(MingKeMing);

!(function (ns) {
    'use strict';

    var AsymmetricKey = ns.crypto.AsymmetricKey;
    var PrivateKey = ns.crypto.PrivateKey;

    var NetworkType = ns.protocol.NetworkType;

    var MetaType = ns.protocol.MetaType;
    var Meta = ns.protocol.Meta;

    var test_meta = function () {
        var SK = PrivateKey.generate(AsymmetricKey.RSA);
        var seed = 'moky';
        var meta = Meta.generate(MetaType.DEFAULT, SK, seed);
        log('generated meta: ', meta);
        assert(meta.getKey() != null, 'failed to generate meta');

        var address = meta.generateAddress(NetworkType.MAIN);
        log('generated address: ', address);
        assert(address.getNetwork() === 0x08, 'failed to generate ID')
    };
    mkm_tests.push(test_meta);

})(MingKeMing);
