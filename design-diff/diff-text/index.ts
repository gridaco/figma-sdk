///
/// WIP
///

import { Figma } from "@design-sdk/figma-types";

interface TextDiff {
  fills: Figma.TextNode["fills"];
}

export function text(a: Figma.TextNode, b: Figma.TextNode): TextDiff {
  a.fills === b.fills;

  a.characters === b.characters;
  a.fontName === b.fontName;
  a.fontSize === b.fontSize;
  a.letterSpacing === b.letterSpacing;
  a.lineHeight === b.lineHeight;
  a.textCase === b.textCase;
  a.textDecoration === b.textDecoration;
  a.textStyleId === b.textStyleId;

  return {
    fills: a.fills !== b.fills && b.fills,
  };
}
