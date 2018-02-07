const fs = require("fs");
const stream = require("stream");
const { exec } = require("child_process");
const path = require("path");
const hasha = require("hasha");
const splitFileStream = require("split-file-stream");
const { saveFileDB } = require("../db");
const { addFileElement } = require("./dlFile");
const { addStatus, clearStatusBoard } = require("./status");
const { createEncryptStream, createZip } = require("./crypt");

const createEncryptCompressFileStream = (originalPath) => {
	let file_readStream = fs.createReadStream(originalPath);
	addStatus("Adding GZIP Compression and AES 256 Encryption...");

	let encryptCompressFileStream = new stream.PassThrough();

	file_readStream.pipe(createZip()).pipe(createEncryptStream()).pipe(encryptCompressFileStream);

	return encryptCompressFileStream;
}

var file_source = document.getElementById("file-source");
file_source.onchange = function handleUpload() {
	let file_source = document.getElementById("file-source").files;
	if(file_source.length == 0) {

	} else {
		let { name: file_name, path: originalPath } = file_source[0];
		let new_hashed_filename = hasha(file_name + Date.now().toString());

		clearStatusBoard();
		addStatus(`Uploading file '${file_name}'...`)

		let new_filepath = `./files/${new_hashed_filename}`;
		let encryptCompressFileStream = createEncryptCompressFileStream(originalPath)

		splitFileStream.split(encryptCompressFileStream, 1024 * 1024 * 30, new_filepath, (file_partitions) => {
			addStatus(`Split file into ${file_partitions.length} partitions. Uploading to GitHub...`);
			let git_cmds = `cd ${path.join(__dirname, "../files")} && git add ./${new_hashed_filename}.split* && git commit -m "${new_hashed_filename}" && git push origin HEAD`;
			exec(git_cmds, (err, stdout, stderr) => {
				if(err) throw err;
				addStatus(stdout);
				addStatus(stderr);

				saveFileDB(file_name, new_hashed_filename, file_partitions)
				.then(() => {
					addFileElement(file_name, new_hashed_filename, file_partitions);
					console.log("Finished");
				});
			});
		});
	}
	return false;
}
