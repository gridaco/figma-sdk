import { TextAlignVertical, TextAlign } from "@reflect-ui/core/lib";

export type FigmaTextHorizontalAligment =
  | "LEFT"
  | "CENTER"
  | "RIGHT"
  | "JUSTIFIED";
export type FigmaTextVerticalAligment = "TOP" | "CENTER" | "BOTTOM";

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
  }
  throw `cannot convert figma text horizontal align value ${origin} to reflect TextAlign`;
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
  }
  throw `cannot convert figma text horizontal align value ${origin} to reflect TextAlign`;
}
