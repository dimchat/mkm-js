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

//! require <crypto.js>

!function (ns) {

    /*
     *  @enum MKMNetworkID
     *
     *  @abstract A network type to indicate what kind the entity is.
     *
     *  @discussion An address can identify a person, a group of people,
     *      a team, even a thing.
     *
     *      MKMNetwork_Main indicates this entity is a person's account.
     *      An account should have a public key, which proved by meta data.
     *
     *      MKMNetwork_Group indicates this entity is a group of people,
     *      which should have a founder (also the owner), and some members.
     *
     *      MKMNetwork_Moments indicates a special personal social network,
     *      where the owner can share information and interact with its friends.
     *      The owner is the king here, it can do anything and no one can stop it.
     *
     *      MKMNetwork_Polylogue indicates a virtual (temporary) social network.
     *      It's created to talk with multi-people (but not too much, e.g. less than 100).
     *      Any member can invite people in, but only the founder can expel member.
     *
     *      MKMNetwork_Chatroom indicates a massive (persistent) social network.
     *      It's usually more than 100 people in it, so we need administrators
     *      to help the owner to manage the group.
     *
     *      MKMNetwork_SocialEntity indicates this entity is a social entity.
     *
     *      MKMNetwork_Organization indicates an independent organization.
     *
     *      MKMNetwork_Company indicates this entity is a company.
     *
     *      MKMNetwork_School indicates this entity is a school.
     *
     *      MKMNetwork_Government indicates this entity is a government department.
     *
     *      MKMNetwork_Department indicates this entity is a department.
     *
     *      MKMNetwork_Thing this is reserved for IoT (Internet of Things).
     *
     *  Bits:
     *      0000 0001 - this entity's branch is independent (clear division).
     *      0000 0010 - this entity can contains other group (big organization).
     *      0000 0100 - this entity is top organization.
     *      0000 1000 - (Main) this entity acts like a human.
     *
     *      0001 0000 - this entity contains members (Group)
     *      0010 0000 - this entity needs other administrators (big organization)
     *      0100 0000 - this is an entity in reality.
     *      1000 0000 - (IoT) this entity is a 'Thing'.
     *
     *      (All above are just some advices to help choosing numbers :P)
     */
    var NetworkType = ns.type.Enum({

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

    NetworkType.prototype.toByte = function () {
        return String.fromCharCode(this.value);
    };

    NetworkType.prototype.isPerson = function () {
        return (this.value === NetworkType.Main.value) ||
            (this.value === NetworkType.BTCMain.value);
    };

    NetworkType.prototype.isUser = function () {
        return ((this.value & NetworkType.Main.value) === NetworkType.Main.value) ||
            (this.value === NetworkType.BTCMain.value);
    };

    NetworkType.prototype.isGroup = function () {
        return (this.value & NetworkType.Group.value) === NetworkType.Group.value;
    };

    NetworkType.prototype.isStation = function () {
        return this.value === NetworkType.Station.value;
    };

    NetworkType.prototype.isProvider = function () {
        return this.value === NetworkType.Provider.value;
    };

    NetworkType.prototype.isThing = function () {
        return (this.value & NetworkType.Thing.value) === NetworkType.Thing.value;
    };

    NetworkType.prototype.isRobot = function () {
        return this.value === NetworkType.Robot.value;
    };

    //-------- namespace --------
    if (typeof ns.protocol !== 'object') {
        ns.protocol = {}
    }
    ns.protocol.NetworkType = NetworkType;

}(DIMP);

!function (ns) {

    /*
     *  enum MKMMetaVersion
     *
     *  abstract Defined for algorithm that generating address.
     *
     *  discussion Generate and check ID/Address
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
    var MetaType = ns.type.Enum({

        Default: (0x01),
        MKM:     (0x01),  // 0000 0001

        BTC:     (0x02),  // 0000 0010
        ExBTC:   (0x03),  // 0000 0011

        ETH:     (0x04),  // 0000 0100
        ExETH:   (0x05)   // 0000 0101
    });

    MetaType.prototype.hasSeed = function () {
        return (this.value & MetaType.MKM.value) === MetaType.MKM.value;
    };

    //-------- namespace --------
    if (typeof ns.protocol !== 'object') {
        ns.protocol = {}
    }
    ns.protocol.MetaType = MetaType;

}(DIMP);
