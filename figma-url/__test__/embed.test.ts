import { embed } from "../lib";

test("build embed url", () => {
  const _url =
    "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49";
  expect(embed(_url)).toBe(
    "https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49"
  );
});

test("build embed url with file & node id", () => {
  expect(embed({ fileid: "Y0Gh77AqBoHH7dG1GtK3xF", nodeid: "264%3A49" })).toBe(
    "https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49"
  );
});
