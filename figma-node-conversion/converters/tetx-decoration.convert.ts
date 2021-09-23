import type { FigmaTextDecoration } from "@design-sdk/figma-types";
import { TextDecoration } from "@reflect-ui/core";

export function convertTextDecorationToReflect(
  origin: FigmaTextDecoration
): TextDecoration {
  switch (origin) {
    case "NONE":
      return TextDecoration.none;
    case "STRIKETHROUGH":
      return TextDecoration.linethrough;
    case "UNDERLINE":
      return TextDecoration.underline;
    default:
      return TextDecoration.none;
  }
  return;
}
