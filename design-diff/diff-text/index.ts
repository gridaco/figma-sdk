///
/// WIP
///

import { Figma } from "@design-sdk/figma-types";
import { text_data } from "../diff-text-data";

interface TextDiff {
  fills: Figma.TextNode["fills"];
  characters: Diff<Figma.TextNode["characters"]>;
}

interface Diff<O> {
  a: O;
  b: O;
  diff: boolean;
}

export function text(a: Figma.TextNode, b: Figma.TextNode): TextDiff {
  if (a.fills !== Figma.figma.mixed && b.fills !== Figma.figma.mixed) {
    equals(a.fills, b.fills);
  }
  a.fontName === b.fontName;
  a.fontSize === b.fontSize;
  a.letterSpacing === b.letterSpacing;
  a.lineHeight === b.lineHeight;
  a.textCase === b.textCase;
  a.textDecoration === b.textDecoration;
  a.textStyleId === b.textStyleId;

  return {
    fills: a.fills !== b.fills && b.fills,
    characters: {
      a: a.characters,
      b: b.characters,
      diff: text_data(a.characters, b.characters),
    },
  };
}

/**
 * if nested or non neseted array is equal.
 * @param a
 * @param b
 * @returns
 */
function equals(a: readonly any[], b: readonly any[]) {
  // if the other array is a falsy value, return
  if (!b) return false;

  // compare lengths - can save a lot of time
  if (a.length != b.length) return false;

  for (var i = 0, l = a.length; i < l; i++) {
    // Check if we have nested arrays
    if (a[i] instanceof Array && b[i] instanceof Array) {
      // recurse into the nested arrays
      if (!equals(a[i], b[i])) return false;
    } else if (a[i] != b[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}
