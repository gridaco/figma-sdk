import {
  parseFigmaFileAndNodeIdFromUrl,
  parseFigmaFileIdFromUrl,
} from "../lib/parse-url";
import {
  FIGMA_DEMO_DEFAULT_FILE_ID,
  FIGMA_DEMO_DEFAULT_FILE_URL,
  FIGMA_DEMO_DEFAULT_FILE_NODE_URL,
} from "../lib";

test("parse fileid from url", () => {
  expect(parseFigmaFileIdFromUrl(FIGMA_DEMO_DEFAULT_FILE_URL)).toBe(
    FIGMA_DEMO_DEFAULT_FILE_ID
  );
});

// test("parse nodeid and fileid from url", () => {
//   expect(parseFigmaFileAndNodeIdFromUrl(FIGMA_DEMO_DEFAULT_FILE_NODE_URL)).toBe(
//     3
//   );
// });
