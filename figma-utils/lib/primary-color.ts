import { retrieveFill } from "./retrieve-fill";
import type { SolidPaint, Paint } from "@design-sdk/figma-types";
import type { RGBAF } from "@reflect-ui/core";

export function retrievePrimaryColor(fills: ReadonlyArray<Paint>): RGBAF {
  const solid = retrieveFill<SolidPaint>(fills, {
    onlySolid: true,
  });
  if (solid) {
    return {
      r: solid.color.r,
      g: solid.color.g,
      b: solid.color.b,
      a: solid.opacity,
    };
  }
}
