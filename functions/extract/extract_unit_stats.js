const getRangeDetails = (Min, Max, star) => {
    const Step = (Max - Min) / ((star * 10) - 1);
    return { Min, Max, Step };
};

const transformStats = (stats) => {
    const { Star, MinHealth, MaxHealth, MinDefense, MaxDefense, MinAttack, MaxAttack, ...rest } = stats;
    const Health = getRangeDetails(MinHealth, MaxHealth, Star);
    const Defense = getRangeDetails(MinDefense, MaxDefense, Star);
    const Attack = getRangeDetails(MinAttack, MaxAttack, Star);
    return { Star, Health, Attack, Defense, ...rest };
};

module.exports = (statsTable) => statsTable.map(transformStats);
