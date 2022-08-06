import type { ReflectTextNode } from "@design-sdk/figma-node";
import { FontWeight, TextStyleManifest } from "@reflect-ui/core";
import { convertFontStyleToReflect } from "./font-style.convert";
import { inferFontWeight } from "@reflect-ui/font-utils";
import { convertLetterSpacingToReflect } from "./letter-spacing.convert";
import { figma_lineheight_to_reflect_ling_height } from "./line-height.convert";
import { convertTextDecorationToReflect } from "./tetx-decoration.convert";
import { TextStyle, TextNode, LetterSpacing } from "@design-sdk/figma-types";

type FontWeightNum = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export function convertTextStyleToReflect(
  origin: TextStyle,
  node?: TextNode
): TextStyleManifest {
  return {
    name: origin.name,
    fontFamily: origin.fontName.family,
    fontWeight: inferFontWeight(origin.fontName.style),
    fontStyle: convertFontStyleToReflect(origin.fontName),
    fontSize: origin.fontSize,
    wordSpacing: undefined, // non-figma property
    decoration: convertTextDecorationToReflect(origin.textDecoration),
    decorationStyle: undefined,
    decorationThickness: undefined,
    // TODO: fixme
    // @ts-ignore
    letterSpacing: convertLetterSpacingToReflect(
      origin.letterSpacing as LetterSpacing
    ),
    lineHeight: figma_lineheight_to_reflect_ling_height(origin.lineHeight),
    color: undefined, // non-figma property (figma does not contain color to text style)
  };
}

export function extractTextStyleFromTextNode(
  origin: ReflectTextNode,
  options?: {
    /**
     * fontweight might be available from Figma#TextNode if the data is from rest api. See `TextNode#fontWeight`.
     */
    __restapi_ver_fontWeight: FontWeightNum;
  }
): TextStyleManifest {
  const { fontName, fontSize, textDecoration } = origin;
  let _fontFamily = fontName?.family;
  let _fontWeight = options?.__restapi_ver_fontWeight
    ? _map_font_weight_only_available_on_figma_rest_api_ver(
        options.__restapi_ver_fontWeight!
      )
    : inferFontWeight(fontName?.style);

  if (!fontName) {
    // TODO: describe when this could happen (maybe figma bug?)
    // TODO: add warning system.
    // console.warn("this might be a bug (or by multiple textstyle). no fontName was found in text node. the text node was", origin);
    // console.info('since no fontName was provided, falling back to "Roboto Regular"');

    _fontFamily = _fontFamily ?? "Roboto";
    _fontWeight = _fontWeight ?? FontWeight.normal;
  }

  return {
    name: undefined,
    fontFamily: _fontFamily,
    fontWeight: _fontWeight,
    fontStyle: convertFontStyleToReflect(fontName),
    fontSize: fontSize,
    wordSpacing: undefined, // non-figma property
    decoration: textDecoration,
    decorationStyle: undefined,
    decorationThickness: undefined,
    // TODO: fixme
    letterSpacing: convertLetterSpacingToReflect(
      origin.letterSpacing as LetterSpacing
    ),
    lineHeight: origin.lineHeight,
    color: origin.primaryColor,
    // @ts-ignore -- this does not take much memory, including this for debugging purpose.
    __fontName: fontName,
  };
}

function _map_font_weight_only_available_on_figma_rest_api_ver(
  fontWeight: FontWeightNum
) {
  switch (fontWeight) {
    case 100:
      return FontWeight.w100;
    case 200:
      return FontWeight.w200;
    case 300:
      return FontWeight.w300;
    case 400:
      return FontWeight.w400;
    case 500:
      return FontWeight.w500;
    case 600:
      return FontWeight.w600;
    case 700:
      return FontWeight.w700;
    case 800:
      return FontWeight.w800;
    case 900:
      return FontWeight.w900;
    case null:
    case undefined:
      return undefined;
    default:
      return FontWeight.normal;
  }
}
