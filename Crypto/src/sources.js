'use strict';

var crypto_sources = [
    // system types
    'src/type/class.js',
    'src/type/object.js',
    'src/type/converter.js',
    'src/type/arrays.js',
    'src/type/enum.js',
    'src/type/set.js',
    'src/type/string.js',
    'src/type/dictionary.js',
    'src/type/wrapper.js',
    'src/type/copier.js',

    // data digest
    'src/digest/hash.js',
    'src/digest/md5.js',
    'src/digest/sha1.js',
    'src/digest/sha256.js',
    'src/digest/ripemd160.js',
    'src/digest/keccak256.js',

    // data format
    'src/format/coder.js',
    'src/format/hex.js',
    'src/format/base58.js',
    'src/format/base64.js',
    'src/format/utf8.js',
    'src/format/json.js',
    'src/format/ted.js',
    'src/format/pnf.js',

    // cryptography
    'src/crypto/keys.js',
    'src/crypto/symmetric.js',
    'src/crypto/public.js',
    'src/crypto/private.js',

    // plugins
    'src/plugins/crypto_helpers.js',
    'src/plugins/crypto_plugins.js',
    'src/plugins/format_helpers.js',
    'src/plugins/format_plugins.js',
    null
];
