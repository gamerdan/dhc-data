// Check inputs
// todo: move inputs from ENV file to command line or something
require("dotenv").load();
const inputPath = process.env.INPUT_PATH;
const outputPath = "./output/";

if (!inputPath) throw "No input path given, add `INPUT_PATH` to env (pointing at windows DHC install)";

const dataType = process.env.DATA_TYPE;
if (!dataType) throw "No data type given, add `DATA_TYPE` to env with the type value (github, gamerdan, gearhunter)";

// Generate data type based on env file
switch(dataType.toLowerCase()) {
    case "github":
        require("./functions/generate_github_data")(inputPath, outputPath);
        break;
    case "gamerdan":
        require("./functions/generate_gamerdan_data");
        break;
    case "gearhunter":
        require("./functions/generate_gearhunter_data")(inputPath);
        break;
}
