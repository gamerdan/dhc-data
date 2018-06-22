const fs = require("fs");
const path = require("path");

const loadRawData = require("./load/load_data_files");
const ensureDir = require("./helpers/ensure_directory");
const extractUnitData = require("./extract/extract_unit_data");
const extractGuildData = require("./extract/extract_guild_data");
const copyUnitImages = require("./images/copy_unit_images");

module.exports = (installPathBase, outputPath) => {
    const dataPath = path.join(outputPath, "data");
    const unitDataPath = path.join(dataPath, "units");
    ensureDir(unitDataPath);

    // Load
    const rawData = loadRawData(installPathBase);

    // Output unit data
    const unitData = extractUnitData(rawData);
    unitData.forEach(unit => {
        fs.writeFileSync(path.join(unitDataPath, `${unit.HeroId}.json`), JSON.stringify(unit, null, 2));
    });

    // Output guild data
    const guildData = extractGuildData(rawData);
    fs.writeFileSync(path.join(dataPath, "guild.json"), JSON.stringify(guildData, null, 2));

    // Copy images
    copyUnitImages(installPathBase, outputPath);
};
