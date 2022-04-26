import type {
  Text,
  Hyperlink,
  TypeStyle,
} from "@design-sdk/figma-remote-types";
import type {
  TextNode,
  HyperlinkTarget,
  StyledTextSegment,
} from "@design-sdk/figma-types";
import {
  figmaRemoteLineHeightToFigma,
  convertFigmaRemoteFillsToFigma,
} from "../converters";
import { MappingTextNode } from "./mapping-instance";
import { blendBaseNode } from "../blenders";

/**
 * @todo not fully implemented
 * @param remText
 * @returns
 */
export function mapFigmaRemoteTextToFigma(remText: Text, parent?): TextNode {
  const mapping: MappingTextNode = {} as any;

  blendBaseNode({
    target: mapping,
    source: remText,
    parent,
  });

  const { characters, style, styleOverrideTable, characterStyleOverrides } =
    remText;

  return <TextNode>{
    ...mapping,

    type: "TEXT",

    // pure text
    hyperlink: mapHyperlink(remText.style.hyperlink),
    textAlignHorizontal: remText.style.textAlignHorizontal,
    textAlignVertical: remText.style.textAlignVertical,
    textAutoResize: mapTextAutoResize(remText.style.textAutoResize),

    characters: characters,

    fontSize: style.fontSize,
    fontName: {
      family: style.fontFamily,
      style: style.fontPostScriptName,
    },
    textDecoration: style.textDecoration,
    textCase: style.textCase,
    letterSpacing: {
      value: style.letterSpacing,
      unit: "PIXELS", // I'm not sure if it's safe to case it to this. haven't tested yet
    },
    lineHeight: figmaRemoteLineHeightToFigma(style),
    paragraphIndent: style.paragraphIndent,
    paragraphSpacing: style.paragraphSpacing,

    characterStyleOverrides: characterStyleOverrides as Array<number>,
    styleOverrideTable: mapOverrideStyleMap({
      table: styleOverrideTable,
    }),
    styledTextSegments: mapStyledTextSegments({
      characters: characters,
      maps: characterStyleOverrides,
    }),

    // static override
    hasMissingFont: false,
    textStyleId: undefined,
    autoRename: false,
  };
}

function mapOverrideTypeStyle({
  style,
}: {
  style: TypeStyle;
}): Omit<
  StyledTextSegment,
  "characters" | "start" | "end" | "listOptions" | "indentation" | "hyperlink"
> {
  return {
    fontSize: style.fontSize,
    fontName: {
      family: style.fontFamily,
      style: style.fontPostScriptName,
    },
    textDecoration: style.textDecoration,
    textCase: style.textCase,
    lineHeight: figmaRemoteLineHeightToFigma(style),
    letterSpacing: {
      value: style.letterSpacing,
      unit: "PIXELS", // I'm not sure if it's safe to case it to this. haven't tested yet
    },
    fills: style.fills && convertFigmaRemoteFillsToFigma(...style.fills),
    textStyleId: null, // static (not available on remote api)
    fillStyleId: null, // static (not available on remote api)
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

function mapStyledTextSegments({}: {
  characters: string;
  maps: readonly number[];
}): ReadonlyArray<StyledTextSegment> {
  // TODO:
  return [];
}

function mapOverrideStyleMap({
  table,
}: {
  table: Text["styleOverrideTable"];
}): TextNode["styleOverrideTable"] {
  return Object.keys(table).reduce((o, k) => {
    return {
      ...o,
      [k]: mapOverrideTypeStyle({
        style: table[k],
      }),
    };
  }, {});
}
