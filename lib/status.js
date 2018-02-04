const addStatus = (text) => {
	let status_container = document.getElementById("status");
	let status_line = document.createElement("pre");

	status_line.appendChild(document.createTextNode(text));

	status_container.appendChild(status_line);
};

const clearStatusBoard = () => {
	let status_container = document.getElementById("status");

	while (status_container.firstChild) {
	    status_container.removeChild(status_container.firstChild);
	}
};

module.exports.addStatus = addStatus;
module.exports.clearStatusBoard = clearStatusBoard;