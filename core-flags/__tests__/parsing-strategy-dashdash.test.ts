import { parse } from "../parsing-strategy-dashdash";

test("simple layer name flag parsing", () => {
  const parsed = parse("--layer=foo --ignore-constaints");
  expect(parsed).toEqual({
    _order: ["layer", "ignore-constaints"],
    layer: "foo",
    "ignore-constaints": true,
  });
});
