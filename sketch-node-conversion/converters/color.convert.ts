import { Color as SketchColor } from "@design-sdk/sketch-types";
import { Color } from "@reflect-ui/core";

/**
 * converts sketch color to reflect color format
 * @TODO: not tested & we don't know rgba value is f or 255
 * @param color;
 * @returns
 */
export function sketch_color_to_reflect_color(color: SketchColor): Color {
  return {
    r: color.red,
    g: color.green,
    b: color.blue,
    a: color.alpha,
  };
}
