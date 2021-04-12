import { TextHorizontalAlignment } from "../types/v3";
import { TextAlign } from "@reflect-ui/core";
export function convertSketchTextAligntmentToReflectTextAlignment(
  sketch: TextHorizontalAlignment
): TextAlign {
  switch (sketch) {
    case TextHorizontalAlignment.Centered:
      return TextAlign.center;
    case TextHorizontalAlignment.Justified:
      return TextAlign.justify;
    case TextHorizontalAlignment.Left:
      return TextAlign.left;
    case TextHorizontalAlignment.Natural:
      return TextAlign.start;
    case TextHorizontalAlignment.Right:
      return TextAlign.right;
  }
  throw `${sketch} is not supported for reflect conversion`;
}
