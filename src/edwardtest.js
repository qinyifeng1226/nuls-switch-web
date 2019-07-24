'use strict';

var nuls = require('nuls-sdk-js/lib/api/sdk');
var nuls2 = require('nuls-sdk-js/lib');

var newAddressInfo = nuls2.newAddress(2, "123456");
var pri = nuls.decrypteOfAES(newAddressInfo.aesPri, "123456");
console.log(pri)
console.log(newAddressInfo['pub'])
var digest = nuls.signature("616466616466616466",pri)
console.log(digest)




