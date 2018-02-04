const express = require("express");
const app = express();
const port = (process.env.PORT || 5000);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("index");
});

app.listen(port, () => console.log("Server listening in on port", port));