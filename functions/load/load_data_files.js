const path = require("path");
const readJson = require("../helpers/read_json_file");
const readGcbf = require("../helpers/read_gcbf_file");

const languageCodes = ["en", "fr", "de", "es"];

module.exports = (installPathBase) => {
    // Helpers
    const getLocalizationFilePath = (filename, languageCode) =>
        path.join(installPathBase, "Data", "Localization", `${filename}_${languageCode}.json`);

    const getLocalizationObject = (filename) => languageCodes
        .reduce((st, code) => ({
            ...st,
            [code]: readJson(getLocalizationFilePath(filename, code))
        }), {});

    // Read required localization files
    const localization = {
        unit: getLocalizationObject("champions"),
        unitInfo: getLocalizationObject("championinfo"),
        lore: getLocalizationObject("lore"),
        gear: getLocalizationObject("gear"),
        skills: getLocalizationObject("skills"),
        skillUps: getLocalizationObject("skillups"),
        leaderSkills: getLocalizationObject("leaderskills"),
        buffs: getLocalizationObject("buffs"),
    };

    // Read main data files
    const rawUnitData = readGcbf(installPathBase, "Champions");
    const rawGearData = readGcbf(installPathBase, "Gear");
    const rawGuildData = readGcbf(installPathBase, "Clan");
    const rawSkillData = readGcbf(installPathBase, "Skills_Data");
    const rawCombatData = readGcbf(installPathBase, "Combat_Data");
    const rawSkillMapData = readJson(path.join(installPathBase, "Data", "Baked", "Skills", "CharacterSkillList.json"));

    return {
        rawUnitData,
        rawGearData,
        rawGuildData,
        rawSkillData,
        rawCombatData,
        rawSkillMapData,
        localization,
    };
};

