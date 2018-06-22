const getLocalisationText = require("../helpers/get_localization_text");

module.exports = ({ rawGearData, localization }) => {
    const gearSlots = rawGearData.GearSlots.Rows;
    const gearSets = rawGearData.GearSets.Rows;
    const gearStats = rawGearData.GearStats.Rows;
    const setEffects = rawGearData.GearSetEffects.Rows;

    const additionalSubStatLevels = rawGearData.LevelSubStats.Rows
        .filter(([level, subStats]) => subStats > 0)
        .map(([level]) => level);

    const quality = rawGearData.Rarities.Rows
        .map(([id, colour, initialSubStats]) => ({
            Id: id,
            // colour: `#${colour.substr(2)}`, // data is flat out wrong
            InitialSubStats: initialSubStats,
            AddSubStats: additionalSubStatLevels.slice(initialSubStats),
            RollSubStats: additionalSubStatLevels.slice(0, initialSubStats),
        }));

    const stats = gearStats.reduce((st, [key, stat, type]) => {
        const statEntry = rawGearData[key];
        if (!statEntry) return st;

        const mainStat = rawGearData[key].Rows
            .map(([_, ...starRows]) => starRows);

        const subStatInitial = rawGearData.SubStats.Rows
            .filter(([_, statId]) => statId === key)
            .map(([star, __, min, max]) => ({ star, min, max }));

        const subStatRolls = rawGearData.SubStats2.Rows
            .filter(([stat]) => stat === key)
            .map(([_, ...ranges]) => ([
                { star: 1, min: ranges[0], max: ranges[1] },
                { star: 2, min: ranges[2], max: ranges[3] },
                { star: 3, min: ranges[4], max: ranges[5] },
                { star: 4, min: ranges[6], max: ranges[7] },
                { star: 5, min: ranges[8], max: ranges[9] },
                { star: 6, min: ranges[10], max: ranges[11] },
            ]));

        return {
            ...st,
            [key]: {
                Stat: stat,
                Type: type,
                MainStat: mainStat,
                SubStat: {
                    Initial: subStatInitial,
                    Roll: subStatRolls,
                },
            },
        };
    }, {});

    const slots = gearSlots.map(([id], i) => {
        const mainStats = rawGearData.SlotStats.Rows
            .filter(([slotIndex]) => slotIndex === i)
            .map(([_, stat]) => stat);

        return {
            Id: id,
            Name: getLocalisationText(localization.gear, `gear_slot${id}`),
            MainStats: mainStats,
        };
    });

    const sets = gearSets.map(([id], i) => {
        const [_, pieces, stat, value] = setEffects.find(([setId]) => setId === id);

        return {
            Id: id,
            NumberId: i + 1,
            Name: getLocalisationText(localization.gear, `gear_set_${id}`),
            Effect: {
                Pieces: pieces,
                Value: value,
                Stat: stat,
            },
        };
    });

    const power = rawGearData.PowerUpChance.Rows
        .map(([Level, Success], i) => ({
            Level,
            Success,
            Cost: rawGearData.GearPowerUpCost.Rows[i].slice(2),
        }));

    const removal = rawGearData.GearRemovalCost.Rows
        .map(([Star, _, Cost]) => ({ Star, Cost }));

    return {
        Quality: quality,
        Stats: stats,
        Slots: slots,
        Sets: sets,
        Power: power,
        Removal: removal,
    };
};
