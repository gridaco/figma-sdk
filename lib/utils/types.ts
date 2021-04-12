import {
  FrameNode,
  ComponentNode,
  InstanceNode,
  VectorNode,
  StarNode,
  LineNode,
  EllipseNode,
  PolygonNode,
  RectangleNode,
  TextNode,
} from "../figma/types/v1";

export type ConstraintNode =
  | FrameNode
  | ComponentNode
  | InstanceNode
  | VectorNode
  | StarNode
  | LineNode
  | EllipseNode
  | PolygonNode
  | RectangleNode
  | TextNode;
