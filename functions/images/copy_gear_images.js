const path = require("path");
const fs = require("fs");
const ensureDir = require("../helpers/ensure_directory");
const copyDir = require("../helpers/copy_directory_files");

const dirs = ["runes", "slots"];

module.exports = (installBasePath, outputBasePath) => {
    const gearPath = path.join(installBasePath, "Data", "Menus", "assets", "png", "_loaded", "gear");
    const outputPath = path.join(outputBasePath, "images", "gear");
    ensureDir(outputPath);

    dirs.forEach(dir => {
        const dirPath = path.join(outputPath, dir);
        ensureDir(dirPath);

        const inputPath = path.join(gearPath, dir);
        if (!fs.existsSync(inputPath)) throw "Cannot find install path";

        copyDir(inputPath, dirPath);
    });
};
