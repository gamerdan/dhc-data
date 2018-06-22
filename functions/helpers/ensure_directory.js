const fs = require("fs");
const path = require("path");

const ensureDir = (dir) => {
    if (fs.existsSync(dir)) return;

    ensureDir(path.dirname(dir));
    fs.mkdirSync(dir);
};

module.exports = ensureDir;
