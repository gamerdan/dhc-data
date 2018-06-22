const fs = require("fs");
const path = require("path");
const copyUnitImages = require("./output/copy_unit_images");
const ensureDir = require("./helpers/ensure_directory");
const getLocalizationText = require("./helpers/get_localization_text");
const loadUnitData = require("./load/load_unit_data");
const parse = require("./parse/parse_raw");

module.exports = (installPathBase, outputPath) => {
    const unitOutputPath = path.join(outputPath, "data", "units");
    ensureDir(unitOutputPath);

    const { rawUnitData, localization } = loadUnitData(installPathBase);
    const parsedData = parse(rawUnitData.Heroes);

    const dataWithStats = parsedData.map(unit => ({
        ...unit,
        Name: getLocalizationText(localization.unit, `name_${unit.HeroID}`),
        Stats: parse(rawUnitData[unit.StatsTable]),
    }));

    dataWithStats.forEach(unit => {
        // Tweak some fields, remove uninteresting, fix quirks
        delete unit.DebugHero;
        delete unit.IconPath;
        delete unit.CanBeAcquired;
        delete unit.StatsTable;
        delete unit.TemplatePath;
        delete unit.TrackingName;
        delete unit.CanBeWonInGacha;

        unit.Strength = unit.Strength.filter(x => x.tag !== null);
        unit.RecGear = unit.RecGear.filter(x => x !== null);
        unit.AwakeningEssenceAmounts = unit.AwakeningEssenceAmounts.map(x => x ? parseInt(x) : x);

        // Output
        fs.writeFileSync(path.join(unitOutputPath, `${unit.HeroID}.json`), JSON.stringify(unit, null, 2));
    });

    // Copy images
    copyUnitImages(installPathBase, outputPath);
};

