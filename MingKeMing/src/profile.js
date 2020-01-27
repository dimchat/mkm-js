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
//! require 'identifier.js'

!function (ns) {

    /**
     *  The Additional Information
     *
     *      'Meta' is the information for entity which never changed,
     *          which contains the key for verify signature;
     *      'TAI' is the variable part,
     *          which could contain a public key for asymmetric encryption.
     */
    var TAI = function () {
    };

    /**
     *  Check if signature matched
     *
     * @returns {boolean}
     */
    TAI.prototype.isValid = function () {
        console.assert(false, 'implement me!');
        return false;
    };

    /**
     *  Get entity ID
     *
     * @returns {ID}
     */
    TAI.prototype.getIdentifier = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get public key to encrypt message for user
     *
     * @returns {EncryptKey|null}
     */
    TAI.prototype.getKey = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- properties --------

    /**
     *  Get all names for properties
     *
     * @returns {String[]}
     */
    TAI.prototype.allPropertyNames = function () {
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Get profile property data with key
     *
     * @param name
     * @returns {*}
     */
    TAI.prototype.getProperty = function (name) {
        console.assert(name !== null, 'property name empty');
        console.assert(false, 'implement me!');
        return null;
    };

    /**
     *  Update profile property with key and data
     *  (this will reset 'data' and 'signature')
     *
     * @param name
     * @param value
     */
    TAI.prototype.setProperty = function (name, value) {
        console.assert(name !== null, 'property name empty');
        console.assert(value !== null, 'property value empty');
        console.assert(false, 'implement me!');
    };

    //-------- signature --------

    /**
     *  Verify 'data' and 'signature' with public key
     *
     * @param publicKey
     * @returns {boolean}
     */
    TAI.prototype.verify = function (publicKey) {
        console.assert(publicKey !== null, 'public key empty');
        console.assert(false, 'implement me!');
        return false;
    };

    /**
     *  Encode properties to 'data' and sign it to 'signature'
     *
     * @param privateKey
     * @returns {*[]}
     */
    TAI.prototype.sign = function (privateKey) {
        console.assert(privateKey !== null, 'private key empty');
        console.assert(false, 'implement me!');
        return null;
    };

//     //-------- namespace --------
//     ns.TAI = TAI;
//
// }(DIMP);
//
// !function (ns) {

    var Dictionary = ns.type.Dictionary;
    var Base64 = ns.format.Base64;
    var JSON = ns.format.JSON;

    var PublicKey = ns.crypto.PublicKey;

//    var TAI = ns.TAI;

    var Profile = function (dict) {
        Dictionary.call(this, dict);

        this.identifier = null;
        this.key = null;

        this.data = null;
        this.signature = null;

        this.properties = null;
        this.status = 0; // 1 for valid, -1 for invalid
    };
    Profile.inherits(Dictionary, TAI);

    Profile.prototype.isValid = function () {
        return this.status >= 0;
    };

    Profile.prototype.getIdentifier = function () {
        if (!this.identifier) {
            this.identifier = this.getValue('ID');
        }
        return this.identifier;
    };

    /**
     *  Get serialized properties
     *
     * @returns {*[]}
     */
    Profile.prototype.getData = function () {
        if (!this.data) {
            var string = this.getValue('data');
            if (string) {
                var str = new ns.type.String(string);
                this.data = str.getBytes();
            }
        }
        return this.data;
    };

    /**
     *  Get signature for serialized properties
     *
     * @returns {*[]}
     */
    Profile.prototype.getSignature = function () {
        if (!this.signature) {
            var base64 = this.getValue('signature');
            if (base64) {
                this.signature = Base64.decode(base64);
            }
        }
        return this.signature;
    };

    //-------- properties --------

    Profile.prototype.getProperties = function () {
        if (this.status < 0) {
            // invalid
            return null;
        }
        if (!this.properties) {
            var string = this.getValue('data');
            if (string) {
                this.properties = JSON.decode(string);
            } else {
                this.properties = {};
            }
        }
        return this.properties;
    };

    Profile.prototype.allPropertyNames = function () {
        var dict = this.getProperties();
        if (!dict) {
            return null;
        }
        return Object.keys(dict);
    };

    Profile.prototype.getProperty = function (name) {
        var dict = this.getProperties();
        if (!dict) {
            return null;
        }
        return dict[name];
    };

    Profile.prototype.setProperty = function (name, value) {
        // 1. reset status
        // console.assert(this.status >= 0, 'status error: ' + this);
        this.status = 0;
        // 2. update property value with name
        var dict = this.getProperties();
        // console.assert(dict !== null, 'failed to get properties: ' + this);
        dict[name] = value;
        // 3. clear data signature after properties changed
        this.setValue('data', null);
        this.setValue('signature', null);
        this.data = null;
        this.signature = null;
    };

    //-------- signature --------

    Profile.prototype.verify = function (publicKey) {
        if (this.status > 0) {
            // already verify OK
            return true;
        }
        var data = this.getData();
        var signature = this.getSignature();
        if (!data) {
            // NOTICE: if data is empty, signature should be empty at the same time
            //         this happen while profile not found
            if (!signature) {
                this.status = 0;
            } else {
                // data signature error
                this.status = -1;
            }
        } else if (!signature) {
            // signature error
            this.status = -1;
        } else if (publicKey.verify(data, signature)) {
            // signature matched
            this.status = 1;
        }
        // NOTICE: if status is 0, it doesn't mean the profile is invalid,
        //         try another key
        return this.status > 0;
    };

    Profile.prototype.sign = function (privateKey) {
        if (this.status > 0) {
            // already signed/verified
            return this.signature;
        }
        this.status = 1;
        var string = JSON.encode(this.getProperties());
        var str = new ns.type.String(string);
        this.data = str.getBytes();
        this.signature = privateKey.sign(this.data);
        this.setValue('data', string);
        this.setValue('signature', Base64.encode(this.signature));
        return this.signature;
    };

    //-------- extra info --------

    /**
     *  Get entity name
     *
     * @returns {string}
     */
    Profile.prototype.getName = function () {
        return this.getProperty('name');
    };

    Profile.prototype.setName = function (name) {
        this.setProperty('name', name);
    };

    Profile.prototype.getKey = function () {
        if (!this.key) {
            var key = this.getProperty('key');
            if (key) {
                this.key = PublicKey.getInstance(key);
            }
        }
        return this.key;
    };

    Profile.prototype.setKey = function (publicKey) {
        this.key = publicKey;
        this.setProperty('key', publicKey);
    };

    //-------- Runtime --------
    var tai_classes = [];

    Profile.register = function (clazz) {
        tai_classes.push(clazz);
    };

    Profile.getInstance = function (dict) {
        if (!dict) {
            return null;
        } else if (dict instanceof Profile) {
            return dict;
        }
        // try each subclass to parse profile
        var clazz;
        for (var i = tai_classes.length - 1; i >= 0; --i) {
            clazz = tai_classes[i];
            try {
                var tai = new clazz(dict);
                if (tai) {
                    return tai;
                }
            } catch (e) {
            }
        }
        return new Profile(dict);
    };

    //-------- namespace --------
    ns.Profile = Profile;

}(DIMP);
