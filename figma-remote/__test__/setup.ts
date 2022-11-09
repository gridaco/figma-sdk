import path from "path";
import dotenv from "dotenv";

const file = path.resolve(__dirname, "./.env.test");

// if .env.test not found, throw.
if (!dotenv.config({ path: file }).parsed) {
  throw new Error(
    `.env.test not found at "${file}" To run this test, you need to setup your FIGMA_PERSONAL_ACCESS_TOKEN in .env.test`
  );
}
