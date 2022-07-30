import { parse } from "../parsing-strategy-dashdash";

test("anonymous flags parsing", () => {
  const parsed = parse("--foo=bar --ignore-constaints");
  expect(parsed).toEqual({
    _order: ["foo", "ignore-constaints"],
    foo: "bar",
    "ignore-constaints": true,
  });
});

// test("anonymous flags with leading name parsing", () => {
//   const parsed = parse("Frame13 --foo=bar --ignore-constaints");
//   expect(parsed).toEqual({
//     _order: ["foo", "ignore-constaints"],
//     foo: "bar",
//     "ignore-constaints": true,
//   });
// });
