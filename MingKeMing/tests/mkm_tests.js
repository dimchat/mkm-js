;

//
//  Test Cases
//
mkm_tests = [];

!function (ns) {
    'use strict';

    var NetworkType = ns.protocol.NetworkType;
    var ID = ns.ID;
    var User = ns.User;
    var Group = ns.Group;

    var test_broadcast_id = function () {
        var anyone = ID.ANYONE;
        log('anyone: ' , anyone);
        assert(anyone.getType() === NetworkType.Main, 'ID type error');
    };
    mkm_tests.push(test_broadcast_id);

    var test_id = function () {
        var moky = ID.getInstance('moky@4DnqXWdTV8wuZgfqSCX9GjE2kNq7HJrUgQ');
        log('moky', moky);
        assert(moky.getType().isUser() === true, 'ID type error');
    };
    mkm_tests.push(test_id);

    var test_user = function () {
        var moky = ID.getInstance('moky@4DnqXWdTV8wuZgfqSCX9GjE2kNq7HJrUgQ');
        var user = new User(moky);
        log('moky', user);
        assert(user.getType().isUser() === true, 'user ID type error');
    };
    mkm_tests.push(test_user);

    var test_group = function () {
        var id = ID.getInstance('Group-Naruto@7ThVZeDuQAdG3eSDF6NeFjMDPjKN5SbrnM');
        var group = new Group(id);
        log('group', group);
        assert(group.getType().isGroup() === true, 'group ID type error');
    };
    mkm_tests.push(test_group);

}(MingKeMing);

!function (ns) {
    'use strict';

    var AsymmetricKey = DIMP.crypto.AsymmetricKey;
    var PrivateKey = DIMP.crypto.PrivateKey;

    var NetworkType = ns.protocol.NetworkType;

    var MetaType = ns.protocol.MetaType;
    var Meta = ns.Meta;

    var test_meta = function () {
        var SK = PrivateKey.generate(AsymmetricKey.RSA);
        var seed = 'moky';
        var meta = Meta.generate(MetaType.Default, SK, seed);
        log('generated meta: ', meta);
        assert(meta.isValid() === true, 'failed to generate meta');

        var id = meta.generateIdentifier(NetworkType.Main);
        log('generated ID: ', id);
        assert(id.isValid() === true, 'failed to generate ID')
    };
    mkm_tests.push(test_meta);

}(MingKeMing);
