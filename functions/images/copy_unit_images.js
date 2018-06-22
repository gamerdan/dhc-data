const path = require("path");
const fs = require("fs");
const ensureDir = require("../helpers/ensure_directory");
const copyDir = require("../helpers/copy_directory_files");

module.exports = (installBasePath, outputBasePath) => {
    const inputPath = path.join(installBasePath, "Data", "Menus", "assets", "png", "_loaded", "heroPortraits");
    const outputPath = path.join(outputBasePath, "images", "units");
    ensureDir(outputPath);

    if (!fs.existsSync(inputPath)) throw "Cannot find install path";

    copyDir(inputPath, outputPath);
};
