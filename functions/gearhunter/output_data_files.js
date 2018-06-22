const fs = require("fs");
const path = require("path");
const ensureDir = require("../helpers/ensure_directory");

const data_path = "./data/";

module.exports = (basePath, unitList, guildStats, gearStats) => {
    const dataPath = path.join(basePath, data_path);
    ensureDir(dataPath);

    // // Output each unit
    // const individualPath = path.join(basePath, data_path, "./unit/");
    // ensureDir(individualPath);
    // unitList.forEach(unit =>
    //     fs.writeFileSync(path.join(individualPath, `${unit.id}.json`), JSON.stringify(unit))
    // );

    // Output full unit lists
    fs.writeFileSync(path.join(dataPath, "units.json"), JSON.stringify(unitList.filter(x => !x.debug)));
    fs.writeFileSync(path.join(dataPath, "units-debug.json"), JSON.stringify(unitList));

    // Output guild stats
    fs.writeFileSync(path.join(dataPath, "guild.json"), JSON.stringify(guildStats));

    // Output gear stats
    fs.writeFileSync(path.join(dataPath, "gear.json"), JSON.stringify(gearStats));
};
