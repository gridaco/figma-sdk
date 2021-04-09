import { BorderRadiusManifest } from "@reflect-ui/core/lib/ui/border-radius";
import { mixed } from "../../nodes";
import { FigmaCornerRadius } from "../types/corner-radius";

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
    return {
      all: origin.cornerRadius,
    };
  }
}
