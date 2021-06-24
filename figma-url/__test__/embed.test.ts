import { __FIGMA_DEMO_DEFAULT_FILE_NODE_URL } from "../lib";
import { embed } from "../lib";

test("parse fileid from url", () => {
  expect(embed(__FIGMA_DEMO_DEFAULT_FILE_NODE_URL)).toBe(
    "https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49"
  );
});
