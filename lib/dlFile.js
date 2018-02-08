const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { findAllFiles } = require("../db");
const { dialog } = require("electron").remote;
const { createDecryptStream, createUnzip } = require("./crypt");
const splitFileStream = require("split-file-stream");

const downloadFile = (filename, partitions, save_filepath) => {
	console.log(`Attempting to download ${filename}`);

	exec(`cd ./files && git fetch origin && git checkout origin/master ${filename}.*`, (err, stdout, stderr) => {
		if(err) throw err;

		console.log(stdout);
		console.log(stderr);

		splitFileStream.mergeFilesToStream(partitions, (mergedStream) => {
			let decipheredFileWriteStream = fs.createWriteStream(save_filepath);
			mergedStream.pipe(createDecryptStream()).pipe(createUnzip()).pipe(decipheredFileWriteStream);
		});
	});
};

const addFileElement = (filename, hash, partitions) => {
	let file_list = document.getElementById("file-list");
	let file_element = document.createElement("div");
	let file_label = document.createElement("span");
	let file_link = document.createElement("button");
	
	file_element.className = "file-element";
	file_label.className = "file-label";
	file_link.className = "file-link";
	
	file_link.onclick = () => dialog.showSaveDialog({ title: "hello" }, (targetPath) => {
		if(targetPath) {
			downloadFile(hash, partitions, targetPath)
		}
	});

	file_label.appendChild(document.createTextNode(filename));
	file_element.appendChild(file_label);
	file_element.appendChild(file_link);
	file_list.appendChild(file_element);
};

const initFiles = () => {
	findAllFiles()
	.then((files) => {
		files.forEach(({ filename, hash, partitions }) => addFileElement(filename, hash, partitions));
	});
}

module.exports.addFileElement = addFileElement;
module.exports.initFiles = initFiles;