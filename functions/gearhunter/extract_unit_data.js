const getLocalizationText = require("../helpers/get_localization_text");

const getRangeDetails = (min, max, star) => {
    const step = (max - min) / ((star * 10) - 1);
    return { min, max, step };
};

const convertToSimpleObjects = (fields) => (row) => {
    return fields.reduce((st, cur, ix) => ({ ...st, [cur]: row[ix] }), {});
};

const transformStats = (stats) => {
    const { Star, MinHealth, MaxHealth, MinDefense, MaxDefense, MinAttack, MaxAttack, ...rest } = stats;
    const Health = getRangeDetails(MinHealth, MaxHealth, Star);
    const Defense = getRangeDetails(MinDefense, MaxDefense, Star);
    const Attack = getRangeDetails(MinAttack, MaxAttack, Star);
    return { Star, Health, Attack, Defense, ...rest };
};

const getStrength = (row) => ([
    { tag: row[22], quality: row[23] },
    { tag: row[24], quality: row[25] },
    { tag: row[26], quality: row[27] },
].filter(x => !!x.tag));

module.exports = ({ rawUnitData, localization }) => {
    const getName = (id) => getLocalizationText(localization.unit, `name_${id}`);
    const getStats = (tableId) => {
        const rawStats = rawUnitData[tableId];
        if (!rawStats) return null;

        return rawStats.Rows
            .map(convertToSimpleObjects(rawStats.Fields))
            .map(transformStats);
    };

    // Filter on available flag
    const availableUnits = rawUnitData.Heroes.Rows.filter(row => row[39]);

    return availableUnits.map(row => ({
        id: row[1],
        name: getName(row[1]),
        family: row[2],
        awakened: row[3] === "true",
        canAwaken: row[36],
        element: row[4],
        class: row[5],
        star: row[7],
        strength: getStrength(row),
        stats: getStats(row[31]),
        debug: row[38],
    }));
};
