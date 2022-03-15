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
  mixed,
  makeComponentReference,
  ReflectBooleanOperationNode,
} from "@design-sdk/core";
import { utils } from "@design-sdk/core";
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
} from "../converters";
import {
  figma,
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
} from "@design-sdk/figma-types";
import { convertBlendModeToReflect } from "../converters/blend-mode.convert";
import { EdgeInsets } from "@reflect-ui/core";

// import { convert_frame_to_autolayout_if_possible } from "../../../designto-sanitized/convert-frame-to-autolayout-if-possible";
// import { convert_rectangle_with_others_as_new_frame_and_as_bg } from "../../../designto-sanitized/convert-rectangle-with-others-as-new-frame-and-as-bg";

/**
 * restrictied to single selection
 * @param sceneNode
 * @param altParent
 */
export function intoReflectNode(
  sceneNode: SceneNode,
  altParent: ReflectFrameNode | ReflectGroupNode | null = null
): ReflectSceneNode {
  return intoReflectNodes([sceneNode], altParent)[0];
}

export function intoReflectNodes(
  sceneNode: ReadonlyArray<SceneNode>,
  altParent: ReflectFrameNode | ReflectGroupNode | null = null
): Array<ReflectSceneNode> {
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
          convertDefaultShape(altNode, node);
          convertCorner(altNode, node);

          return altNode;
        }
        case "LINE": {
          const altNode = new ReflectLineNode({
            id: node.id,
            name: node.name,
            parent: altParent,
            origin: node.type,
            originParentId: node.parent?.id,
            absoluteTransform: node.absoluteTransform,
            childrenCount: 0,
          });

          convertDefaultShape(altNode, node);
          convertBlend(altNode, node);
          convertConstraint(altNode, node);
          // TODO: finalize line support. there are some missing conversions.

          return altNode;
        }
        case "FRAME":
        case "INSTANCE":
        case "COMPONENT": {
          const altNode = convertFrameNodeToAlt(node, altParent);
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
            name: node.name,
            parent: altParent,
            origin: node.type,
            originParentId: node.parent?.id,
            absoluteTransform: node.absoluteTransform,
            childrenCount: node.children.length,
          });

          convertLayout(altNode, node);
          convertBlend(altNode, node);

          altNode.children = intoReflectNodes(node.children, altNode);
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
            name: node.name,
            parent: altParent,
            origin: node.type,
            originParentId: node.parent?.id,
            absoluteTransform: node.absoluteTransform,
            childrenCount: 0,
          });

          convertDefaultShape(altNode, node);
          convertIntoReflectText(altNode, node);
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
            name: node.name,
            parent: altParent,
            originParentId: node.parent?.id,
            origin: node.type,
            absoluteTransform: node.absoluteTransform,
            childrenCount: 0,
          });

          convertDefaultShape(altNode, node);
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
            name: node.name,
            parent: altParent,
            originParentId: node.parent?.id,
            origin: node.type,
            absoluteTransform: node.absoluteTransform,
            childrenCount: node.children.length,
          });

          convertDefaultShape(altNode, node);
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
            altNode as any as ReflectGroupNode
          );
          return altNode;
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

function convertLayout(altNode: IReflectLayoutMixin, node: LayoutMixin) {
  altNode.x = node.x;
  altNode.y = node.y;
  altNode.absoluteTransform = node.absoluteTransform;
  altNode.width = node.width;
  altNode.height = node.height;
  altNode.rotation = node.rotation;
  altNode.layoutAlign = node.layoutAlign;
  altNode.layoutGrow = convertLayoutGrowToReflect(node.layoutGrow);
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
  node: DefaultShapeMixin
) {
  // opacity, visible
  convertBlend(altNode, node);

  // fills, storkes
  convertGeometry(altNode, node);

  // width, x, y
  convertLayout(altNode, node);
}

function convertCorner(
  altNode: IReflectRectangleCornerMixin,
  node: CornerMixin | RectangleCornerMixin
) {
  altNode.cornerRadius = convertFigmaCornerRadiusToBorderRadius({
    cornerRadius: figmaAccessibleMixedToReflectProperty(
      (node as CornerMixin).cornerRadius
    ),
    topLeftRadius: (node as RectangleCornerMixin).topLeftRadius,
    topRightRadius: (node as RectangleCornerMixin).topRightRadius,
    bottomLeftRadius: (node as RectangleCornerMixin).bottomLeftRadius,
    bottomRightRadius: (node as RectangleCornerMixin).bottomRightRadius,
  });
  altNode.cornerSmoothing = (node as CornerMixin).cornerSmoothing;
}

function convertIntoReflectText(altNode: ReflectTextNode, node: TextNode) {
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
}

// drops the useless figma's mixed symbol
function figmaToReflectProperty<T>(
  origin: T | PluginAPI["mixed"]
): T | undefined {
  if (origin === figma?.mixed) {
    return undefined;
  }
  return origin as T;
}

// usually figma.mixed is useless, since it does not provide any furthre data for the mixed value, but in somecase, such like corner radius, we can access mixed value by other properties like leftTopCorderRadius.
// in this case, we provide reflect's mixed symbol
function figmaAccessibleMixedToReflectProperty<T>(
  origin: T | PluginAPI["mixed"]
): T | typeof mixed {
  if (origin === figma?.mixed) {
    return mixed as any;
  }
  return origin as T;
}

export function convertSingleNodeToAlt(
  node: SceneNode,
  parent: ReflectFrameNode | ReflectGroupNode | null = null
): ReflectSceneNode {
  return intoReflectNodes([node], parent)[0];
}

export function convertFrameNodeToAlt(
  node: FrameNode | InstanceNode | ComponentNode,
  altParent: ReflectFrameNode | ReflectGroupNode | null = null
): ReflectRectangleNode | ReflectFrameNode | ReflectGroupNode {
  if (!utils.checkIfAutoLayout(node) && node.children.length === 0) {
    // todo - move this logic somewhere else. (highly Vulnerable)
    // if not autolayout and, if it has no children, convert frame to rectangle
    // this frame has no other functionality
    return frameToRectangleNode(node, altParent);
  }

  const altNode = new ReflectFrameNode({
    id: node.id,
    name: node.name,
    parent: altParent,
    origin: node.type,
    originParentId: node.parent?.id,
    absoluteTransform: node.absoluteTransform,
    childrenCount: node.children.length,
  });

  convertDefaultShape(altNode, node);
  convertFrame(altNode, node);
  convertCorner(altNode, node);
  convertConstraint(altNode, node);

  altNode.children = intoReflectNodes(node.children, altNode);

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
  altParent: ReflectFrameNode | ReflectGroupNode | null
): ReflectRectangleNode {
  const newNode = new ReflectRectangleNode({
    id: node.id,
    name: node.name,
    parent: altParent,
    origin: node.type,
    originParentId: node.parent?.id,
    absoluteTransform: node.absoluteTransform,
    childrenCount: 0,
  });

  convertDefaultShape(newNode, node);
  convertCorner(newNode, node);
  convertConstraint(newNode, node);
  return newNode;
}
