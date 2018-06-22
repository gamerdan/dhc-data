const { spawnSync } = require("child_process");
const path = require("path");
const readJson = require("./read_json_file");
const ensureDir = require("./ensure_directory");

const TMP_PATH = "./tmp/";
ensureDir(TMP_PATH);

const DESIGN_PATH = path.join("Data", "Design");

module.exports = (installBasePath, filename) => {
    // Process file with quickbms
    console.log(path.join(installBasePath, DESIGN_PATH, `${filename}.xlsx`));
    spawnSync("bin/quickbms.exe", [
        "bin/gcbf_versus.bms",
        path.join(installBasePath, DESIGN_PATH, `${filename}.xlsx`),
        TMP_PATH
    ]);

    // Read temp json file
    return readJson(path.join(TMP_PATH, `${filename}.dat`));
};
