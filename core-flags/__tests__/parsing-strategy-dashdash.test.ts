import { parse } from "../parsing-strategy-dashdash";

test("simple layer name flag parsing", () => {
  const parsed = parse("--layer=foo");
  expect(parsed).toEqual({
    _order: ["layer"],
    layer: "foo",
  });
});
