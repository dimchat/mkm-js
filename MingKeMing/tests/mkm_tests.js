;

//
//  Test Cases
//
mkm_tests = [];

(function (ns) {
    'use strict';

    var EntityType = ns.protocol.EntityType;
    var ID         = ns.protocol.ID;

    var test_broadcast_id = function () {
        var anyone = ID.ANYONE;
        log('anyone: ' , anyone);
        assert(EntityType.ANY.equals(anyone.getType()) === true, 'ID type error');
    };
    mkm_tests.push(test_broadcast_id);

    var test_id = function () {
        var moky = ID.parse('moky@4DnqXWdTV8wuZgfqSCX9GjE2kNq7HJrUgQ');
        log('moky', moky);
        assert(moky.isUser() === true, 'ID type error');
    };
    mkm_tests.push(test_id);

})(MingKeMing);

!(function (ns, mk) {
    'use strict';

    var PrivateKey    = mk.protocol.PrivateKey;

    var EntityType = ns.protocol.EntityType;
    var Meta       = ns.protocol.Meta;

    var test_meta = function () {
        var SK = PrivateKey.generate('RSA');
        var seed = 'moky';
        var meta = Meta.generate('1', SK, seed);
        log('generated meta: ', meta);
        assert(meta.getPublicKey() != null, 'failed to generate meta');

        var address = Address.generate(meta, EntityType.USER.getValue());
        log('generated address: ', address);
        assert(address.getType() === 0, 'failed to generate ID')
    };
    mkm_tests.push(test_meta);

})(MingKeMing, MONKEY);
