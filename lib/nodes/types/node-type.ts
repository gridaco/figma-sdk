import { ReflectChildrenMixin, ReflectConstraintMixin } from "./base.node";
import { ReflectEllipseNode } from "./ellipse.node";
import { ReflectFrameNode } from "./frame.node";
import { ReflectGroupNode } from "./group.node";
import { ReflectLineNode } from "./line.node";
import { ReflectRectangleNode } from "./rectangle.node";
import { ReflectTextNode } from "./text.node";

export type ReflectSceneNode =
  | ReflectFrameNode
  | ReflectGroupNode
  | ReflectRectangleNode
  | ReflectEllipseNode
  | ReflectTextNode
  | ReflectLineNode
  | ReflectConstraintMixin
  | ReflectChildrenMixin;
// TODO
// | StarNode
// | LineNode
// | PolygonNode;

export enum ReflectSceneNodeType {
  group = "GROUP",
  component = "COMPONENT", // this should be not a type, but a property
  // TODO: consider renaming to variant-set. the name variant is ambigious
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
  unknown = "UNKNOWN",
}
