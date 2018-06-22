// Check inputs
// todo: move inputs from ENV file to command line or something
require("dotenv").load();
const inputPath = process.env.INPUT_PATH;
const outputPath = "./output/";

if (!inputPath) throw "No input path given, add `INPUT_PATH` to env (pointing at windows DHC install)";

// Testing
require("./functions/generate_gamerdan_data");
