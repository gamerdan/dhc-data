const extractUnitStats = require("./extract_unit_stats");
const extractUnitSkills = require("./extract_unit_skills");
const getLocalizationText = require("../helpers/get_localization_text");
const parse = require("../parse/parse_raw");

module.exports = (rawData) => {
    const parsedData = parse(rawData.rawUnitData.Heroes);

    return parsedData.map(unit => ({
        UnitId: unit.UnitID,
        HeroId: unit.HeroID,
        Name: getLocalizationText(rawData.localization.unit, `name_${unit.HeroID}`),
        Family: unit.Family,
        Element: unit.Element,
        Class: unit.CharacterClass,
        MinStar: unit.MinStar,
        MaxStar: unit.MaxStar,
        DefaultLevel: unit.DefaultLevel,
        Universe: unit.Universe,
        Awakened: unit.Awakened === "true", // convert to real boolean
        CanBeAwakened: unit.CanBeAwakened,
        AwakeningEssence: unit.AwakeningEssenceIDs
            .filter(x => x !== null)
            .map((id, ix) => ({ id, quantity: parseInt(unit.AwakeningEssenceAmounts[ix]) })),
        Strength: unit.Strength.filter(x => x.tag !== null),
        RecommendedGear: unit.RecGear.filter(x => x !== null),
        Leader: unit.LeaderTraitStat == null ? null : {
            Stat: unit.LeaderTraitStat,
            Condition: unit.LeaderTraitCondition,
            PercentageBoost: unit.LeaderTraitPercentageBoost,
        },
        Stats: extractUnitStats(parse(rawData.rawUnitData[unit.StatsTable])),
        Skills: extractUnitSkills(rawData, unit),
        DebugHero: unit.DebugHero,
        CanBeAcquired: unit.CanBeAcquired,
    }));
};
