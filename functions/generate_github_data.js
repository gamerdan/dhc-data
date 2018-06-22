const fs = require("fs");
const path = require("path");

const loadRawData = require("./load/load_data_files");
const ensureDir = require("./helpers/ensure_directory");
const extractUnitData = require("./extract/extract_unit_data");
const copyUnitImages = require("./images/copy_unit_images");

module.exports = (installPathBase, outputPath) => {
    const rawData = loadRawData(installPathBase);
    const unitData = extractUnitData(rawData);

    // Output unit data
    const unitOutputPath = path.join(outputPath, "data", "units");
    ensureDir(unitOutputPath);
    unitData.forEach(unit => {
        fs.writeFileSync(path.join(unitOutputPath, `${unit.HeroId}.json`), JSON.stringify(unit, null, 2));
    });

    // Copy images
    copyUnitImages(installPathBase, outputPath);
};
