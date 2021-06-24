import { parseFileAndNodeId, parseFileId } from "../lib/parse-url";
import {
  __FIGMA_DEMO_DEFAULT_FILE_ID,
  __FIGMA_DEMO_DEFAULT_FILE_URL,
  __FIGMA_DEMO_DEFAULT_FILE_NODE_URL,
} from "../lib";

test("parse fileid from url", () => {
  expect(parseFileId(__FIGMA_DEMO_DEFAULT_FILE_URL)).toBe(
    __FIGMA_DEMO_DEFAULT_FILE_ID
  );
});

// test("parse nodeid and fileid from url", () => {
//   expect(parseFigmaFileAndNodeIdFromUrl(FIGMA_DEMO_DEFAULT_FILE_NODE_URL)).toBe(
//     3
//   );
// });
