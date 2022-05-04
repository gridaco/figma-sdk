import type {
  Text,
  Hyperlink,
  TypeStyle,
  Paint,
} from "@design-sdk/figma-remote-types";
import type {
  TextNode,
  HyperlinkTarget,
  StyledTextSegment,
  LetterSpacing,
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

  const {
    characters,
    style,
    styleOverrideTable,
    characterStyleOverrides,
    fills,
  } = remText;

  const table = mapOverrideStyleMap({
    table: styleOverrideTable,
  });

  const segments = mapStyledTextSegments({
    style: mapOverrideTypeStyle({
      style,
      overrideFills: fills,
    }) as StyledTextSegment,
    table: table,
    characters: characters,
    overrides: characterStyleOverrides,
  });

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
    letterSpacing: mapLetterSpacing(style),
    lineHeight: figmaRemoteLineHeightToFigma(style),
    paragraphIndent: style.paragraphIndent,
    paragraphSpacing: style.paragraphSpacing,

    characterStyleOverrides: characterStyleOverrides as Array<number>,
    styleOverrideTable: table,
    styledTextSegments: segments,

    // static override
    hasMissingFont: false,
    textStyleId: undefined,
    autoRename: false,
  };
}

function mapOverrideTypeStyle({
  style,
  overrideFills,
}: {
  style: TypeStyle;
  overrideFills?: readonly Paint[];
}): Omit<
  StyledTextSegment,
  "characters" | "start" | "end" | "listOptions" | "indentation" | "hyperlink"
> {
  const _target_fills = style.fills ?? overrideFills;

  // do not provide default value since this represents a override data.
  return {
    fontSize: style.fontSize,
    fontName: {
      family: style.fontFamily,
      style: style.fontPostScriptName,
    },
    textDecoration: style.textDecoration,
    textCase: style.textCase,
    lineHeight: figmaRemoteLineHeightToFigma(style),
    letterSpacing: mapLetterSpacing(style),
    fills: _target_fills && convertFigmaRemoteFillsToFigma(..._target_fills),
    textStyleId: undefined, // static (not available on remote api)
    fillStyleId: undefined, // static (not available on remote api)
  };
}

function mapLetterSpacing({
  letterSpacing,
}: {
  letterSpacing: number;
}): LetterSpacing {
  return {
    value: letterSpacing,
    unit: "PIXELS", // I'm not sure if it's safe to case it to this. haven't tested yet
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

/**
 * creates an array containing flattened, segmented text style data by different text styles.
 * @param characters the full text
 * @param style the default style - 0's style
 * @param overrides the character style overrides referencing a style in a style override table. e.g. [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0]
 * @returns
 */
function mapStyledTextSegments({
  characters,
  overrides,
  table,
  style,
}: {
  style: StyledTextSegment;
  table: { [k: number]: StyledTextSegment };
  characters: string;
  overrides: readonly number[];
}): ReadonlyArray<StyledTextSegment> {
  // chunk the overrides into segments and loop through them (group the sequence with same values).
  // e.g. [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0] -> [{key: 0, start: 0, end: 3}, {key: 1, start: 4, end: 7}, {key: 2, start: 8, end: 11}, {key: 0, start: 12, end: 14}]

  let result = [];
  // after below reduce, the result will look like - [[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2], [0, 0, 0]]
  overrides.reduce(function (r, a) {
    if (a !== r) {
      result.push([]);
    }
    result[result.length - 1].push(a);
    return a;
  }, undefined);

  // after below reduce, the result will look like - [{key: 0, start: 0, end: 3}, {key: 1, start: 4, end: 7}, {key: 2, start: 8, end: 11}, {key: 0, start: 12, end: 14}]
  let c = 0;
  result = result.map((v, i) => {
    const start = c;
    c += v.length;
    const end = c;
    return {
      key: v[0],
      start: start,
      end: end,
    };
  });

  table[0] = style; // inject the default style

  // map each segment to a style
  return result.map((segment) => {
    return {
      key: segment.key,
      start: segment.start,
      end: segment.end,
      characters: characters.slice(segment.start, segment.end),
      ...table[segment.key],
    } as StyledTextSegment;
  });
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
