const getLocalizationText = require("../helpers/get_localization_text");

module.exports = ({ rawSkillMapData, localization }, unit) => {
    const unitSkillMap = rawSkillMapData.CharacterSkills[unit.Family];
    if (!unitSkillMap) return {};

    const unitSkills = { ...(unitSkillMap[unit.Element.toLowerCase()] || {}), ...(unitSkillMap.Family || {}) };

    const buildSkill = (skillId) => {
        return {
            id: skillId,
            name: getLocalizationText(localization.skills, `${skillId}_name`),
            description: getLocalizationText(localization.skills, `${skillId}_desc`),
        };
    };

    return Object
        .keys(unitSkills)
        .reduce((st, skillPosition) => ({ ...st, [skillPosition]: buildSkill(unitSkills[skillPosition]) }), {});
};
