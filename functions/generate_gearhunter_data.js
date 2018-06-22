const fs = require("fs");
const path = require("path");
const ensureDir = require("./helpers/ensure_directory");

const loadFiles = require("./load/load_data_files");
const extractUnitData = require("./extract/extract_unit_data");
const extractGuildData = require("./extract/extract_guild_data");
const extractGearData = require("./extract/extract_gear_data");

const copyUnitImages = require("./images/copy_unit_images");
const copyBorderImages = require("./images/copy_portrait_images");
const copyIconImages = require("./images/copy_icon_images");
const copyGearImages = require("./images/copy_gear_images");

const output_path = "./gearhunter_output/";

module.exports = (installPathBase) => {
    // Process
    const rawData = loadFiles(installPathBase);
    const unitList = extractUnitData(rawData);
    const gearStats = extractGearData(rawData);
    const guildStats = extractGuildData(rawData);

    ensureDir(output_path);

    // Output Images
    copyUnitImages(installPathBase, output_path);
    copyBorderImages(installPathBase, output_path);
    copyIconImages(installPathBase, output_path);
    copyGearImages(installPathBase, output_path);

    // Output Data
    const dataPath = path.join(output_path, "/data/");
    ensureDir(dataPath);

    // Strip skills
    unitList.forEach(x => delete x.Skills);

    // Output full unit lists
    fs.writeFileSync(path.join(dataPath, "units.json"), JSON.stringify(unitList.filter(x => !x.DebugHero && x.CanBeAcquired)));
    fs.writeFileSync(path.join(dataPath, "units-debug.json"), JSON.stringify(unitList.filter(x => x.CanBeAcquired)));

    // Output guild stats
    fs.writeFileSync(path.join(dataPath, "guild.json"), JSON.stringify(guildStats));

    // Output gear stats
    fs.writeFileSync(path.join(dataPath, "gear.json"), JSON.stringify(gearStats));
};
