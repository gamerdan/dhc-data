const loadFiles = require("./load/load_data_files");
const extractUnitData = require("./gearhunter/extract_unit_data");
const extractGuildStats = require("./gearhunter/extract_guild_stats");
const extractGearData = require("./gearhunter/extract_gear_data");

const outputDatFiles = require("./gearhunter/output_data_files");

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
    const guildStats = extractGuildStats(rawData);

    // Output
    outputDatFiles(output_path, unitList, guildStats, gearStats);
    copyUnitImages(installPathBase, output_path);
    copyBorderImages(installPathBase, output_path);
    copyIconImages(installPathBase, output_path);
    copyGearImages(installPathBase, output_path);
};
