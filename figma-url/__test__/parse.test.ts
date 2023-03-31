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

test("parse nodeid and fileid from url v1 (old figma url via copy link / plain)", () => {
  const url =
    "https://www.figma.com/file/Gaznaw1QHppxvs9UkqNOb0/grida.co?node-id=5683:31451&t=ttMsIZRdkBv78VUQ-0";
  expect(parseFileAndNodeId(url)).toEqual({
    file: "Gaznaw1QHppxvs9UkqNOb0",
    node: "5683:31451",
    url,
  });
});

test("parse nodeid and fileid from url v1 (old figma url via copy link / url encoded)", () => {
  const url =
    "https://www.figma.com/file/Gaznaw1QHppxvs9UkqNOb0/grida.co?node-id=5683%3A31451&t=ttMsIZRdkBv78VUQ-0";
  expect(parseFileAndNodeId(url)).toEqual({
    file: "Gaznaw1QHppxvs9UkqNOb0",
    node: "5683:31451",
    url,
  });
});

test("parse nodeid and fileid from url v2 (updated figma url via copy link)", () => {
  const url =
    "https://www.figma.com/file/Gaznaw1QHppxvs9UkqNOb0/grida.co?node-id=5683-31451&t=ttMsIZRdkBv78VUQ-0";
  expect(parseFileAndNodeId(url)).toEqual({
    file: "Gaznaw1QHppxvs9UkqNOb0",
    node: "5683:31451",
    url,
  });
});
