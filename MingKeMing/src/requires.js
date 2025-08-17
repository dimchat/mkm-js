'use strict';

//-------- namespaces --------
if (typeof mkm.protocol !== 'object') {
    mkm.protocol = {};
}
if (typeof mkm.mkm !== 'object') {
    mkm.mkm = {};
}
if (typeof mkm.ext !== 'object') {
    mkm.ext = {};
}

//-------- requires --------
var Interface      = mk.type.Interface;
var Class          = mk.type.Class;

var IObject        = mk.type.Object;
var Stringer       = mk.type.Stringer;
var Mapper         = mk.type.Mapper;

var Enum           = mk.type.Enum;
var ConstantString = mk.type.ConstantString;
