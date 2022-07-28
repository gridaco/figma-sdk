import type { SolidPaint } from "@design-sdk/figma-types";
import type { Color } from "@reflect-ui/core";

export function paintToColor(paint: SolidPaint): Color {
  return (
    paint && {
      r: paint.color.r,
      g: paint.color.g,
      b: paint.color.b,
      a: paint.opacity,
    }
  );
}
