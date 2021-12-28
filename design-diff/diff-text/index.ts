///
/// WIP
///

import { Figma } from "@design-sdk/figma-types";
import { fills } from "../diff-fills";
import { text_data } from "../diff-text-data";

export interface TextDiff {
  type: "text-node";
  ids: [string, string];
  fills: Diff<Figma.TextNode["fills"]>;
  characters: Diff<Figma.TextNode["characters"]>;
  /**
   * rather this TextDiff contains a diffing property
   */
  diff: boolean;
}

interface Diff<O> {
  diff: boolean;
  /**
   * - `[0]` - origin value
   * - `[1]` - new value (with diff)
   */
  values: [O, O];
}

export function text(a: Figma.TextNode, b: Figma.TextNode): TextDiff {
  let _fills;
  if (Array.isArray(a.fills) && Array.isArray(b.fills)) {
    _fills = fills(a.fills, b.fills);
  }

  a.fontName === b.fontName;
  a.fontSize === b.fontSize;
  a.letterSpacing === b.letterSpacing;
  a.lineHeight === b.lineHeight;
  a.textCase === b.textCase;
  a.textDecoration === b.textDecoration;
  a.textStyleId === b.textStyleId;

  const _caracters = text_data(a.characters, b.characters);
  return {
    type: "text-node",
    ids: [a.id, b.id],
    fills: _fills,
    characters: {
      values: [a.characters, b.characters],
      diff: _caracters,
    },
    diff: _fills.diff || _caracters,
  };
}
