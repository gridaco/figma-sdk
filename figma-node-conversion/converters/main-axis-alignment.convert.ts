import type { FigmaMainAxisAlignment } from "@design-sdk/figma-types";
import { MainAxisAlignment } from "@reflect-ui/core";

export function convertPrimaryAxisAlignItemsToMainAxisAlignment(
  origin: FigmaMainAxisAlignment
): MainAxisAlignment {
  switch (origin) {
    case "CENTER":
      return MainAxisAlignment.center;
    case "MAX":
      return MainAxisAlignment.end;
    case "MIN":
      return MainAxisAlignment.start;
    case "SPACE_BETWEEN":
      return MainAxisAlignment.spaceBetween;
  }
}
