# Ming Ke Ming (名可名) -- Account Module (JavaScript)

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/dimchat/mkm-js/blob/master/LICENSE)
[![Version](https://img.shields.io/badge/alpha-0.1.0-red.svg)](https://github.com/dimchat/mkm-js/archive/master.zip)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dimchat/mkm-js/pulls)
[![Platform](https://img.shields.io/badge/Platform-ECMAScript%205.1-brightgreen.svg)](https://github.com/dimchat/mkm-js/wiki)

This [document](https://github.com/moky/DIMP/blob/master/MingKeMing-Identity.md) introduces a common **Account Module** for decentralized user identity authentication.

Copyright &copy; 2018-2020 Albert Moky

- [Meta](#meta)
    - [Version](#meta-version)
    - [Seed](#meta-seed)
    - [Key](#meta-key)
    - [Fingerprint](#meta-fingerprint)
- [ID](#id)
    - [Type](#id-type)
    - [Name](#id-name)
    - [Address](#id-address)
    - [Terminal](#id-terminal)
    - [Number](#id-number)
- [Samples](#samples)

## <span id="meta">0. Meta</span>

The **Meta** was generated by your **private key**, it can be used to build a new ID for entity, or verify the ID/PK pair.

It consists of 4 fields:

| Field       | Description                   |
| ----------- | ----------------------------- |
| version     | Meta Algorithm Version        |
| seed        | Entity Name                   |
| key         | Public Key                    |
| fingerprint | Signature to generate address |

### <span id="meta-version">0.0. Version</span>

* ```0x01``` **Default version**
* ```0x02``` BTC version
* ```0x03``` Extended BTC version
* ```0x04``` ETH version
* ```0x05``` Extended ETH version

### <span id="meta-seed">0.1. Seed</span>

A string as same as **ID.name** for generate the fingerprint.

### <span id="meta-key">0.2. Key</span>

A **public key** (PK) was binded to an ID by the **Meta Algorithm**.

### <span id="meta-fingerprint">0.3. Fingerprint</span>

THe **fingerprint** field was generated by your **private key** and **seed**:

````javascript
data = (new DIMP.type.String(seed)).getBytes('UTF-8');
fingerprint = privateKey.sign(data);
````

## <span id="id">1. ID</span>
The **ID** is used to identify an **entity**(user/group). It consists of 3 fields and 2 extended properties:

| Field       | Description                   |
| ----------- | ----------------------------- |
| name        | Same with meta.seed           |
| address     | Unique Identification         |
| terminal    | Login point, it's optional.   |
| type        | Network type                  |
| number      | Search Number                 |

The ID format is ```name@address[/terminal]```.

### <span id="id-type">1.0. Type</span>

The **network type** of a person is ```8```, and group is ```16```:

```javascript
var NetworkType = DIMP.type.Enum({

    BTCMain:        (0x00), // 0000 0000
    //BTCTest:      (0x6F), // 0110 1111

    /*
     *  Person Account
     */
    Main:           (0x08), // 0000 1000 (Person)

    /*
     *  Virtual Groups
     */
    Group:          (0x10), // 0001 0000 (Multi-Persons)

    //Moments:      (0x18), // 0001 1000 (Twitter)
    Polylogue:      (0x10), // 0001 0000 (Multi-Persons Chat, N < 100)
    Chatroom:       (0x30), // 0011 0000 (Multi-Persons Chat, N >= 100)

    /*
     *  Social Entities in Reality
     */
    //SocialEntity: (0x50), // 0101 0000

    //Organization: (0x74), // 0111 0100
    //Company:      (0x76), // 0111 0110
    //School:       (0x77), // 0111 0111
    //Government:   (0x73), // 0111 0011
    //Department:   (0x52), // 0101 0010

    /*
     *  Network
     */
    Provider:       (0x76), // 0111 0110 (Service Provider)
    Station:        (0x88), // 1000 1000 (Server Node)

    /*
     *  Internet of Things
     */
    Thing:          (0x80), // 1000 0000 (IoT)
    Robot:          (0xC8)  // 1100 1000
});
```

### <span id="id-name">1.1. Name</span>
The **Name** field is a username, or just a random string for group:

1. The length of name must more than 1 byte, less than 32 bytes;
2. It should be composed by a-z, A-Z, 0-9, or charactors '_', '-', '.';
3. It cannot contain key charactors('@', '/').

```javascript
# Name examples
user_name  = "Albert.Moky";
group_name = "Group-9527";
```

### <span id="id-address">1.2. Address</span>

The **Address** field was created with the **Fingerprint** in Meta and a **Network ID**:

```javascript
    var SHA256    = DIMP.digest.SHA256;
    var RIPEMD160 = DIMP.digest.RIPEMD160;
    var Base58    = DIMP.format.Base58;
    
    var check_code = function (data) {
        var sha256d = SHA256.digest(SHA256.digest(data));
        return sha256d.subarray(0, 4);
    };

    var search_number = function (cc) {
        // return (cc[0] & 0xFF)
        //     | ((cc[1] & 0xFF) << 8)
        //     | ((cc[2] & 0xFF) << 16)
        //     | ((cc[3] & 0xFF) << 24);
        return (cc[0] | cc[1] << 8 | cc[2] << 16) + cc[3] * 0x1000000;
    };

    DefaultAddress.generate = function (fingerprint, network) {
        // 1. digest = ripemd160(sha256(fingerprint))
        var digest = RIPEMD160.digest(SHA256.digest(fingerprint));
        // 2. head = network + digest
        var head = new Data(21);
        head.push(network.value);
        head.push(digest);
        // 3. cc = sha256(sha256(head)).prefix(4)
        var cc = check_code(head.getBytes());
        // 4. data = base58_encode(head + cc)
        var data = new Data(25);
        data.push(head);
        data.push(cc);
        return new DefaultAddress(Base58.encode(data.getBytes()));
    };
```

When you get a meta for the entity ID from the network,
you must verify it with the consensus algorithm before accept its **public key**.

### <span id="id-terminal">1.3. Terminal</span>

A resource identifier as **Login Point**.

### <span id="id-number">1.4. Number</span>

A **Search Number** is defined for easy remember. Its value is converted from the **check code** of the address. It's greater than **0** and smaller than **2<sup>32</sup> (4,294,967,296)**.

## <span id="samples">2. Samples</span>

### ID

```javascript
# ID examples
ID1 = "hulk@4YeVEN3aUnvC1DNUufCq1bs9zoBSJTzVEj";  // Immortal Hulk
ID2 = "moki@4WDfe3zZ4T7opFSi3iDAKiuTnUHjxmXekk";  // Monkey King
```

### Meta

```javascript
/* Meta(JsON) for hulk@4YeVEN3aUnvC1DNUufCq1bs9zoBSJTzVEj */
{
    "version"     : 0x01,
    "key"         : {
        "algorithm" : "RSA",
        "data"      : "-----BEGIN PUBLIC KEY-----\nMIGJAoGBALB+vbUK48UU9rjlgnohQowME+3JtTb2hLPqtatVOW364/EKFq0/PSdnZVE9V2Zq+pbX7dj3nCS4pWnYf40ELH8wuDm0Tc4jQ70v4LgAcdy3JGTnWUGiCsY+0Z8kNzRkm3FJid592FL7ryzfvIzB9bjg8U2JqlyCVAyUYEnKv4lDAgMBAAE=\n-----END PUBLIC KEY-----",
        "mode"      : "ECB",
        "padding"   : "PKCS1",
        "digest"    : "SHA256"
    },
    "seed"        : "hulk",
    "fingerprint" : "jIPGWpWSbR/DQH6ol3t9DSFkYroVHQDvtbJErmFztMUP2DgRrRSNWuoKY5Y26qL38wfXJQXjYiWqNWKQmQe/gK8M8NkU7lRwm+2nh9wSBYV6Q4WXsCboKbnM0+HVn9Vdfp21hMMGrxTX1pBPRbi0567ZjNQC8ffdW2WvQSoec2I="
}
```

(All data encode with **BASE64** algorithm as default, excepts the **address**)
