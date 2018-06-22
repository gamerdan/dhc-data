const fixNumber = (v) => parseFloat(v.toFixed(12));

module.exports = ({ rawGuildData }) => {

    let previousLevel = {};

    return rawGuildData.GuildStats.Rows.map(([level, updatedStatString, upgradeCost]) => {
        // Split strange string storage
        const updatedStatKeys = updatedStatString.split(",");

        // Find increases
        const updatedStats = updatedStatKeys.reduce((st, cur) => {
            const [stat, Flat, Percent] = rawGuildData[cur].Rows[0];
            return {
                ...st,
                [stat]: { Flat, Percent }
            };
        }, {});

        // Combine with previous level
        const updatedLevel = Object.keys(updatedStats).reduce((st, key) => {
            const value = updatedStats[key];
            const existingValue = previousLevel[key] || { Flat: 0, Percent: 0 };
            return {
                ...st,
                [key]: {
                    Flat: fixNumber(value.Flat + existingValue.Flat),
                    Percent: fixNumber(value.Percent + existingValue.Percent),
                },
            };
        }, {});

        previousLevel = { ...previousLevel, ...updatedLevel };

        return {
            Level: level,
            UpgradeCost: upgradeCost,
            UpdatedStats: updatedStats,
            Stats: { ...previousLevel, ...updatedLevel },
        };
    });
};
