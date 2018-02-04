const crypto = require("crypto");
const zlib = require("zlib");

module.exports.createZip = () => zlib.createGzip();
module.exports.createUnzip = () => zlib.createGunzip();
module.exports.createEncryptStream = () => crypto.createCipher("aes-256-ctr", process.env["SECRET"]);
module.exports.createDecryptStream = () => crypto.createCipher("aes-256-ctr", process.env["SECRET"]);