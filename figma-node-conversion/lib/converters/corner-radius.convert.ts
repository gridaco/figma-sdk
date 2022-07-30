import { BorderRadiusManifest } from "@reflect-ui/core";
import { FigmaCornerRadius } from "@design-sdk/figma-types";

export function convertFigmaCornerRadiusToBorderRadius(
  origin: FigmaCornerRadius
): BorderRadiusManifest {
  return {
    all:
      origin.topLeftRadius == origin.topRightRadius &&
      origin.topLeftRadius == origin.bottomLeftRadius &&
      origin.topLeftRadius == origin.bottomRightRadius
        ? origin.topLeftRadius
        : undefined,
    tl: origin.topLeftRadius,
    tr: origin.topRightRadius,
    bl: origin.bottomLeftRadius,
    br: origin.bottomRightRadius,
  };
}
