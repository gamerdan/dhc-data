const fixNumber = (v) => parseFloat(v.toFixed(12));

module.exports = ({ rawGuildData }) => {

    let previousLevel = {};

    return rawGuildData.GuildStats.Rows.map(([level, updatedStatString, upgradeCost]) => {

        const updatedStatKeys = updatedStatString.split(",");

        // Find increases
        const updatedStats = updatedStatKeys.reduce((st, cur) => {
            const [stat, flat, percent] = rawGuildData[cur].Rows[0];
            return {
                ...st,
                [stat]: { flat, percent }
            };
        }, {});

        // Combine with previous level
        const updatedLevel = Object.keys(updatedStats).reduce((st, key) => {
            const value = updatedStats[key];
            const existingValue = previousLevel[key] || { flat: 0, percent: 0 };
            return {
                ...st,
                [key]: {
                    flat: fixNumber(value.flat + existingValue.flat),
                    percent: fixNumber(value.percent + existingValue.percent),
                },
            };
        }, {});

        previousLevel = { ...previousLevel, ...updatedLevel };

        return {
            level,
            upgradeCost,
            updatedStats,
            stats: { ...previousLevel, ...updatedLevel },
        };
    });
};
