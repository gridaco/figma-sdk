import { ReflectFrameNode, ReflectGroupNode, ReflectRectangleNode, ReflectEllipseNode, ReflectTextNode, ReflectLineNode, ReflectComponentNode, ReflectInstanceNode, ReflectConstraintMixin, ReflectChildrenMixin } from ".";

export type ReflectSceneNode =
    | ReflectFrameNode
    | ReflectGroupNode
    | ReflectRectangleNode
    | ReflectEllipseNode
    | ReflectTextNode
    | ReflectLineNode
    | ReflectComponentNode
    | ReflectInstanceNode
    | ReflectConstraintMixin
    | ReflectChildrenMixin
// TODO
// | StarNode
// | LineNode
// | PolygonNode;

export enum ReflectSceneNodeType {
    group = "GROUP",
    component = "COMPONENT",
    constraint = "CONSTRAINT",
    instance = "INSTANCE",
    text = "TEXT",
    frame = "FRAME",
    ellipse = "ELLIPSE",
    rectangle = "RECTANGLE",
    line = "LINE",
}