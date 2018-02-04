const fs = require("fs");
const { exec } = require("child_process");
const hasha = require("hasha");
const { saveFileDB } = require("./db");
const { addFileElement } = require("./dlFile");

const copyFile = (originalPath, newPath) => {
	return new Promise((resolve, reject) => {
		let file_readStream = fs.createReadStream(originalPath);
		file_readStream.pipe(fs.createWriteStream(newPath));

		file_readStream.on("end", resolve);
	});
}

var file_source = document.getElementById("file-source");
file_source.onchange = function handleUpload() {
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

				saveFileDB(file_name, new_hashed_filename)
				.then(() => {
					addFileElement(file_name, new_hashed_filename);
					console.log("Finished");
				});
			});
		});
	}
	return false;
}
