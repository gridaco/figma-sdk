import { FontStyle } from "@reflect-ui/core";
import { FontName } from "../../figma/types/v1";
export function convertFontStyleToReflect(
  original: FontName
): FontStyle | undefined {
  if (!original) {
    return;
  }

  let fontStyle: FontStyle;
  if (original && original.style.toLowerCase().match("italic")) {
    fontStyle = FontStyle.italic;
  }
  return fontStyle;
}
