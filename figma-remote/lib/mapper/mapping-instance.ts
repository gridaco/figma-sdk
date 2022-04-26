import type {
  BaseNodeMixin,
  Figma,
  FimgaLayoutAlign,
  LayoutMixin,
} from "@design-sdk/figma-types";

////
//// Mapping instance is a class that follows the target interfaces.
//// since we are converting interface to interface, we cannot use functionalities of mixin blending.
//// to make the blending code simpler, we are making this abstract mapping instance for temporary mapping usage
////

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

type MutableOverrideOfBaseNodeMixin<T extends BaseNodeMixin> = T &
  Omit<T, "id" | "parent" | "parentId" | "removed"> & {
    id: BaseNodeMixin["id"];
    parent: BaseNodeMixin["parent"];
    parentId: BaseNodeMixin["parentId"];
    removed: BaseNodeMixin["removed"];
  };

type MutableOverrideOfLayoutMixin<T extends LayoutMixin> = T &
  Omit<LayoutMixin, "absoluteTransform" | "width" | "height"> & {
    absoluteTransform: LayoutMixin["absoluteTransform"];
    width: LayoutMixin["width"];
    height: LayoutMixin["height"];
  };

/**
 * RectangleNode Mapping
 */
export type MappingRectangleNode = Omit<
  MutableOverrideOfBaseNodeMixin<
    MutableOverrideOfLayoutMixin<Figma.RectangleNode>
  >,
  | "clone"
  | OmitLayoutMixinMethods
  | OmitBaseNodeMixinMethods
  | OmitExportMixinMethods
  | OmitGeometryMixinMethods
>;

export type MappingEllipseNode = Omit<
  MutableOverrideOfBaseNodeMixin<
    MutableOverrideOfLayoutMixin<Figma.EllipseNode>
  >,
  | "clone"
  | OmitLayoutMixinMethods
  | OmitBaseNodeMixinMethods
  | OmitExportMixinMethods
  | OmitGeometryMixinMethods
> & {
  vectorPaths /** OVERRIDE */; // TODO: remove me
};

export type MappingLineNode = Omit<
  MutableOverrideOfBaseNodeMixin<MutableOverrideOfLayoutMixin<Figma.LineNode>>,
  | "clone"
  | OmitLayoutMixinMethods
  | OmitBaseNodeMixinMethods
  | OmitExportMixinMethods
  | OmitGeometryMixinMethods
> & {
  vectorPaths /** OVERRIDE */;
};

export type MappingVectorNode = Omit<
  MutableOverrideOfBaseNodeMixin<
    MutableOverrideOfLayoutMixin<Figma.VectorNode>
  >,
  | "clone"
  | OmitLayoutMixinMethods
  | OmitBaseNodeMixinMethods
  | OmitExportMixinMethods
  | OmitGeometryMixinMethods
>;

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
  MutableOverrideOfBaseNodeMixin<MutableOverrideOfLayoutMixin<Figma.TextNode>>,
  | "clone"
  | OmitBaseNodeMixinMethods
  | OmitLayoutMixinMethods
  | OmitGeometryMixinMethods
  | OmitExportMixinMethods
  | OmitTextSublayerMethods
>;

export type MappingFrameNode = Omit<
  MutableOverrideOfBaseNodeMixin<MutableOverrideOfLayoutMixin<Figma.FrameNode>>,
  | "clone"
  | OmitBaseNodeMixinMethods
  | OmitLayoutMixinMethods
  | OmitGeometryMixinMethods
  | OmitExportMixinMethods
  | OmitChildrenMixinMethods
>;

type OmitInsanceNodeMethods =
  | "swapComponent"
  | "setProperties"
  | "detachInstance";

export type MappingInstanceNode = Omit<
  MutableOverrideOfBaseNodeMixin<
    MutableOverrideOfLayoutMixin<Figma.InstanceNode>
  >,
  | "clone"
  | OmitBaseNodeMixinMethods
  | OmitLayoutMixinMethods
  | OmitGeometryMixinMethods
  | OmitExportMixinMethods
  | OmitChildrenMixinMethods
  | OmitInsanceNodeMethods
> & {
  // ---- CUSTOM OVERRIDE ----
  mainComponentId: string;
  // -------------------------
};

type OmitComponentNodeMethods = "createInstance";
type OmitPublishableMixinMethods = "getPublishStatusAsync";

export type MappingComponentNode = Omit<
  MutableOverrideOfBaseNodeMixin<
    MutableOverrideOfLayoutMixin<Figma.ComponentNode>
  >,
  | "clone"
  | OmitBaseNodeMixinMethods
  | OmitLayoutMixinMethods
  | OmitGeometryMixinMethods
  | OmitExportMixinMethods
  | OmitChildrenMixinMethods
  | OmitComponentNodeMethods
  | OmitPublishableMixinMethods
>;

export type MappingGroupNode = Omit<
  MutableOverrideOfBaseNodeMixin<MutableOverrideOfLayoutMixin<Figma.GroupNode>>,
  | "clone"
  | OmitBaseNodeMixinMethods
  | OmitChildrenMixinMethods
  | OmitLayoutMixinMethods
  | OmitExportMixinMethods
>;

export type MappingBooleanOperationNode = Omit<
  MutableOverrideOfBaseNodeMixin<
    MutableOverrideOfLayoutMixin<Figma.BooleanOperationNode>
  >,
  | "clone"
  | OmitBaseNodeMixinMethods
  | OmitChildrenMixinMethods
  | OmitLayoutMixinMethods
  | OmitExportMixinMethods
  | OmitGeometryMixinMethods
> & {
  // --------------------------------------------------
  // this is missing in plugin typings, but explicitly required.
  constraints: Figma.Constraints;
  // --------------------------------------------------
};

export type MappingPolygonNode = Omit<
  MutableOverrideOfBaseNodeMixin<
    MutableOverrideOfLayoutMixin<Figma.PolygonNode>
  >,
  | "clone"
  | OmitBaseNodeMixinMethods
  | OmitChildrenMixinMethods
  | OmitLayoutMixinMethods
  | OmitExportMixinMethods
  | OmitGeometryMixinMethods
> & {
  vectorPaths /** OVERRIDE */;
};

export type MAppingStarNode = Omit<
  MutableOverrideOfBaseNodeMixin<MutableOverrideOfLayoutMixin<Figma.StarNode>>,
  | "clone"
  | OmitBaseNodeMixinMethods
  | OmitChildrenMixinMethods
  | OmitLayoutMixinMethods
  | OmitExportMixinMethods
  | OmitGeometryMixinMethods
> & {
  vectorPaths /** OVERRIDE */;
};
