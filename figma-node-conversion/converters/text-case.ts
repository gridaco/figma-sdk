import type { TextCase as FigmaTextCase } from "@design-sdk/figma-types";
import { TextTransform } from "@reflect-ui/core";

export function convertTextCaseToReflectTextTransform(
  origin: FigmaTextCase
): TextTransform {
  switch (origin) {
    case "LOWER":
      return TextTransform.lowercase;
    case "UPPER":
      return TextTransform.uppercase;
    case "TITLE":
      return TextTransform.capitalize;
    case "ORIGINAL":
      return TextTransform.none;
    default:
      return TextTransform.none;
  }
}
