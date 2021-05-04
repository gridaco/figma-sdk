import { retrieveFill } from "./retrieve-fill";

// FIXME - migrate this
import { SolidPaint, Paint } from "@design-sdk/figma";
import { RGBAF } from "@reflect-ui/core/lib/color";

export function retrievePrimaryColor(fills: ReadonlyArray<Paint>): RGBAF {
  const solid = retrieveFill<SolidPaint>(fills, {
    onlySolid: true,
  });
  return {
    r: solid.color.r,
    g: solid.color.g,
    b: solid.color.b,
    a: solid.opacity,
  };
}
