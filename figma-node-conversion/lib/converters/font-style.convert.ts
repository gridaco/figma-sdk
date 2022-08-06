import { FontStyle } from "@reflect-ui/core";
import { FontName } from "@design-sdk/figma-types";
export function convertFontStyleToReflect(
  original: FontName
): FontStyle | undefined {
  if (!original) {
    return;
  }

  // itallic
  if (original && original.style?.toLowerCase().match("italic")) {
    return FontStyle.italic;
  }

  return FontStyle.normal;
}
