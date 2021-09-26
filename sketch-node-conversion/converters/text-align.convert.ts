import { TextHorizontalAlignment } from "@design-sdk/sketch-types";
import { TextAlign } from "@reflect-ui/core";
export function convertSketchTextAligntmentToReflectTextAlignment(
  sketch: TextHorizontalAlignment
): TextAlign {
  if (sketch === undefined) {
    return TextAlign.start;
  }

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
