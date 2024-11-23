;
// license: https://mit-license.org
//
//  Ming-Ke-Ming : Decentralized User Identity Authentication
//
//                               Written in 2020 by Moky <albert.moky@gmail.com>
//
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2020 Albert Moky
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// =============================================================================
//

//! require 'namespace.js'

(function (ns) {
    'use strict';

    /**
     *  @enum EntityType
     *
     *  @abstract A network ID to indicate what kind the entity is.
     *
     *  @discussion An address can identify a person, a group of people,
     *      a team, even a thing.
     *
     *      MKMEntityType_User indicates this entity is a person's account.
     *      An account should have a public key, which proved by meta data.
     *
     *      MKMEntityType_Group indicates this entity is a group of people,
     *      which should have a founder (also the owner), and some members.
     *
     *      MKMEntityType_Station indicates this entity is a DIM network station.
     *
     *      MKMEntityType_ISP indicates this entity is a group for stations.
     *
     *      MKMEntityType_Bot indicates this entity is a bot user.
     *
     *      MKMEntityType_Company indicates a company for stations and/or bots.
     *
     *  Bits:
     *      0000 0001 - group flag
     *      0000 0010 - node flag
     *      0000 0100 - bot flag
     *      0000 1000 - CA flag
     *      ...         (reserved)
     *      0100 0000 - customized flag
     *      1000 0000 - broadcast flag
     *
     *      (All above are just some advices to help choosing numbers :P)
     */
    var EntityType = ns.type.Enum('EntityType', {

        /**
         *  Main: 0, 1
         */
        USER:           (0x00), // 0000 0000
        GROUP:          (0x01), // 0000 0001 (User Group)

        /**
         *  Network: 2, 3
         */
        STATION:        (0x02), // 0000 0010 (Server Node)
        ISP:            (0x03), // 0000 0011 (Service Provider)
        //STATION_GROUP:(0x03), // 0000 0011

        /**
         *  Bot: 4, 5
         */
        BOT:            (0x04), // 0000 0100 (Business Node)
        ICP:            (0x05), // 0000 0101 (Content Provider)
        //BOT_GROUP:    (0x05), // 0000 0101

        /**
         *  Management: 6, 7, 8
         */
        SUPERVISOR:     (0x06), // 0000 0110 (Company President)
        COMPANY:        (0x07), // 0000 0111 (Super Group for ISP/ICP)
        //CA:           (0x08), // 0000 1000 (Certification Authority)

        /*
         *  Customized: 64, 65
         */
        //APP_USER:     (0x40), // 0100 0000 (Application Customized User)
        //APP_GROUP:    (0x41), // 0100 0001 (Application Customized Group)

        /**
         *  Broadcast: 128, 129
         */
        ANY:            (0x80), // 1000 0000 (anyone@anywhere)
        EVERY:          (0x81)  // 1000 0001 (everyone@everywhere)
    });

    // NetworkType.prototype.toByte = function () {
    //     return String.fromCharCode(this.value);
    // };

    /**
     *  Indicates whether this is a user type
     *
     * @param {uint} network - entity type
     * @returns {boolean}
     */
    EntityType.isUser = function (network) {
        var user = EntityType.USER.getValue();
        var group = EntityType.GROUP.getValue();
        return (network & group) === user;
    };

    /**
     *  Indicates whether this is a group type
     *
     * @param {uint} network - entity type
     * @returns {boolean}
     */
    EntityType.isGroup = function (network) {
        var group = EntityType.GROUP.getValue();
        return (network & group) === group;
    };

    /**
     *  Indicates whether this is a broadcast type
     *
     * @param {uint} network - entity type
     * @returns {boolean}
     */
    EntityType.isBroadcast = function (network) {
        var any = EntityType.ANY.getValue();
        return (network & any) === any;
    };

    //-------- namespace --------
    ns.protocol.EntityType = EntityType;

})(MingKeMing);

(function (ns) {
    'use strict';

    /**
     *  @enum MetaType
     *
     *  @abstract Defined for algorithm that generating address.
     *
     *  @discussion Generate and check ID/Address
     *
     *      MKMMetaVersion_MKM give a seed string first, and sign this seed to get
     *      fingerprint; after that, use the fingerprint to generate address.
     *      This will get a firmly relationship between (username, address and key).
     *
     *      MKMMetaVersion_BTC use the key data to generate address directly.
     *      This can build a BTC address for the entity ID (no username).
     *
     *      MKMMetaVersion_ExBTC use the key data to generate address directly, and
     *      sign the seed to get fingerprint (just for binding username and key).
     *      This can build a BTC address, and bind a username to the entity ID.
     *
     *  Bits:
     *      0000 0001 - this meta contains seed as ID.name
     *      0000 0010 - this meta generate BTC address
     *      0000 0100 - this meta generate ETH address
     *      ...
     */
    var MetaType = ns.type.Enum('MetaType', {

        DEFAULT: (0x01),
        MKM:     (0x01),  // 0000 0001

        BTC:     (0x02),  // 0000 0010
        ExBTC:   (0x03),  // 0000 0011

        ETH:     (0x04),  // 0000 0100
        ExETH:   (0x05)   // 0000 0101
    });

    /**
     *  Indicates whether this meta contains seed string & fingerprint
     *
     * @returns {boolean}
     */
    MetaType.hasSeed = function (version) {
        var mkm = MetaType.MKM.getValue();
        return (version & mkm) === mkm;
    };

    //-------- namespace --------
    ns.protocol.MetaType = MetaType;

})(MingKeMing);
