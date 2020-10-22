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
} from "../types";
import { convertToAutoLayout } from "./auto-layout.convert";
import { notEmpty } from "../../utils/general";
import { convertNodesOnRectangle } from "./nodes-on-rect.convert";

export function convertSingleNodeToAlt(node: SceneNode,
    parent: ReflectFrameNode | ReflectGroupNode | null = null): ReflectSceneNode {
    return convertIntoReflectNodes([node], parent)[0];
}

export function frameNodeToAlt(node: FrameNode | InstanceNode | ComponentNode,
    altParent: ReflectFrameNode | ReflectGroupNode | null = null): ReflectRectangleNode | ReflectFrameNode | ReflectGroupNode {
    if (node.children.length === 0) {
        // if it has no children, convert frame to rectangle
        return frameToRectangleNode(node, altParent);
    }

    const altNode = new ReflectFrameNode(
        {
            id: node.id,
            name: node.name
        }
    );

    altNode.id = node.id;
    altNode.name = node.name;

    if (altParent) {
        altNode.parent = altParent;
    }

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
            name: node.name
        }
    );

    if (altParent) {
        newNode.parent = altParent;
    }

    convertDefaultShape(newNode, node);
    convertRectangleCorner(newNode, node);
    convertCorner(newNode, node);
    convertConstraint(newNode, node);
    return newNode;
}

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
            if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
                let altNode;
                if (node.type === "RECTANGLE") {
                    altNode = new ReflectRectangleNode({
                        id: node.id,
                        name: node.name
                    });
                    convertConstraint(altNode, node);
                    convertRectangleCorner(altNode, node);
                }
                else if (node.type === "ELLIPSE") {
                    altNode = new ReflectEllipseNode({
                        id: node.id,
                        name: node.name
                    });
                }


                if (altParent) {
                    altNode.parent = altParent;
                }

                convertDefaultShape(altNode, node);
                convertCorner(altNode, node);

                return altNode;
            } else if (node.type === "FRAME" ||
                node.type === "INSTANCE" ||
                node.type === "COMPONENT") {
                return frameNodeToAlt(node, altParent);
            } else if (node.type === "GROUP") {
                if (node.children.length === 1 && node.visible !== false) {
                    // if Group is visible and has only one child, Group should disappear.
                    // there will be a single value anyway.
                    console.warn(`the givven node ${node.name} was type of GROUP, but it has single children, converting it to single node`)
                    return convertIntoReflectNodes(node.children, altParent)[0];
                }

                const altNode = new ReflectGroupNode({
                    id: node.id,
                    name: node.name
                });


                if (altParent) {
                    altNode.parent = altParent;
                }

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
                    name: node.name
                });


                if (altParent) {
                    altNode.parent = altParent;
                }

                convertDefaultShape(altNode, node);
                convertIntoReflectText(altNode, node);
                convertConstraint(altNode, node);

                return altNode;
            } else if (node.type === "VECTOR") {
                const altNode = new ReflectRectangleNode({
                    id: node.id,
                    name: node.name
                });

                if (altParent) {
                    altNode.parent = altParent;
                }

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
    altNode.width = node.width;
    altNode.height = node.height;
    altNode.rotation = node.rotation;
    altNode.layoutAlign = node.layoutAlign;
}

function convertFrame(altNode: ReflectFrameNode, node: DefaultFrameMixin) {
    altNode.layoutMode = node.layoutMode;
    altNode.counterAxisSizingMode = node.counterAxisSizingMode;

    altNode.paddingLeft = node.horizontalPadding;
    altNode.paddingRight = node.horizontalPadding;
    altNode.paddingTop = node.verticalPadding;
    altNode.paddingBottom = node.verticalPadding;

    altNode.itemSpacing = node.itemSpacing;
    altNode.layoutGrids = node.layoutGrids;
    altNode.gridStyleId = node.gridStyleId;
    altNode.clipsContent = node.clipsContent;
    altNode.guides = node.guides;
}

function convertGeometry(altNode: ReflectGeometryMixin, node: GeometryMixin) {
    altNode.fills = node.fills;
    altNode.strokes = node.strokes;
    altNode.strokeWeight = node.strokeWeight;
    altNode.strokeMiterLimit = node.strokeMiterLimit;
    altNode.strokeAlign = node.strokeAlign;
    altNode.strokeCap = node.strokeCap;
    altNode.strokeJoin = node.strokeJoin;
    altNode.dashPattern = node.dashPattern;
    altNode.fillStyleId = node.fillStyleId;
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
    altNode.cornerRadius = node.cornerRadius;
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
    altNode.textAlignHorizontal = node.textAlignHorizontal;
    altNode.textAlignVertical = node.textAlignVertical;
    altNode.paragraphIndent = node.paragraphIndent;
    altNode.paragraphSpacing = node.paragraphSpacing;
    altNode.fontSize = node.fontSize;
    altNode.fontName = node.fontName;
    altNode.textCase = node.textCase;
    altNode.textDecoration = node.textDecoration;
    altNode.textStyleId = node.textStyleId;
    altNode.letterSpacing = node.letterSpacing;
    altNode.textAutoResize = node.textAutoResize;
    altNode.characters = node.characters;
    altNode.lineHeight = node.lineHeight;
}


