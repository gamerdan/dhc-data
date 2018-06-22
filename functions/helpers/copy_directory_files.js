const fs = require("fs");
const path = require("path");

module.exports = (inputPath, outputPath) => {
    const sourceFiles = fs.readdirSync(inputPath);

    sourceFiles.forEach(filename => {
        if (filename.indexOf(".") < 0) return;
        fs.writeFileSync(path.join(outputPath, filename), fs.readFileSync(path.join(inputPath, filename)));
    });
};
