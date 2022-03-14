import type { StrokeCap } from "@design-sdk/figma";
import type { VectorBase } from "@design-sdk/figma-remote-types";

/**
 *
 * from : ...
 *
 * to: https://www.figma.com/plugin-docs/api/StrokeCap/
 */
export function convertFigmaRemoteStrokeCapToFigmaStrokeCap(
  remStrokeCap: VectorBase["strokeCap"]
): StrokeCap {
  switch (remStrokeCap) {
    case "NONE":
      return "NONE";
    case "ROUND":
      return "ROUND";
    case "SQUARE":
      return "SQUARE";
    case "LINE_ARROW":
      return "ARROW_LINES";
    case "TRIANGLE_ARROW":
      return "ARROW_EQUILATERAL";
    default:
      return "NONE";
  }
}
