module.exports = (rawData, id) => {
    return Object.keys(rawData).reduce((st, lang) => {
        const translation = rawData[lang].find(x => x.Id === id);
        return {
            ...st,
            [lang]: translation ? translation.Text : null,
        };
    }, {});
};
