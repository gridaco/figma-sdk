import { Text } from "../types";
import { TextNode } from "../../figma/types/v1";
import {
  _FILL_INTERFACE_METHODS,
  __FIND_PARENT_REFERENCE,
  __TO_STRING__CALL,
} from "./_utils";
import { convertFigmaRemoteLayoutConstraintsToFigmaConstraints } from "../converters/layout-constraints.convert";
import { convertFigmaRemoteEffectsToFigma } from "../converters/effect.convert";
import { convertFigmaRemoteFillsToFigma } from "../converters/fills.convert";
import { convertFigmaRemoteStrokesToFigma } from "../converters/strokes.convert";
import { figmaRemoteLineHeightToFigma } from "../converters/line-height.convert";

/**
 * @todo not fully implemented
 * @param remText
 * @returns
 */
export function mapFigmaRemoteTextToFigma(remText: Text): TextNode {
  const _constraints = convertFigmaRemoteLayoutConstraintsToFigmaConstraints(
    remText.constraints
  );

  const _effects = convertFigmaRemoteEffectsToFigma(...remText.effects);
  const _fills = convertFigmaRemoteFillsToFigma(...remText.fills);
  const _strokes = convertFigmaRemoteStrokesToFigma(...remText.strokes);
  const _transform = remText.relativeTransform as [
    [number, number, number],
    [number, number, number]
  ];

  return {
    type: "TEXT",

    // BaseNodeMixin
    id: remText.id,
    name: remText.name,
    x: remText.absoluteBoundingBox.x,
    y: remText.absoluteBoundingBox.y,
    width: remText.absoluteBoundingBox.width,
    height: remText.absoluteBoundingBox.height,

    visible: remText.visible,
    layoutAlign: remText.layoutAlign,

    opacity: remText.opacity,
    exportSettings: remText.exportSettings,
    blendMode: remText.blendMode,
    relativeTransform: _transform,
    effects: _effects,
    isMask: remText.isMask,
    fills: _fills,
    strokes: _strokes,
    strokeWeight: remText.strokeWeight,
    strokeAlign: remText.strokeAlign,

    // constraints
    constraints: _constraints,

    // pure text
    textAlignHorizontal: remText.style.textAlignHorizontal,
    textAlignVertical: remText.style.textAlignVertical,
    textAutoResize: remText.style.textAutoResize,
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
    lineHeight: figmaRemoteLineHeightToFigma({
      px: remText.style.lineHeightPx,
      unit: remText.style.lineHeightUnit,
      percent: remText.style.lineHeightPercent,
      percentFontSize: remText.style.lineHeightPercentFontSize,
    }),
    characters: remText.characters,

    // static override
    hasMissingFont: false,
    textStyleId: undefined,
    effectStyleId: undefined,
    strokeStyleId: undefined,
    fillStyleId: undefined,
    autoRename: false,
    removed: false,
    locked: undefined,
    parent: undefined,
    strokeCap: undefined,
    strokeMiterLimit: undefined,
    strokeJoin: undefined,
    dashPattern: undefined,
    outlineStroke: undefined,
    constrainProportions: undefined,
    layoutGrow: undefined,

    // TODO
    reactions: undefined,
    rotation: 0, // calculate with transform
    absoluteTransform: undefined, // calculate with transform

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

    //
    clone: _FILL_INTERFACE_METHODS,
    insertCharacters: _FILL_INTERFACE_METHODS,
    deleteCharacters: _FILL_INTERFACE_METHODS,
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
  };
}
