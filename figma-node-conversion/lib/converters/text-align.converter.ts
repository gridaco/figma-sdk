import type {
  FigmaTextHorizontalAligment,
  FigmaTextVerticalAligment,
} from "@design-sdk/figma-types";
import { TextAlignVertical, TextAlign } from "@reflect-ui/core";

export function convertTextAlignHorizontalToReflect(
  origin: FigmaTextHorizontalAligment
): TextAlign {
  switch (origin) {
    case "CENTER":
      return TextAlign.center;
    case "JUSTIFIED":
      return TextAlign.justify;
    case "LEFT":
      return TextAlign.left;
    case "RIGHT":
      return TextAlign.right;
    case undefined:
      return TextAlign.left;
    default:
      return TextAlign.left;
  }
  throw `cannot convert figma text horizontal align value "${origin}" to reflect "TextAlign"`;
}

export function convertTextAlignVerticalToReflect(
  origin: FigmaTextVerticalAligment
): TextAlignVertical {
  switch (origin) {
    case "CENTER":
      return TextAlignVertical.center;
    case "TOP":
      return TextAlignVertical.start;
    case "BOTTOM":
      return TextAlignVertical.bottom;
    case undefined:
      return TextAlignVertical.start;
    default:
      return TextAlignVertical.start;
  }
  throw `cannot convert figma text vertical align value "${origin}" to reflect "TextAlignVertical"`;
}
