import { TextStyleManifest } from "@reflect-ui/core/lib";
import { convertFontStyleToReflect } from "./font-style.convert";
import { convertFontWeightToReflect } from "./font-weight.convert";
import { convertLetterSpacingToReflect } from "./letter-spacing.convert";
import { convertLineHeightToReflect } from "./line-height.convert";
import { convertTextDecorationToReflect } from "./tetx-decoration.convert";
import {
  TextStyle,
  TextNode,
  FontName,
  LetterSpacing,
  LineHeight,
} from "../types/v1";
import { ReflectTextNode } from "../../nodes/types/text.node";

export function convertTextStyleToReflect(
  origin: TextStyle,
  node?: TextNode
): TextStyleManifest {
  return {
    name: origin.name,
    fontFamily: origin.fontName.family,
    fontWeight: convertFontWeightToReflect(origin.fontName.style),
    fontStyle: convertFontStyleToReflect(origin.fontName),
    fontSize: origin.fontSize,
    wordSpacing: undefined, // non-figma property
    decoration: convertTextDecorationToReflect(origin.textDecoration),
    decorationStyle: undefined,
    decorationThickness: undefined,
    letterSpacing: convertLetterSpacingToReflect(origin.letterSpacing, node),
    lineHeight: convertLineHeightToReflect(origin.lineHeight),
    color: undefined, // non-figma property (figma does not contain color to text style)
  };
}

export function extractTextStyleFromTextNode(origin: ReflectTextNode) {
  return {
    name: undefined,
    fontFamily: (origin.fontName as FontName).family,
    fontWeight: convertFontWeightToReflect((origin.fontName as FontName).style),
    fontStyle: convertFontStyleToReflect(origin.fontName as FontName),
    fontSize: origin.fontSize,
    wordSpacing: undefined, // non-figma property
    decoration: convertTextDecorationToReflect(this.textDecoration),
    decorationStyle: undefined,
    decorationThickness: undefined,
    letterSpacing: convertLetterSpacingToReflect(
      origin.letterSpacing as LetterSpacing
    ),
    lineHeight: convertLineHeightToReflect(origin.lineHeight as LineHeight),
    color: origin.primaryColor,
  };
}
