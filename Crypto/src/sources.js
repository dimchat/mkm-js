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

    // protocol
    'src/protocol/ted.js',
    'src/protocol/pnf.js',
    // cryptography
    'src/protocol/keys.js',
    'src/protocol/symmetric.js',
    'src/protocol/public.js',
    'src/protocol/private.js',

    // extensions
    'src/ext/crypto_helpers.js',
    'src/ext/crypto_plugins.js',
    'src/ext/format_helpers.js',
    'src/ext/format_plugins.js',
    null
];
