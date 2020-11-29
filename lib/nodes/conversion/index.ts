import {
    ReflectSceneNode,
    ReflectRectangleNode,
    ReflectFrameNode,
    ReflectTextNode,
    ReflectGroupNode,
    ReflectLayoutMixin,
    ReflectGeometryMixin,
    ReflectBlendMixin,
    ReflectCornerMixin,
    ReflectRectangleCornerMixin,
    ReflectDefaultShapeMixin,
    ReflectEllipseNode,
    ReflectConstraintMixin,
    ReflectLineNode,
    mixed,
} from "../types";
import { convertToAutoLayout } from "./auto-layout.convert";
import { notEmpty } from "../../utils/general";
import { convertNodesOnRectangle } from "./nodes-on-rect.convert";
import { shouldIgnoreNode } from "../../features/ignore";
import { convertTextAlignHorizontalToReflect, convertTextAlignVerticalToReflect } from "../../figma/converters/text-align.converter";
import { convertTextDecorationToReflect } from "../../figma/converters/tetx-decoration.convert";
import { convertPrimaryAxisAlignItemsToMainAxisAlignment } from "../../figma/converters/main-axis-alignment.convert";
import { convertCounterAxisAlignItemsToCrossAxisAlignment } from "../../figma/converters/cross-axis-alignment.convert";
import { convertLayoutModeToAxis } from "../../figma/converters/layout-mode.convert";

/**
 * restrictied to single selection
 * @param sceneNode 
 * @param altParent 
 */
export function convertIntoReflectNode(sceneNode: SceneNode,
    altParent: ReflectFrameNode | ReflectGroupNode | null = null): ReflectSceneNode {
    return convertIntoReflectNodes([sceneNode], altParent,)[0]
}


export function convertIntoReflectNodes(sceneNode: ReadonlyArray<SceneNode>,
    altParent: ReflectFrameNode | ReflectGroupNode | null = null): Array<ReflectSceneNode> {
    const mapped: Array<ReflectSceneNode | null> = sceneNode.map(
        (node: SceneNode) => {



            // pre-filtering
            const ignoreResult = shouldIgnoreNode(node.name)
            if (ignoreResult.ignored) {
                console.info(`ignoring`, ignoreResult.reason)
                return null
            }


            const isVisible = node.visible
            if (!isVisible) {
                return null
            }


            if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
                let altNode;
                if (node.type === "RECTANGLE") {
                    altNode = new ReflectRectangleNode({
                        id: node.id,
                        name: node.name,
                        origin: node.type,
                        parent: altParent,
                        originParentId: node.parent?.id,
                        absoluteTransform: node.absoluteTransform,
                    });
                    convertConstraint(altNode, node);
                    convertRectangleCorner(altNode, node);
                }
                else if (node.type === "ELLIPSE") {
                    altNode = new ReflectEllipseNode({
                        id: node.id,
                        name: node.name,
                        origin: node.type,
                        parent: altParent,
                        originParentId: node.parent?.id,
                        absoluteTransform: node.absoluteTransform,
                    });
                }


                if (altParent) {
                    altNode.parent = altParent;
                }

                convertDefaultShape(altNode, node);
                convertCorner(altNode, node);

                return altNode;
            } else if (node.type === "LINE") {
                const altNode = new ReflectLineNode({
                    id: node.id,
                    name: node.name,
                    parent: altParent,
                    origin: node.type,
                    originParentId: node.parent?.id,
                    absoluteTransform: node.absoluteTransform,
                })

                convertDefaultShape(altNode, node)
                convertBlend(altNode, node);
                convertConstraint(altNode, node);
                // TODO finalize line support. there are some missing conversions.

                return altNode;
            }
            else if (node.type === "FRAME" ||
                node.type === "INSTANCE" ||
                node.type === "COMPONENT") {
                return convertFrameNodeToAlt(node, altParent);
            } else if (node.type === "GROUP") {
                if (node.children.length === 1 && node.visible !== false) {
                    // if Group is visible and has only one child, Group should disappear.
                    // there will be a single value anyway.
                    console.warn(`the givven node ${node.name} was type of GROUP, but it has single children, converting it to single node`)
                    return convertIntoReflectNodes(node.children, altParent)[0];
                }

                const altNode = new ReflectGroupNode({
                    id: node.id,
                    name: node.name,
                    parent: altParent,
                    origin: node.type,
                    originParentId: node.parent?.id,
                    absoluteTransform: node.absoluteTransform,
                });

                convertLayout(altNode, node);
                convertBlend(altNode, node);

                altNode.children = convertIntoReflectNodes(node.children, altNode);
                // try to find big rect and regardless of that result, also try to convert to autolayout.
                // There is a big chance this will be returned as a Frame
                // also, Group will always have at least 2 children.
                return convertNodesOnRectangle(altNode);
            } else if (node.type === "TEXT") {
                const altNode = new ReflectTextNode({
                    id: node.id,
                    name: node.name,
                    parent: altParent,
                    origin: node.type,
                    originParentId: node.parent?.id,
                    absoluteTransform: node.absoluteTransform,
                });

                convertDefaultShape(altNode, node);
                convertIntoReflectText(altNode, node);
                convertConstraint(altNode, node);

                return altNode;
            }
            // else if (node.type == "COMPONENT_SET") {
            // todo handle this case
            // }
            else if (node.type === "POLYGON" || node.type === "STAR") {
                // todo export as a svg and display it directly.
            }
            else if (node.type === "VECTOR") {
                console.log(`converting vector node "${node.name}" to reflect rectangle node.`)
                const altNode = new ReflectRectangleNode({
                    id: node.id,
                    name: node.name,
                    parent: altParent,
                    originParentId: node.parent?.id,
                    origin: node.type,
                    absoluteTransform: node.absoluteTransform,
                });

                convertConstraint(altNode, node);
                convertDefaultShape(altNode, node);

                // TODO Vector support is still missing. Meanwhile, add placeholder.
                altNode.radius = 16;
                altNode.opacity = 0.5;

                return altNode;
            }

            return null;
        }
    );

    return mapped.filter(notEmpty);
}

function convertLayout(altNode: ReflectLayoutMixin, node: LayoutMixin) {
    altNode.x = node.x;
    altNode.y = node.y;
    altNode.absoluteTransform = node.absoluteTransform
    altNode.width = node.width;
    altNode.height = node.height;
    altNode.rotation = node.rotation;
    altNode.layoutAlign = node.layoutAlign;
}

function convertFrame(rfNode: ReflectFrameNode, node: DefaultFrameMixin) {
    rfNode.layoutMode = convertLayoutModeToAxis(node.layoutMode);

    rfNode.primaryAxisSizingMode = node.primaryAxisSizingMode;
    rfNode.counterAxisSizingMode = node.counterAxisSizingMode;

    rfNode.mainAxisAlignment = convertPrimaryAxisAlignItemsToMainAxisAlignment(node.primaryAxisAlignItems);
    rfNode.crossAxisAlignment = convertCounterAxisAlignItemsToCrossAxisAlignment(node.counterAxisAlignItems);

    rfNode.paddingLeft = node.horizontalPadding;
    rfNode.paddingRight = node.horizontalPadding;
    rfNode.paddingTop = node.verticalPadding;
    rfNode.paddingBottom = node.verticalPadding;

    rfNode.itemSpacing = node.itemSpacing;
    rfNode.layoutGrids = node.layoutGrids;
    rfNode.gridStyleId = node.gridStyleId;
    rfNode.clipsContent = node.clipsContent;
    rfNode.guides = node.guides;
}

function convertGeometry(altNode: ReflectGeometryMixin, node: GeometryMixin) {
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

function convertConstraint(altNode: ReflectConstraintMixin, node: ConstraintMixin) {
    altNode.constraints = node.constraints;
}

function convertBlend(altNode: ReflectBlendMixin,
    node: BlendMixin & SceneNodeMixin) {
    altNode.opacity = node.opacity;
    altNode.blendMode = node.blendMode;
    altNode.isMask = node.isMask;
    altNode.effects = node.effects;
    altNode.effectStyleId = node.effectStyleId;

    altNode.visible = node.visible;
}

function convertDefaultShape(altNode: ReflectDefaultShapeMixin,
    node: DefaultShapeMixin) {
    // opacity, visible
    convertBlend(altNode, node);

    // fills, storkes
    convertGeometry(altNode, node);

    // width, x, y
    convertLayout(altNode, node);
}

function convertCorner(altNode: ReflectCornerMixin, node: CornerMixin) {
    altNode.cornerRadius = figmaAccessibleMixedToReflectProperty(node.cornerRadius)
    altNode.cornerSmoothing = node.cornerSmoothing;
}

function convertRectangleCorner(altNode: ReflectRectangleCornerMixin,
    node: RectangleCornerMixin) {
    altNode.topLeftRadius = node.topLeftRadius;
    altNode.topRightRadius = node.topRightRadius;
    altNode.bottomLeftRadius = node.bottomLeftRadius;
    altNode.bottomRightRadius = node.bottomRightRadius;
}

function convertIntoReflectText(altNode: ReflectTextNode, node: TextNode) {
    altNode.textAlignHorizontal = convertTextAlignHorizontalToReflect(node.textAlignHorizontal);
    altNode.textAlignVertical = convertTextAlignVerticalToReflect(node.textAlignVertical);
    altNode.paragraphIndent = node.paragraphIndent;
    altNode.paragraphSpacing = node.paragraphSpacing;
    altNode.fontSize = figmaToReflectProperty(node.fontSize);
    altNode.fontName = figmaToReflectProperty(node.fontName);
    altNode.textCase = figmaToReflectProperty(node.textCase);

    // TODO = > convertTextDecorationToReflect(this)
    altNode.textDecoration = (figmaToReflectProperty(node.textDecoration));
    altNode.textStyleId = figmaToReflectProperty(node.textStyleId);
    altNode.letterSpacing = figmaToReflectProperty(node.letterSpacing);
    altNode.textAutoResize = node.textAutoResize;
    altNode.characters = node.characters
    altNode.lineHeight = figmaToReflectProperty(node.lineHeight);
}


// drops the useless figma's mixed symbol
function figmaToReflectProperty<T>(origin: T | PluginAPI['mixed']): T | undefined {
    if (origin === figma.mixed) {
        return undefined
    }
    return origin as T
}


// usually figma.mixed is useless, since it does not provide any furthre data for the mixed value, but in somecase, such like corner radius, we can access mixed value by other properties like leftTopCorderRadius.
// in this case, we provide reflect's mixed symbol
function figmaAccessibleMixedToReflectProperty<T>(origin: T | PluginAPI['mixed']): T | typeof mixed {
    if (origin === figma.mixed) {
        return mixed as any
    }
    return origin as T
}



export function convertSingleNodeToAlt(node: SceneNode,
    parent: ReflectFrameNode | ReflectGroupNode | null = null): ReflectSceneNode {
    return convertIntoReflectNodes([node], parent)[0];
}

export function convertFrameNodeToAlt(node: FrameNode | InstanceNode | ComponentNode,
    altParent: ReflectFrameNode | ReflectGroupNode | null = null): ReflectRectangleNode | ReflectFrameNode | ReflectGroupNode {
    if (node.children.length === 0) {
        // if it has no children, convert frame to rectangle
        return frameToRectangleNode(node, altParent);
    }

    const altNode = new ReflectFrameNode(
        {
            id: node.id,
            name: node.name,
            parent: altParent,
            origin: node.type,
            originParentId: node.parent?.id,
            absoluteTransform: node.absoluteTransform,
        }
    );

    convertDefaultShape(altNode, node);
    convertFrame(altNode, node);
    convertCorner(altNode, node);
    convertRectangleCorner(altNode, node);
    convertConstraint(altNode, node);

    altNode.children = convertIntoReflectNodes(node.children, altNode);

    return convertToAutoLayout(convertNodesOnRectangle(altNode));
}

// auto convert Frame to Rectangle when Frame has no Children
function frameToRectangleNode(node: FrameNode | InstanceNode | ComponentNode,
    altParent: ReflectFrameNode | ReflectGroupNode | null): ReflectRectangleNode {
    const newNode = new ReflectRectangleNode(
        {
            id: node.id,
            name: node.name,
            parent: altParent,
            origin: node.type,
            originParentId: node.parent?.id,
            absoluteTransform: node.absoluteTransform,
        }
    );

    convertDefaultShape(newNode, node);
    convertRectangleCorner(newNode, node);
    convertCorner(newNode, node);
    convertConstraint(newNode, node);
    return newNode;
}
