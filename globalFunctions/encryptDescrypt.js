var cryptoLib = require("cryptlib");
var config = require("./config")();
var shaKey = cryptoLib.getHashSha256(config.key, 32);
var encryptDecrypt = {
	"encrypt": (plainText) => {

		var encryptedString = cryptoLib.encrypt(plainText, shaKey, config.iv);
		// console.log("/------encryptedString------/");
		// console.log(encryptedString);
		return encryptedString;
	},
	"decrypt": (encryptedString) => {
		 
		var decryptedString = cryptoLib.decrypt(encryptedString, shaKey, config.iv);
		// console.log("/--------decryptedString--------/");
		// console.log(decryptedString);
		return decryptedString;
	}
};
module.exports = encryptDecrypt;