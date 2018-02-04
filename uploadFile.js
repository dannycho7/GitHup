const fs = require("fs");
const { exec, spawn } = require("child_process");
const hasha = require("hasha");

const copyFile = (originalPath, newPath) => {
	return new Promise((resolve, reject) => {
		let file_readStream = fs.createReadStream(originalPath);
		file_readStream.pipe(fs.createWriteStream(newPath));

		file_readStream.on("end", resolve);
	});
}

const saveFileToDict = (file_name, file_name_hash) => {
	return new Promise((resolve, reject) => {
		resolve();
	});
}

var file_upload = document.getElementById("file-upload");
file_upload.onsubmit = function handleUpload(evt) {
	evt.preventDefault();
	let file_source = document.getElementById("file-source").files;
	if(file_source.length == 0) {

	} else {
		let { name: file_name, path } = file_source[0];
		console.log("Received a submission", file_source[0]);
		let new_hashed_filename = hasha(file_name + Date.now().toString());

		copyFile(path, `./files/${new_hashed_filename}`)
		.then(() => {
			console.log("Done copying file");
			let git_cmds = `cd ./files && git add ./${new_hashed_filename} && git commit -m "${new_hashed_filename}" && git push origin HEAD`;
			exec(git_cmds, (err, stdout, stderr) => {
				if(err) throw err;
				console.log("std out:", stdout);
				console.log("std err:", stderr);

				saveFileToDict(file_name, new_hashed_filename)
				.then(() => {
					console.log("Finished");
				});
			});
		});
	}
	return false;
}
