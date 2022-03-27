import type { Text, Hyperlink } from "@design-sdk/figma-remote-types";
import type { TextNode, HyperlinkTarget } from "@design-sdk/figma-types";
import {
  _FILL_INTERFACE_METHODS,
  __FIND_PARENT_REFERENCE,
  __TO_STRING__CALL,
} from "./_utils";
import { figmaRemoteLineHeightToFigma } from "../converters/line-height.convert";
import { MappingTextNode } from "./mapping-instance";
import { blendBaseNode } from "../blenders/general.blend";

/**
 * @todo not fully implemented
 * @param remText
 * @returns
 */
export function mapFigmaRemoteTextToFigma(remText: Text, parent?): TextNode {
  const mapping = new MappingTextNode();
  blendBaseNode({
    target: mapping,
    source: remText,
    parent,
  });

  return {
    ...mapping,

    type: "TEXT",

    // pure text
    hyperlink: mapHyperlink(remText.style.hyperlink),
    textAlignHorizontal: remText.style.textAlignHorizontal,
    textAlignVertical: remText.style.textAlignVertical,
    textAutoResize: mapTextAutoResize(remText.style.textAutoResize),
    paragraphIndent: remText.style.paragraphIndent,
    paragraphSpacing: remText.style.paragraphSpacing,
    fontSize: remText.style.fontSize,
    fontName: {
      family: remText.style.fontFamily,
      style: remText.style.fontPostScriptName,
    },
    textCase: remText.style.textCase,
    textDecoration: remText.style.textDecoration,

    letterSpacing: {
      value: remText.style.letterSpacing,
      unit: "PIXELS", // I'm not sure if it's safe to case it to this. haven't tested yet
    },
    lineHeight: figmaRemoteLineHeightToFigma(remText.style),
    characters: remText.characters,

    // static override
    hasMissingFont: false,
    textStyleId: undefined,
    autoRename: false,

    //
    toString: __TO_STRING__CALL(remText.id, remText.name),
    remove: _FILL_INTERFACE_METHODS,
    getPluginData: _FILL_INTERFACE_METHODS,
    setPluginData: _FILL_INTERFACE_METHODS,
    getSharedPluginData: _FILL_INTERFACE_METHODS,
    setSharedPluginData: _FILL_INTERFACE_METHODS,
    setRelaunchData: _FILL_INTERFACE_METHODS,
    resize: _FILL_INTERFACE_METHODS,
    rescale: _FILL_INTERFACE_METHODS,
    resizeWithoutConstraints: _FILL_INTERFACE_METHODS,
    exportAsync: _FILL_INTERFACE_METHODS, // TODO - support this with remote api
    outlineStroke: _FILL_INTERFACE_METHODS,

    //
    clone: _FILL_INTERFACE_METHODS,
    insertCharacters: _FILL_INTERFACE_METHODS,
    deleteCharacters: _FILL_INTERFACE_METHODS,
    getRangeAllFontNames: _FILL_INTERFACE_METHODS,
    getRangeFontSize: _FILL_INTERFACE_METHODS,
    setRangeFontSize: _FILL_INTERFACE_METHODS,
    getRangeFontName: _FILL_INTERFACE_METHODS,
    setRangeFontName: _FILL_INTERFACE_METHODS,
    getRangeTextCase: _FILL_INTERFACE_METHODS,
    setRangeTextCase: _FILL_INTERFACE_METHODS,
    getRangeTextDecoration: _FILL_INTERFACE_METHODS,
    setRangeTextDecoration: _FILL_INTERFACE_METHODS,
    getRangeLetterSpacing: _FILL_INTERFACE_METHODS,
    setRangeLetterSpacing: _FILL_INTERFACE_METHODS,
    getRangeLineHeight: _FILL_INTERFACE_METHODS,
    setRangeLineHeight: _FILL_INTERFACE_METHODS,
    getRangeFills: _FILL_INTERFACE_METHODS,
    setRangeFills: _FILL_INTERFACE_METHODS,
    getRangeTextStyleId: _FILL_INTERFACE_METHODS,
    setRangeTextStyleId: _FILL_INTERFACE_METHODS,
    getRangeFillStyleId: _FILL_INTERFACE_METHODS,
    setRangeFillStyleId: _FILL_INTERFACE_METHODS,

    getRangeHyperlink: _FILL_INTERFACE_METHODS,
    setRangeHyperlink: _FILL_INTERFACE_METHODS,
    setRangeIndentation: _FILL_INTERFACE_METHODS,
    getRangeIndentation: _FILL_INTERFACE_METHODS,
    getRangeListOptions: _FILL_INTERFACE_METHODS,
    setRangeListOptions: _FILL_INTERFACE_METHODS,
  };
}

function mapTextAutoResize(
  tar: Text["style"]["textAutoResize"]
): "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT" {
  switch (tar) {
    case "HEIGHT":
      return "HEIGHT";
    case "WIDTH_AND_HEIGHT":
      return "WIDTH_AND_HEIGHT";
    case undefined:
    default:
      return "NONE";
  }
}

function mapHyperlink(link?: Hyperlink): HyperlinkTarget {
  if (!link) {
    return;
  }

  switch (link.type) {
    case "URL":
      return {
        type: "URL",
        value: link.url,
      };
    case "NODE":
      return {
        type: "NODE",
        value: link.nodeID,
      };
  }
}
