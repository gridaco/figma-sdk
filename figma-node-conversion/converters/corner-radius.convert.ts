import { BorderRadiusManifest } from "@reflect-ui/core";
import { mixed } from "@design-sdk/core";
import { FigmaCornerRadius } from "@design-sdk/figma-types";

export function convertFigmaCornerRadiusToBorderRadius(
  origin: FigmaCornerRadius
): BorderRadiusManifest {
  if (origin.cornerRadius == mixed) {
    return {
      tl: origin.topLeftRadius,
      tr: origin.topRightRadius,
      bl: origin.bottomLeftRadius,
      br: origin.bottomRightRadius,
    };
  } else {
    if (
      origin.topLeftRadius == origin.topRightRadius &&
      origin.topLeftRadius == origin.bottomLeftRadius &&
      origin.topLeftRadius == origin.bottomRightRadius
    ) {
      return {
        all: origin.cornerRadius,
      };
    } else {
      return {
        tl: origin.topLeftRadius,
        tr: origin.topRightRadius,
        bl: origin.bottomLeftRadius,
        br: origin.bottomRightRadius,
      };
    }
  }
}
