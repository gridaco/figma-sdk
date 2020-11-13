import { ReflectFrameNode, ReflectGroupNode, ReflectRectangleNode, ReflectEllipseNode, ReflectTextNode, ReflectLineNode, ReflectConstraintMixin, ReflectChildrenMixin } from ".";

export type ReflectSceneNode =
    | ReflectFrameNode
    | ReflectGroupNode
    | ReflectRectangleNode
    | ReflectEllipseNode
    | ReflectTextNode
    | ReflectLineNode
    | ReflectConstraintMixin
    | ReflectChildrenMixin
// TODO
// | StarNode
// | LineNode
// | PolygonNode;

export enum ReflectSceneNodeType {
    group = "GROUP",
    component = "COMPONENT", // this should be not a type, but a property
    variant = "COMPONENT_SET", // this should be not a type, but a property
    constraint = "CONSTRAINT",
    instance = "INSTANCE", // this should be not a type, but a property
    text = "TEXT",
    frame = "FRAME",
    ellipse = "ELLIPSE",
    rectangle = "RECTANGLE",
    line = "LINE",
    vector = "VECTOR",
    image = "IMAGE",
    unknown = "UNKNOWN"
}