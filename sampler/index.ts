import yargs from "yargs";
import sample from "./sampler";
import path from "path";
import dotenv from "dotenv";

// load .env
dotenv.config();

yargs
  .scriptName("sampler")
  .usage("$0 <cmd> [args]")
  .command(
    "fetch <key> [ids...]",
    "Fetches data from the API",
    (yargs) => {
      yargs.positional("key", {
        type: "string",
        describe: "The key to fetch",
      });

      yargs.positional("ids", {
        type: "string",
        describe: "The ids to fetch",
      });
      //
    },
    ({ key, ids }) => {
      if (Array.isArray(ids) && ids.length > 0) {
        ids = ids.map((id) => decodeURIComponent(id));

        console.log("sampling", ids, "from", key, "...");

        sample({
          filekey: key as string,
          ids: ids as string[],
          auth: {
            personalAccessToken: process.env.FIGMA_PERSONAL_ACCESS_TOKEN,
          },
          outdir: path.join(__dirname, "out"),
        });
      } else {
        console.error("no ids provided");
      }
    }
  )
  .demandCommand()
  .help().argv;
