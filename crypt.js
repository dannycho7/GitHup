const crypto = require("crypto");
const zlib = require("zlib");

module.exports.zip = zlib.createGzip();
module.exports.unzip = zlib.createGunzip();
module.exports.encrypt = crypto.createCipher("aes-256-ctr", process.env["SECRET"]);
module.exports.decrypt = crypto.createCipher("aes-256-ctr", process.env["SECRET"]);