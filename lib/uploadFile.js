const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const hasha = require("hasha");
const splitFile = require("split-file");
const { saveFileDB } = require("../db");
const { addFileElement } = require("./dlFile");
const { addStatus, clearStatusBoard } = require("./status");
const { createEncryptStream, createZip } = require("./crypt");

const copyFile = (originalPath, newPath) => {
	return new Promise((resolve, reject) => {
		let file_readStream = fs.createReadStream(originalPath);
		addStatus("Adding GZIP Compression and AES 256 Encryption...");
		file_readStream.pipe(createZip()).pipe(createEncryptStream()).pipe(fs.createWriteStream(newPath));

		file_readStream.on("end", resolve);
	});
}

var file_source = document.getElementById("file-source");
file_source.onchange = function handleUpload() {
	let file_source = document.getElementById("file-source").files;
	if(file_source.length == 0) {

	} else {
		let { name: file_name, path: original_path } = file_source[0];
		let new_hashed_filename = hasha(file_name + Date.now().toString());

		clearStatusBoard();
		addStatus(`Uploading file '${file_name}'...`)

		let new_filepath = `./files/${new_hashed_filename}`;
		copyFile(original_path, new_filepath)
		.then(() => {
			console.log("Done copying file");
			splitFile.splitFileBySize(new_filepath, 1024 * 1024 * 384)
			.then((file_partitions) => {
				let git_cmds = `cd ${path.join(__dirname, "../files")} && git add ./${new_hashed_filename}.sf* && git commit -m "${new_hashed_filename}" && git push origin HEAD`;
				exec(git_cmds, (err, stdout, stderr) => {
					if(err) throw err;
					addStatus(stdout);
					addStatus(stderr);

					saveFileDB(file_name, new_hashed_filename, file_partitions)
					.then(() => {
						addFileElement(file_name, new_hashed_filename);
						console.log("Finished");
					});
				});
			});
		});
	}
	return false;
}
