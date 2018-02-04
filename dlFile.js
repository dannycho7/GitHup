const fs = require("fs");
const { exec } = require("child_process");
const { findAllFiles } = require("./db");

const downloadFile = (filename, save_filepath) => {
	exec(`cd ./files && git fetch origin && git checkout origin/master ${filename}`, (err, stdout, stderr) => {
		if(err) throw err;

		console.log(stdout);
		console.log(stderr);
	});
};

let file_list = document.getElementById("file_list");
findAllFiles()
.then((files) => {
	console.log(files);
});