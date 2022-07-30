import type { LineHeight } from "@design-sdk/figma-types";

export function figma_lineheight_to_reflect_ling_height(
  origin: LineHeight
): number | `${number}%` {
  switch (origin?.unit) {
    case "PIXELS":
      return origin.value;
    case "AUTO":
      // auto means non specified.
      return undefined;
    case "PERCENT":
      return `${origin.value}%`;
    case undefined:
      return;
    default:
      throw new Error(`Unknown line height unit: ${origin["unit"]}`);
  }
}

export function figma_lineheight_to_reflect_ling_height__px_only(
  origin: LineHeight
): number {
  const maybepx = figma_lineheight_to_reflect_ling_height(origin);
  if (typeof maybepx === "number") {
    return maybepx;
  }
  return undefined;
}
