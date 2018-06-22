const fs = require("fs");

module.exports = (path) => JSON.parse(fs.readFileSync(path));
