const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/slohacks");

const File = mongoose.model("File", {
	hash: String,
	filename: String
});

const saveFileToDict = (filename, file_name_hash) => {
	return new Promise((resolve, reject) => {
		let file = new File({ filename, hash: file_name_hash });
		file.save()
		.then(() => {
			console.log("Saved a file");
			resolve();
		});
	});
};

const findFileHash(filename) => {
	return new Promise((resolve, reject) => {
		File.findOne({ filename },  (err, file) => {
			if(err) return reject(err);
			resolve(file);
		});
	});
};

module.exports.saveFileToDict = saveFileToDict;
module.exports.findFileHash = findFileHash;