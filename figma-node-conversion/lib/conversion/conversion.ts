import {
  ReflectSceneNode,
  ReflectVectorNode,
  ReflectFrameNode,
  ReflectGroupNode,
  ReflectRectangleNode,
  ReflectEllipseNode,
  ReflectLineNode,
  ReflectBaseNode,
  ReflectTextNode,
  IReflectBlendMixin,
  IReflectRectangleCornerMixin,
  ReflectDefaultShapeMixin,
  IReflectGeometryMixin,
  IReflectLayoutMixin,
  ReflectConstraintMixin,
  makeComponentReference,
  ReflectBooleanOperationNode,
} from "@design-sdk/figma-node";
import {
  mixed,
  FigmaFileKey,
  figma_special_filekeys,
} from "@design-sdk/figma-core";
import { array } from "@reflect-ui/uiutils";
import { shouldIgnore } from "@design-sdk/flags";

import {
  convertTextAlignHorizontalToReflect,
  convertTextAlignVerticalToReflect,
  convertLayoutModeToAxis,
  convertPrimaryAxisAlignItemsToMainAxisAlignment,
  convertCounterAxisAlignItemsToCrossAxisAlignment,
  convertFigmaCornerRadiusToBorderRadius,
  convertLayoutGrowToReflect,
  convertTextDecorationToReflect,
  convertTextCaseToReflectTextTransform,
  figma_lineheight_to_reflect_ling_height,
  convertLetterSpacingToReflect,
  convertTextStyleToReflect,
} from "../converters";
import {
  plugin,
  SceneNode,
  LayoutMixin,
  DefaultFrameMixin,
  GeometryMixin,
  ConstraintMixin,
  DefaultShapeMixin,
  BlendMixin,
  SceneNodeMixin,
  CornerMixin,
  RectangleCornerMixin,
  TextNode,
  PluginAPI,
  FrameNode,
  InstanceNode,
  ComponentNode,
  HandleMirroring,
  FigmaTextDecoration,
  GroupNode,
  BooleanOperationNode,
  PageNode,
} from "@design-sdk/figma-types";
import { convertBlendModeToReflect } from "../converters/blend-mode.convert";
import { EdgeInsets } from "@reflect-ui/core";
import { checkIfAutoLayout } from "@design-sdk/figma-utils";
import { extractTextStyleFromTextNode } from "../converters";

// import { convert_frame_to_autolayout_if_possible } from "../../../designto-sanitized/convert-frame-to-autolayout-if-possible";
// import { convert_rectangle_with_others_as_new_frame_and_as_bg } from "../../../designto-sanitized/convert-rectangle-with-others-as-new-frame-and-as-bg";

/**
 * The environment the converter will run on.
 * Why this is required? - Figma has two api, plugin and rest api.
 * Both api have a simillar structure, but some of the values have different meaning. e.g. The relativeTransform of Group & BooleanOperation are different in plugin and rest api.
 * -> https://www.figma.com/plugin-docs/api/properties/nodes-relativetransform/#container-parent
 * (This converter is based on plugin api interface, and the remote rest api has its own mapper.)
 */
export type ConverterEnvironment = "plugin" | "rest";

// this global ========================================
let _global_converter_env: ConverterEnvironment;
let _global_filekey: FigmaFileKey;

/**
 * globally configure the converter environment. use with caution.
 */
export function config({
  environment,
  filekey,
}: {
  environment?: ConverterEnvironment;
  filekey?: FigmaFileKey;
}) {
  _global_converter_env = environment ?? "plugin";
  _global_filekey = filekey;
}

function _usefilekey(filekey?: FigmaFileKey): FigmaFileKey {
  return filekey ?? _global_filekey ?? figma_special_filekeys.unknown_file;
}
// ====================================================

/**
 * restrictied to single selection
 * @param sceneNode
 * @param altParent
 */
export function intoReflectNode(
  sceneNode: SceneNode,
  altParent: ReflectFrameNode | ReflectGroupNode | null = null,
  mode: ConverterEnvironment,
  filekey?: FigmaFileKey
): ReflectSceneNode {
  return intoReflectNodes(
    [sceneNode],
    altParent,
    mode,
    _usefilekey(filekey)
  )[0];
}

export function intoReflectNodes(
  sceneNode: ReadonlyArray<SceneNode>,
  altParent: ReflectFrameNode | ReflectGroupNode | null = null,
  mode: ConverterEnvironment,
  filekey: FigmaFileKey,
  maxChildren = 500
): Array<ReflectSceneNode> {
  if (sceneNode.length > maxChildren) {
    console.warn(
      "too many children. skipping this set. (this might be a graphical resource. please bake it as an image or flatten it.",
      sceneNode
    );
    return [];
  }

  // console.log("converting figma scene node to reflect node", sceneNode);
  const mapped: Array<ReflectSceneNode | null> = sceneNode.map(
    (node: SceneNode) => {
      // pre-filtering
      if (shouldIgnore(node.name)) {
        return null;
      }

      // figma non context data does not contain field 'visible', so we'll need to check it explicitly
      if (node.visible !== undefined) {
        const isVisible = node.visible === true;
        if (!isVisible) {
          return null;
        }
      }

      switch (node.type) {
        case "RECTANGLE":
        case "ELLIPSE": {
          let altNode;
          switch (node.type) {
            case "RECTANGLE": {
              altNode = new ReflectRectangleNode({
                id: node.id,
                filekey: _usefilekey(filekey),
                name: node.name,
                origin: node.type,
                parent: altParent,
                originParentId: node.parent?.id,
                absoluteTransform: node.absoluteTransform,
                childrenCount: 0,
              });
              break;
            }
            case "ELLIPSE": {
              altNode = new ReflectEllipseNode({
                id: node.id,
                filekey: _usefilekey(filekey),
                name: node.name,
                origin: node.type,
                parent: altParent,
                originParentId: node.parent?.id,
                absoluteTransform: node.absoluteTransform,
                childrenCount: 0,
              });
              // ellipse specific fileds (move this to safer place)
              altNode.arcData = node.arcData;
              break;
            }
          }

          if (altParent) {
            altNode.parent = altParent;
            altNode.parentId = altParent.id;
          }

          convertConstraint(altNode, node);
          convertDefaultShape(altNode, node, mode);
          convertCorner(altNode, node);

          return altNode;
        }
        case "LINE": {
          const altNode = new ReflectLineNode({
            id: node.id,
            filekey: _usefilekey(filekey),
            name: node.name,
            parent: altParent,
            origin: node.type,
            originParentId: node.parent?.id,
            absoluteTransform: node.absoluteTransform,
            childrenCount: 0,
          });

          convertDefaultShape(altNode, node, mode);
          convertBlend(altNode, node);
          convertConstraint(altNode, node);
          // TODO: finalize line support. there are some missing conversions.

          return altNode;
        }
        case "FRAME":
        case "INSTANCE":
        case "COMPONENT": {
          const altNode = convertFrameNodeToAlt(
            node,
            altParent,
            mode,
            _usefilekey(filekey)
          );
          if (node.type == "INSTANCE" || node.type == "COMPONENT") {
            // component & instance has variant mixin. we'll map it here.
            altNode.variantProperties = node.variantProperties;
            // only for "instance"
            if (node.type == "INSTANCE") {
              blendMainComponent(altNode, node);
            }
          }
          return altNode;
        }
        case "GROUP": {
          /// FIXME: DISABLING GROUP CONVERSION - this should be handled by the design to code side.
          // if (node.children.length === 1 && node.visible !== false) {
          //   // if Group is visible and has only one child, Group should disappear.
          //   // there will be a single value anyway.
          //   console.warn(
          //     `the givven node ${node.name} was type of GROUP, but it has single children, converting it to single node`
          //   );
          //   return intoReflectNodes(node.children, altParent)[0];
          // }

          const altNode = new ReflectGroupNode({
            id: node.id,
            filekey: _usefilekey(filekey),
            name: node.name,
            parent: altParent,
            origin: node.type,
            originParentId: node.parent?.id,
            absoluteTransform: node.absoluteTransform,
            childrenCount: node.children.length,
          });

          convertLayout(altNode, node, mode);
          convertBlend(altNode, node);

          altNode.children = intoReflectNodes(
            node.children,
            altNode,
            mode,
            _usefilekey(filekey)
          );
          /// ---- disabled feature ----
          // try to find big rect and regardless of that result, also try to convert to autolayout.
          // There is a big chance this will be returned as a Frame
          // also, Group will always have at least 2 children.
          // return convert_rectangle_with_others_as_new_frame_and_as_bg(altNode);
          /// ---- disabled feature ----
          return altNode;
        }
        case "TEXT": {
          const altNode = new ReflectTextNode({
            id: node.id,
            filekey: _usefilekey(filekey),
            name: node.name,
            parent: altParent,
            origin: node.type,
            originParentId: node.parent?.id,
            absoluteTransform: node.absoluteTransform,
            childrenCount: 0,
          });

          convertDefaultShape(altNode, node, mode);
          convertIntoReflectText(altNode, node, mode);
          convertConstraint(altNode, node);

          return altNode;
        }
        case "COMPONENT_SET": {
          // TODO: handle this case
          break;
        }
        case "STAR":
        case "POLYGON":
        case "VECTOR": {
          const altNode = new ReflectVectorNode({
            id: node.id,
            filekey: _usefilekey(filekey),
            name: node.name,
            parent: altParent,
            originParentId: node.parent?.id,
            origin: node.type,
            absoluteTransform: node.absoluteTransform,
            childrenCount: 0,
          });

          convertDefaultShape(altNode, node, mode);
          convertBlend(altNode, node);
          convertConstraint(altNode, node);

          // @ts-ignore
          altNode.vectorNetwork = node.vectorNetwork;
          altNode.vectorPaths = node.vectorPaths;
          // let's not assign this value until we find out what this exactly does.
          // altNode.handleMirroring = node.handleMirroring as HandleMirroring;

          return altNode;
        }
        case "BOOLEAN_OPERATION": {
          const altNode = new ReflectBooleanOperationNode({
            id: node.id,
            filekey,
            name: node.name,
            parent: altParent,
            originParentId: node.parent?.id,
            origin: node.type,
            absoluteTransform: node.absoluteTransform,
            childrenCount: node.children.length,
          });

          convertDefaultShape(altNode, node, mode);
          convertBlend(altNode, node);
          convertConstraint(
            altNode,
            // FIXME: this is a figma plugin typings error. bool op node do have constraint property, but node defined by official plugin typings.
            node as any
          );

          // boolean opreation properties -----
          altNode.shapeCornerRadius = figmaToReflectProperty(node.cornerRadius);
          altNode.cornerSmoothing = node.cornerSmoothing;
          altNode.booleanOperation = node.booleanOperation;
          // ----------------------------------

          altNode.children = intoReflectNodes(
            node.children,
            // FIXME: do not use force type. - it won't impact the logic since boolean operation node is simply a group-like.
            altNode as any as ReflectGroupNode,
            mode,
            filekey
          );
          return altNode;
        }
        default: {
          console.warn(
            `the givven node ${node.name} was type of ${node.type}, but it is not supported yet.`
          );
        }
      }
      return null;
    }
  );

  return mapped.filter(array.filters.notEmpty);
}

function blendMainComponent(altNode: ReflectBaseNode, node: InstanceNode) {
  altNode.mainComponent = makeComponentReference(node.mainComponent);
  altNode.mainComponentId =
    // for plugin version
    node.mainComponent?.id ??
    // for remote api version
    node.mainComponentId;
}

function convertLayout(
  altNode: IReflectLayoutMixin,
  node: LayoutMixin,
  mode: ConverterEnvironment
) {
  // region relative transform
  altNode.x = node.x;
  altNode.y = node.y;
  if (mode === "plugin") {
    convertRelativeTransform(altNode, node as SceneNode, mode);
  }
  // endregion relative transform

  altNode.absoluteTransform = node.absoluteTransform;
  altNode.width = node.width;
  altNode.height = node.height;
  altNode.rotation = node.rotation;
  altNode.layoutAlign = node.layoutAlign;
  altNode.layoutGrow = convertLayoutGrowToReflect(node.layoutGrow);
}

/**
 * A special handler for plugin version of Group and BooleanOperation nodes.
 * Why is this required? - https://www.figma.com/plugin-docs/api/properties/nodes-relativetransform/#container-parent
 *
 * The relative transform of a node is shown relative to its container parent, which includes canvas nodes, frame nodes, component nodes, and instance nodes. Just like in the properties panel, it is not relative to its direct parent if the parent is a group or a boolean operation.
 * Example 1: In the following hierarchy, the relative transform of rectangle is relative to page (which is just its position on the canvas).
 * ```
 * - page
 *    - group
 *      - rectangle
 * ```
 *
 * Example 2: In the following hierarchy, the relative transform of rectangle is relative to frame.
 * ```
 * - page
 *    - frame
 *      - boolean operation
 *        - rectangle
 * ```
 */
function convertRelativeTransform(
  rf: IReflectLayoutMixin,
  node: SceneNode,
  mode: "plugin" = "plugin" // this is a default value, but it is not used in the code. (this function is only used for plugin environment)
) {
  if (mode !== "plugin") {
    return;
  }

  const { parent } = node;

  if (parent.type === "PAGE") {
    return;
  }

  /**
   * retrive the non group/boolean operation node (the parent which node's position is relative to)
   */
  // const relativeParent = (node: GroupNode | BooleanOperationNode) => {
  //   const parent = node.parent;
  //   if (parent.type === "PAGE") {
  //     return node;
  //   }
  //   if (parent.type === "GROUP" || parent.type === "BOOLEAN_OPERATION") {
  //     return relativeParent(parent);
  //   } else {
  //     return node;
  //   }
  // };

  // const diff = (node: GroupNode | BooleanOperationNode) => {
  //   if (
  //     node.parent.type === "GROUP" ||
  //     node.parent.type === "BOOLEAN_OPERATION"
  //   ) {
  //     // new position relative to direct parent
  //     const [nx, ny] = [node.x - node.parent["x"], node.y - node.parent["y"]];
  //     // diff
  //     const [dx, dy] = [node.x - nx, node.y - ny];
  //     return [dx, dy];
  //   } else {
  //     // no diff
  //     return [0, 0];
  //   }
  // };

  // rf.relativeTransform = node.relativeTransform; // TODO: field `relativeTransform` is not supported yet.

  if (
    node.parent.type === "GROUP" ||
    node.parent.type === "BOOLEAN_OPERATION"
  ) {
    // TODO: direcly modifiying the field may not be a good idea, since this function can be recursive. (instead, calculate the value and return it.)
    rf.x = node.x - node.parent["x"];
    rf.y = node.y - node.parent["y"];
  } else {
    // don't alter
  }
}

function convertFrame(rfNode: ReflectFrameNode, node: DefaultFrameMixin) {
  rfNode.layoutMode = convertLayoutModeToAxis(node.layoutMode);

  rfNode.primaryAxisSizingMode = node.primaryAxisSizingMode;
  rfNode.counterAxisSizingMode = node.counterAxisSizingMode;

  const _primaryAxisAlign = convertPrimaryAxisAlignItemsToMainAxisAlignment(
    node.primaryAxisAlignItems
  );

  const _counterAxisAlign = convertCounterAxisAlignItemsToCrossAxisAlignment(
    node.counterAxisAlignItems
  );

  rfNode.mainAxisAlignment = _primaryAxisAlign;
  rfNode.crossAxisAlignment = _counterAxisAlign;

  rfNode.padding = new EdgeInsets({
    left: node.paddingLeft ?? 0,
    right: node.paddingRight ?? 0,
    top: node.paddingTop ?? 0,
    bottom: node.paddingBottom ?? 0,
  });

  rfNode.itemSpacing = node.itemSpacing;
  rfNode.layoutGrids = node.layoutGrids;
  rfNode.gridStyleId = node.gridStyleId;
  rfNode.clipsContent = node.clipsContent;
  rfNode.guides = node.guides;
}

function convertGeometry(altNode: IReflectGeometryMixin, node: GeometryMixin) {
  altNode.fills = figmaToReflectProperty(node.fills);
  altNode.strokes = node.strokes;
  altNode.strokeWeight = node.strokeWeight;
  altNode.strokeMiterLimit = node.strokeMiterLimit;
  altNode.strokeAlign = node.strokeAlign;
  altNode.strokeCap = figmaToReflectProperty(node.strokeCap);
  altNode.strokeJoin = figmaToReflectProperty(node.strokeJoin);
  altNode.dashPattern = node.dashPattern;
  altNode.fillStyleId = figmaToReflectProperty(node.fillStyleId);
  altNode.strokeStyleId = node.strokeStyleId;
}

function convertConstraint(
  altNode: ReflectConstraintMixin,
  node: ConstraintMixin
) {
  altNode.constraints = node.constraints;
}

function convertBlend(
  altNode: IReflectBlendMixin,
  node: BlendMixin & SceneNodeMixin
) {
  altNode.opacity = node.opacity;
  altNode.blendMode = convertBlendModeToReflect(node.blendMode);
  altNode.isMask = node.isMask;
  altNode.effects = node.effects;
  altNode.effectStyleId = node.effectStyleId;

  altNode.visible = node.visible;
}

function convertDefaultShape(
  altNode: ReflectDefaultShapeMixin,
  node: DefaultShapeMixin,
  mode: ConverterEnvironment
) {
  // opacity, visible
  convertBlend(altNode, node);

  // fills, storkes
  convertGeometry(altNode, node);

  // width, x, y
  convertLayout(altNode, node, mode);
}

function convertCorner(
  altNode: IReflectRectangleCornerMixin,
  node: CornerMixin | RectangleCornerMixin
) {
  altNode.cornerRadius = convertFigmaCornerRadiusToBorderRadius({
    topLeftRadius: (node as RectangleCornerMixin).topLeftRadius,
    topRightRadius: (node as RectangleCornerMixin).topRightRadius,
    bottomLeftRadius: (node as RectangleCornerMixin).bottomLeftRadius,
    bottomRightRadius: (node as RectangleCornerMixin).bottomRightRadius,
  });
  altNode.cornerSmoothing = (node as CornerMixin).cornerSmoothing;
}

function convertIntoReflectText(
  altNode: ReflectTextNode,
  node: TextNode,
  mode: ConverterEnvironment
) {
  altNode.autoRename = node.autoRename;
  altNode.textAlign = convertTextAlignHorizontalToReflect(
    node.textAlignHorizontal
  );
  altNode.textAlignVertical = convertTextAlignVerticalToReflect(
    node.textAlignVertical
  );
  altNode.paragraphIndent = node.paragraphIndent;
  altNode.paragraphSpacing = node.paragraphSpacing;
  altNode.fontSize = figmaToReflectProperty(node.fontSize);
  altNode.fontName = figmaToReflectProperty(node.fontName);
  altNode.textCase = convertTextCaseToReflectTextTransform(
    figmaToReflectProperty(node.textCase)
  );

  altNode.textDecoration = convertTextDecorationToReflect(
    figmaToReflectProperty<FigmaTextDecoration>(node.textDecoration)
  );
  altNode.textStyleId = figmaToReflectProperty(node.textStyleId);
  altNode.letterSpacing = convertLetterSpacingToReflect(
    figmaToReflectProperty(node.letterSpacing)
  );
  altNode.textAutoResize = node.textAutoResize;
  altNode.data = node.characters;
  altNode.lineHeight = figma_lineheight_to_reflect_ling_height(
    figmaToReflectProperty(node.lineHeight)
  );

  // run lastly
  const textStyle = (node: ReflectTextNode): ReflectTextNode["textStyle"] => {
    if (mode === "plugin") {
      try {
        for (const s of plugin.getLocalTextStyles()) {
          if (s.id === node.textStyleId) {
            return convertTextStyleToReflect(s);
          }
        }
      } catch (e) {
        console.error(`error while getting textstyle from plugin api by id`, e);
        return extractTextStyleFromTextNode(node);
      }
    } else {
      return extractTextStyleFromTextNode(node);
    }
  };
  altNode.textStyle = textStyle(altNode);
}

// drops the useless figma's mixed symbol
function figmaToReflectProperty<T>(
  origin: T | PluginAPI["mixed"]
): T | undefined {
  if (origin === plugin?.mixed) {
    return undefined;
  }
  return origin as T;
}

// usually figma.mixed is useless, since it does not provide any furthre data for the mixed value, but in somecase, such like corner radius, we can access mixed value by other properties like leftTopCorderRadius.
// in this case, we provide reflect's mixed symbol
function figmaAccessibleMixedToReflectProperty<T>(
  origin: T | PluginAPI["mixed"]
): T | typeof mixed {
  if (origin === plugin?.mixed) {
    return mixed as any;
  }
  return origin as T;
}

export function convertSingleNodeToAlt(
  node: SceneNode,
  parent: ReflectFrameNode | ReflectGroupNode | null = null,
  mode: ConverterEnvironment,
  filekey: FigmaFileKey
): ReflectSceneNode {
  return intoReflectNodes([node], parent, mode, filekey)[0];
}

export function convertFrameNodeToAlt(
  node: FrameNode | InstanceNode | ComponentNode,
  altParent: ReflectFrameNode | ReflectGroupNode | null = null,
  mode: ConverterEnvironment,
  filekey: FigmaFileKey
): ReflectRectangleNode | ReflectFrameNode | ReflectGroupNode {
  if (!checkIfAutoLayout(node) && node.children.length === 0) {
    // todo - move this logic somewhere else. (highly Vulnerable)
    // if not autolayout and, if it has no children, convert frame to rectangle
    // this frame has no other functionality
    return frameToRectangleNode(node, altParent, mode, filekey);
  }

  const altNode = new ReflectFrameNode({
    id: node.id,
    filekey,
    name: node.name,
    parent: altParent,
    origin: node.type,
    originParentId: node.parent?.id,
    absoluteTransform: node.absoluteTransform,
    childrenCount: node.children.length,
  });

  convertDefaultShape(altNode, node, mode);
  convertFrame(altNode, node);
  convertCorner(altNode, node);
  convertConstraint(altNode, node);

  altNode.children = intoReflectNodes(node.children, altNode, mode, filekey);

  // ----- disabled feature -----
  // return convert_frame_to_autolayout_if_possible(
  //   convert_rectangle_with_others_as_new_frame_and_as_bg(altNode)
  // );
  // ----- disabled feature -----

  return altNode;
}

// auto convert Frame to Rectangle when Frame has no Children
function frameToRectangleNode(
  node: FrameNode | InstanceNode | ComponentNode,
  altParent: ReflectFrameNode | ReflectGroupNode | null,
  mode: ConverterEnvironment,
  filekey: FigmaFileKey
): ReflectRectangleNode {
  const newNode = new ReflectRectangleNode({
    id: node.id,
    filekey,
    name: node.name,
    parent: altParent,
    origin: node.type,
    originParentId: node.parent?.id,
    absoluteTransform: node.absoluteTransform,
    childrenCount: 0,
  });

  convertDefaultShape(newNode, node, mode);
  convertCorner(newNode, node);
  convertConstraint(newNode, node);
  return newNode;
}
