import { analyze, FigmaUrlType } from "../lib";

test("analyze url - full url with node id", () => {
  const _url =
    "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49";
  expect(analyze(_url))
    //
    .toBe(FigmaUrlType.node);
});

test("analyze url - url with only file id", () => {
  const _url = "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/";
  expect(analyze(_url))
    //
    .toBe(FigmaUrlType.file);
});

test("analyze url - valid embedding url", () => {
  const _url =
    "https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49";
  expect(analyze(_url))
    //
    .toBe(FigmaUrlType.embed);
});

test("analyze url - invalid embedding url (only inspecting structure)", () => {
  const _url = // this is not embeddable 'case of missing "www."
    "https://figma.com/embed?embed_host=astra&url=https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49";
  expect(() => {
    analyze(_url);
  })
    //
    .toThrow("not a valid figma url.");
});

test("analyze url - empty embedding url", () => {
  const _url = undefined; // this is not embeddable 'case of missing "www."
  expect(analyze(_url as any as string))
    //
    .toBe(FigmaUrlType.empty);
});
