import { parse } from "../parsing-strategy-unique";

test("match simple unique symbol", () => {
  const parsed = parse("//@ignore", ["ignore"]);
  expect(parsed).toBe("ignore");
});

test("match simple unique symbol with '__' prefix", () => {
  const parsed = parse("__//@ignore", ["ignore"]);
  expect(parsed).toBe("ignore");
});

test("don't match simple unique symbol with no empty space between token and name.", () => {
  const parsed = parse("//@ignoreFrame12", ["ignore"]);
  expect(parsed).toBe(false);
});

test("match simple unique symbol with empty space between token and name.", () => {
  const parsed = parse("//@ignore Frame12", ["ignore"]);
  expect(parsed).toBe("ignore");
});

test("match first unique symbol with empty space between token and name.", () => {
  const parsed = parse("//@ignore //@second Frame12", ["ignore", "second"]);
  expect(parsed).toBe("ignore");
});
