require("dotenv").config();

const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const express = require("express");
const splitFileStream = require("split-file-stream");
const app = express();
const port = (process.env.PORT || 5000);
const { createUnzip, createDecryptStream } = require("../lib/crypt");
const { findAllFiles, findFileHash } = require("../db");

const writeFileToStream = (filename, partitions, stream) => {
	return new Promise((resolve, reject) => {
		exec(`cd ../files && git fetch origin && git checkout origin/master ${filename}.*`, (err, stdout, stderr) => {
			if(err) throw err;

			console.log(stdout);
			console.log(stderr);

			splitFileStream.mergeFiles(partitions.map((partition) => path.join(__dirname, "..", partition)), `../files/${filename}`, () => {
				let fileDecipherStream = fs.createReadStream(path.join(__dirname, "../files", filename));
				fileDecipherStream.pipe(createDecryptStream()).pipe(createUnzip()).pipe(stream);
			});
		});
	});
};

app.use(express.static(path.join(__dirname, "static")));

app.set("view engine", "ejs");

app.get("/files", (req, res) => {
	findAllFiles()
	.then((files) => {
		res.locals.files = files;
		res.render("files");
	});
});

app.get("/download", (req, res) => {
	res.set('Content-disposition', `attachment; filename=${req.query.filename}`);
	findFileHash(req.query.filename)
	.then(({ partitions, hash }) => {
		writeFileToStream(hash, partitions, res);
	});
});

app.listen(port, () => console.log("Server listening in on port", port));