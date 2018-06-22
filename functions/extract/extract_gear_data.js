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
            .map(([Star, _, Min, Max]) => ({ Star, Min, Max }));

        const subStatRolls = rawGearData.SubStats2.Rows
            .filter(([stat]) => stat === key)
            .map(([_, ...ranges]) => ([
                { Star: 1, Min: ranges[0], Max: ranges[1] },
                { Star: 2, Min: ranges[2], Max: ranges[3] },
                { Star: 3, Min: ranges[4], Max: ranges[5] },
                { Star: 4, Min: ranges[6], Max: ranges[7] },
                { Star: 5, Min: ranges[8], Max: ranges[9] },
                { Star: 6, Min: ranges[10], Max: ranges[11] },
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
