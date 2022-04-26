////
//// Mapping instance is a class that follows the target interfaces.
//// since we are converting interface to interface, we cannot use functionalities of mixin blending.
//// to make the blending code simpler, we are making this abstract mapping instance for temporary mapping usage
////
import { Figma, FimgaLayoutAlign } from "@design-sdk/figma-types";

export type MappingNode =
  | MappingRectangleNode
  | MappingEllipseNode
  | MappingVectorNode
  | MappingFrameNode
  | MappingInstanceNode
  | MappingComponentNode
  | MappingGroupNode
  | MappingLineNode
  | MappingBooleanOperationNode
  | MappingPolygonNode
  | MAppingStarNode
  | MappingTextNode;

type OmitGeometryMixinMethods = "outlineStroke";
type OmitExportMixinMethods = "exportAsync";
type OmitBaseNodeMixinMethods =
  | "remove"
  | "toString"
  | "getPluginData"
  | "setPluginData"
  | "getSharedPluginData"
  | "setSharedPluginData"
  | "setRelaunchData";
type OmitLayoutMixinMethods = "resize" | "resizeWithoutConstraints" | "rescale";
type OmitChildrenMixinMethods =
  | "appendChild"
  | "insertChild"
  | "findChildren"
  | "findChild"
  | "findAll"
  | "findOne";

/**
 * RectangleNode Mapping
 */
export class MappingRectangleNode
  implements
    Omit<
      Figma.RectangleNode,
      | "clone"
      | OmitLayoutMixinMethods
      | OmitBaseNodeMixinMethods
      | OmitExportMixinMethods
      | OmitGeometryMixinMethods
    >
{
  type: "RECTANGLE";
  id: string;
  parentId: string;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  reactions: readonly Figma.Reaction[];
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  fills: readonly Figma.Paint[] | Figma.PluginAPI["mixed"];
  fillGeometry: Figma.VectorPaths;
  strokes: readonly Figma.Paint[];
  strokeWeight: number;
  strokeMiterLimit: number;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  strokeCap: Figma.PluginAPI["mixed"] | Figma.StrokeCap;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fillStyleId: string | Figma.PluginAPI["mixed"];
  strokeStyleId: string;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: FimgaLayoutAlign;
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  constraints: Figma.Constraints;
  cornerRadius: number | Figma.PluginAPI["mixed"];
  cornerSmoothing: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
}

export class MappingEllipseNode
  implements
    Omit<
      Figma.EllipseNode,
      | "clone"
      | OmitLayoutMixinMethods
      | OmitBaseNodeMixinMethods
      | OmitExportMixinMethods
      | OmitGeometryMixinMethods
    >
{
  vectorPaths; /** OVERRIDE */ // TODO: remove me
  type: "ELLIPSE";
  arcData: Figma.ArcData;
  id: string;
  parentId: string;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  reactions: readonly Figma.Reaction[];
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  fills: Figma.PluginAPI["mixed"] | readonly Figma.Paint[];
  strokes: readonly Figma.Paint[];
  strokeWeight: number;
  strokeMiterLimit: number;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  strokeCap: Figma.PluginAPI["mixed"] | Figma.StrokeCap;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fillStyleId: string | Figma.PluginAPI["mixed"];
  fillGeometry: Figma.VectorPaths;
  strokeStyleId: string;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: FimgaLayoutAlign;
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  constraints: Figma.Constraints;
  cornerRadius: number | Figma.PluginAPI["mixed"];
  cornerSmoothing: number;
}

export class MappingLineNode
  implements
    Omit<
      Figma.LineNode,
      | "clone"
      | OmitLayoutMixinMethods
      | OmitBaseNodeMixinMethods
      | OmitExportMixinMethods
      | OmitGeometryMixinMethods
    >
{
  vectorPaths; /** OVERRIDE */
  type: "LINE";
  id: string;
  parentId: string;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  reactions: readonly Figma.Reaction[];
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  strokeCap: Figma.PluginAPI["mixed"] | Figma.StrokeCap;
  strokeMiterLimit: number;
  strokes: readonly Figma.Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fills: Figma.PluginAPI["mixed"] | readonly Figma.Paint[];
  fillGeometry: Figma.VectorPaths;
  fillStyleId: string | Figma.PluginAPI["mixed"];
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: "STRETCH" | "INHERIT";
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  constraints: Figma.Constraints;
}

export class MappingVectorNode
  implements
    Omit<
      Figma.VectorNode,
      | "clone"
      | OmitLayoutMixinMethods
      | OmitBaseNodeMixinMethods
      | OmitExportMixinMethods
      | OmitGeometryMixinMethods
    >
{
  type: "VECTOR";
  vectorNetwork: Figma.VectorNetwork;
  vectorPaths: Figma.VectorPaths;
  handleMirroring: Figma.PluginAPI["mixed"] | Figma.HandleMirroring;
  id: string;
  parentId: string;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  reactions: readonly Figma.Reaction[];
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  strokeCap: Figma.PluginAPI["mixed"] | Figma.StrokeCap;
  strokeMiterLimit: number;
  strokes: readonly Figma.Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fills: Figma.PluginAPI["mixed"] | readonly Figma.Paint[];
  fillStyleId: string | Figma.PluginAPI["mixed"];
  fillGeometry: Figma.VectorPaths;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: FimgaLayoutAlign;
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  constraints: Figma.Constraints;
  cornerRadius: number | Figma.PluginAPI["mixed"];
  cornerSmoothing: number;
}

type OmitTextSublayerMethods =
  | "insertCharacters"
  | "deleteCharacters"
  | "getRangeFontSize"
  | "setRangeFontSize"
  | "getRangeAllFontNames"
  | "getRangeFontName"
  | "setRangeFontName"
  | "getRangeTextCase"
  | "setRangeTextCase"
  | "getRangeTextDecoration"
  | "setRangeTextDecoration"
  | "getRangeLetterSpacing"
  | "setRangeLetterSpacing"
  | "getRangeLineHeight"
  | "setRangeLineHeight"
  | "getRangeFills"
  | "setRangeFills"
  | "getRangeTextStyleId"
  | "setRangeTextStyleId"
  | "getRangeFillStyleId"
  | "setRangeFillStyleId"
  | "getRangeHyperlink"
  | "setRangeHyperlink"
  | "getRangeListOptions"
  | "setRangeListOptions"
  | "getRangeIndentation"
  | "setRangeIndentation"
  | "getStyledTextSegments";

export type MappingTextNode = Omit<
  Figma.TextNode,
  | "clone"
  | OmitBaseNodeMixinMethods
  | OmitLayoutMixinMethods
  | OmitGeometryMixinMethods
  | OmitExportMixinMethods
  | OmitTextSublayerMethods
>;

export class MappingFrameNode
  implements
    Omit<
      Figma.FrameNode,
      | "clone"
      | OmitBaseNodeMixinMethods
      | OmitLayoutMixinMethods
      | OmitGeometryMixinMethods
      | OmitExportMixinMethods
      | OmitChildrenMixinMethods
    >
{
  type: "FRAME";
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "CENTER" | "MIN" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlignItems: "CENTER" | "MIN" | "MAX";
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  itemSpacing: number;
  layoutGrids: readonly Figma.LayoutGrid[];
  gridStyleId: string;
  clipsContent: boolean;
  guides: readonly Figma.Guide[];
  id: string;
  parentId: string | null;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  children: readonly Figma.SceneNode[];
  expanded: boolean;
  backgrounds: readonly Figma.Paint[];
  backgroundStyleId: string;
  fills: readonly Figma.Paint[] | Figma.PluginAPI["mixed"];
  fillGeometry: Figma.VectorPaths;
  strokes: readonly Figma.Paint[];
  strokeWeight: number;
  strokeMiterLimit: number;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  strokeCap: Figma.PluginAPI["mixed"] | Figma.StrokeCap;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fillStyleId: string | Figma.PluginAPI["mixed"];
  strokeStyleId: string;
  cornerRadius: number | Figma.PluginAPI["mixed"];
  cornerSmoothing: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  constraints: Figma.Constraints;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: FimgaLayoutAlign;
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  overflowDirection: Figma.OverflowDirection;
  numberOfFixedChildren: number;
  overlayPositionType: Figma.OverlayPositionType;
  overlayBackground: Figma.OverlayBackground;
  overlayBackgroundInteraction: Figma.OverlayBackgroundInteraction;
  reactions: readonly Figma.Reaction[];
}

type OmitInsanceNodeMethods =
  | "swapComponent"
  | "setProperties"
  | "detachInstance";

export class MappingInstanceNode
  implements
    Omit<
      Figma.InstanceNode,
      | "clone"
      | OmitBaseNodeMixinMethods
      | OmitLayoutMixinMethods
      | OmitGeometryMixinMethods
      | OmitExportMixinMethods
      | OmitChildrenMixinMethods
      | OmitInsanceNodeMethods
    >
{
  type: "INSTANCE";

  // ---- CUSTOM OVERRIDE ----
  mainComponentId: string;
  // -------------------------

  mainComponent: Figma.ComponentNode;
  scaleFactor: number;
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems: "MIN" | "MAX" | "CENTER";
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  itemSpacing: number;
  layoutGrids: readonly Figma.LayoutGrid[];
  gridStyleId: string;
  clipsContent: boolean;
  guides: readonly Figma.Guide[];
  id: string;
  parentId: string | null;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  children: readonly Figma.SceneNode[];
  expanded: boolean;
  backgrounds: readonly Figma.Paint[];
  backgroundStyleId: string;
  strokeCap: Figma.StrokeCap | Figma.PluginAPI["mixed"];
  strokeMiterLimit: number;
  strokes: readonly Figma.Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fills: readonly Figma.Paint[] | Figma.PluginAPI["mixed"];
  fillStyleId: string | Figma.PluginAPI["mixed"];
  fillGeometry: Figma.VectorPaths;
  cornerRadius: number | Figma.PluginAPI["mixed"];
  cornerSmoothing: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  constraints: Figma.Constraints;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: "STRETCH" | "INHERIT";
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  overflowDirection: Figma.OverflowDirection;
  numberOfFixedChildren: number;
  overlayPositionType: Figma.OverlayPositionType;
  overlayBackground: Figma.OverlayBackground;
  overlayBackgroundInteraction: Figma.OverlayBackgroundInteraction;
  reactions: readonly Figma.Reaction[];
  variantProperties: { [property: string]: string };
}

type OmitComponentNodeMethods = "createInstance";
type OmitPublishableMixinMethods = "getPublishStatusAsync";
export class MappingComponentNode
  implements
    Omit<
      Figma.ComponentNode,
      | "clone"
      | OmitBaseNodeMixinMethods
      | OmitLayoutMixinMethods
      | OmitGeometryMixinMethods
      | OmitExportMixinMethods
      | OmitChildrenMixinMethods
      | OmitComponentNodeMethods
      | OmitPublishableMixinMethods
    >
{
  type: "COMPONENT";
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "CENTER" | "MIN" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlignItems: "CENTER" | "MIN" | "MAX";
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  itemSpacing: number;
  layoutGrids: readonly Figma.LayoutGrid[];
  gridStyleId: string;
  clipsContent: boolean;
  guides: readonly Figma.Guide[];
  id: string;
  parentId: string | null;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  children: readonly Figma.SceneNode[];
  expanded: boolean;
  backgrounds: readonly Figma.Paint[];
  backgroundStyleId: string;
  strokeCap: Figma.PluginAPI["mixed"] | Figma.StrokeCap;
  strokeMiterLimit: number;
  strokes: readonly Figma.Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fills: Figma.PluginAPI["mixed"] | readonly Figma.Paint[];
  fillStyleId: string | Figma.PluginAPI["mixed"];
  fillGeometry: Figma.VectorPaths;
  cornerRadius: number | Figma.PluginAPI["mixed"];
  cornerSmoothing: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  constraints: Figma.Constraints;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: "STRETCH" | "INHERIT";
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  overflowDirection: Figma.OverflowDirection;
  numberOfFixedChildren: number;
  overlayPositionType: Figma.OverlayPositionType;
  overlayBackground: Figma.OverlayBackground;
  overlayBackgroundInteraction: Figma.OverlayBackgroundInteraction;
  reactions: readonly Figma.Reaction[];
  description: string;
  documentationLinks: readonly Figma.DocumentationLink[];
  remote: boolean;
  key: string;
  variantProperties: { [property: string]: string };
}

export class MappingGroupNode
  implements
    Omit<
      Figma.GroupNode,
      | "clone"
      | OmitBaseNodeMixinMethods
      | OmitChildrenMixinMethods
      | OmitLayoutMixinMethods
      | OmitExportMixinMethods
    >
{
  type: "GROUP";
  id: string;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  parentId: string | null;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  reactions: readonly Figma.Reaction[];
  children: readonly Figma.SceneNode[];
  expanded: boolean;
  backgrounds: readonly Figma.Paint[];
  backgroundStyleId: string;
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: FimgaLayoutAlign;
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
}

export class MappingBooleanOperationNode
  implements
    Omit<
      Figma.BooleanOperationNode,
      | "clone"
      | OmitBaseNodeMixinMethods
      | OmitChildrenMixinMethods
      | OmitLayoutMixinMethods
      | OmitExportMixinMethods
      | OmitGeometryMixinMethods
    >
{
  type: "BOOLEAN_OPERATION";

  // --------------------------------------------------
  // this is missing in plugin typings, but explicitly required.
  constraints: Figma.Constraints;
  // --------------------------------------------------

  booleanOperation: "UNION" | "INTERSECT" | "SUBTRACT" | "EXCLUDE";
  expanded: boolean;
  id: string;
  parentId: string | null;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  reactions: readonly Figma.Reaction[];
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  strokeCap: Figma.StrokeCap | Figma.PluginAPI["mixed"];
  strokeMiterLimit: number;
  strokes: readonly Figma.Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fills: readonly Figma.Paint[] | Figma.PluginAPI["mixed"];
  fillStyleId: string | Figma.PluginAPI["mixed"];
  fillGeometry: Figma.VectorPaths;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: "STRETCH" | "INHERIT";
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  children: readonly Figma.SceneNode[];
  cornerRadius: number | Figma.PluginAPI["mixed"];
  cornerSmoothing: number;
}

export class MappingPolygonNode
  implements
    Omit<
      Figma.PolygonNode,
      | "clone"
      | OmitBaseNodeMixinMethods
      | OmitChildrenMixinMethods
      | OmitLayoutMixinMethods
      | OmitExportMixinMethods
      | OmitGeometryMixinMethods
    >
{
  vectorPaths; /** OVERRIDE */
  type: "POLYGON";
  pointCount: number;
  id: string;
  parentId: string | null;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  reactions: readonly Figma.Reaction[];
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  strokeCap: Figma.PluginAPI["mixed"] | Figma.StrokeCap;
  strokeMiterLimit: number;
  strokes: readonly Figma.Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fills: Figma.PluginAPI["mixed"] | readonly Figma.Paint[];
  fillStyleId: string | Figma.PluginAPI["mixed"];
  fillGeometry: Figma.VectorPaths;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: "STRETCH" | "INHERIT";
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  constraints: Figma.Constraints;
  cornerRadius: number | Figma.PluginAPI["mixed"];
  cornerSmoothing: number;
}

export class MAppingStarNode
  implements
    Omit<
      Figma.StarNode,
      | "clone"
      | OmitBaseNodeMixinMethods
      | OmitChildrenMixinMethods
      | OmitLayoutMixinMethods
      | OmitExportMixinMethods
      | OmitGeometryMixinMethods
    >
{
  vectorPaths; /** OVERRIDE */
  type: "STAR";
  pointCount: number;
  innerRadius: number;
  id: string;
  parentId: string | null;
  parent: Figma.BaseNode & Figma.ChildrenMixin;
  name: string;
  removed: boolean;
  visible: boolean;
  locked: boolean;
  reactions: readonly Figma.Reaction[];
  opacity: number;
  blendMode: "PASS_THROUGH" | Figma.BlendMode;
  isMask: boolean;
  effects: readonly Figma.Effect[];
  effectStyleId: string;
  strokeCap: Figma.PluginAPI["mixed"] | Figma.StrokeCap;
  strokeMiterLimit: number;
  strokes: readonly Figma.Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: Figma.PluginAPI["mixed"] | Figma.StrokeJoin;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  dashPattern: readonly number[];
  strokeGeometry: Figma.VectorPaths;
  fills: Figma.PluginAPI["mixed"] | readonly Figma.Paint[];
  fillStyleId: string | Figma.PluginAPI["mixed"];
  fillGeometry: Figma.VectorPaths;
  absoluteTransform: Figma.Transform;
  relativeTransform: Figma.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: "STRETCH" | "INHERIT";
  layoutGrow: number;
  exportSettings: readonly Figma.ExportSettings[];
  constraints: Figma.Constraints;
  cornerRadius: number | Figma.PluginAPI["mixed"];
  cornerSmoothing: number;
}
