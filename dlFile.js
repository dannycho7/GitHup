const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { findAllFiles } = require("./db");
const { dialog } = require("electron").remote;

const downloadFile = (filename, save_filepath) => {
	exec(`cd ./files && git fetch origin && git checkout origin/master ${filename}`, (err, stdout, stderr) => {
		if(err) throw err;

		console.log(stdout);
		console.log(stderr);

		fs.rename(path.join(__dirname, "files", filename), save_filepath, (err) => {
			if(err) throw err;

			console.log("Finished saving file");
		});
	});
};

const addFileElement = (filename, hash) => {
	let file_list = document.getElementById("file-list");
	let file_element = document.createElement("div");
	let file_label = document.createElement("span");
	let file_link = document.createElement("button");
	
	file_element.className = "file-element";
	file_label.className = "file-label";
	file_link.className = "file-link";
	
	file_link.onclick = () => dialog.showSaveDialog({ title: "hello" }, (targetPath) => {
		if(targetPath) {
			downloadFile(hash, targetPath)
		}
	});

	file_label.appendChild(document.createTextNode(filename));
	file_element.appendChild(file_label);
	file_link.appendChild(document.createTextNode("Download"));
	file_element.appendChild(file_link);
	file_list.appendChild(file_element);
};

const initFiles = () => {
	findAllFiles()
	.then((files) => {
		files.forEach(({ filename, hash }) => addFileElement(filename, hash));
	});
}

module.exports.addFileElement = addFileElement;
module.exports.initFiles = initFiles;