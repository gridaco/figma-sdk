///
/// WIP
///

import { Figma } from "@design-sdk/figma-types";
import { fills, FillsDiff } from "../diff-fills";
import { text_data } from "../diff-text-data";
import type { IDiff } from "../_types";
import assert from "assert";

export interface TextDiff {
  type: "text-node";
  ids: [string, string];
  fills: IDiff<Figma.TextNode["fills"]>;
  characters: IDiff<Figma.TextNode["characters"]>;
  /**
   * rather this TextDiff contains a diffing property
   */
  diff: boolean;
}

export function text(a: Figma.TextNode, b: Figma.TextNode): TextDiff {
  assert(a.type == "TEXT", `a.type is not "TEXT" - ${a.type}`);
  assert(b.type == "TEXT", `b.type is not "TEXT" - ${b.type}`);
  let _fills: FillsDiff;
  // -- temporarily disabled -- : fill not ready to use. TODO:
  _fills = {
    type: "fills",
    diff: false,
    values: [a.fills as any, b.fills as any],
  };
  // if (Array.isArray(a.fills) && Array.isArray(b.fills)) {
  //   _fills = fills(a.fills, b.fills);
  // }

  a.fontName === b.fontName;
  a.fontSize === b.fontSize;
  a.letterSpacing === b.letterSpacing;
  a.lineHeight === b.lineHeight;
  a.textCase === b.textCase;
  a.textDecoration === b.textDecoration;
  a.textStyleId === b.textStyleId;

  // TODO: this is for preventing 'characters' being undefined when text node is already converted into ReflectTextNode.
  // this may break the logic when the property name is changed.
  const a_text_data = a.characters ?? a["data"];
  const b_text_data = b.characters ?? b["data"];
  const _caracters = text_data(a_text_data, b_text_data);
  return {
    type: "text-node",
    ids: [a.id, b.id],
    fills: _fills as any,
    characters: {
      values: [a_text_data, b_text_data],
      diff: _caracters,
    },
    diff: _fills?.diff || _caracters,
  };
}
