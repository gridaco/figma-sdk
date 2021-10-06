import { MappingNode } from "../mapper/mapping-instance";
import {
  Frame,
  Group,
  Vector,
  Star,
  Line,
  Ellipse,
  BooleanGroup,
  Text,
  RegularPolygon,
  Rectangle,
  Component,
  Instance,
} from "@design-sdk/figma-remote-types";

/**
 * Type like Node, but without
 */
export type MappableNode =
  | Frame
  | Group
  | Vector
  | Star
  | Line
  | Ellipse
  | RegularPolygon
  | Rectangle
  | Text
  | BooleanGroup
  | Component
  | RegularPolygon
  | Instance;

export type MappingBlendInput<T = MappingNode, S = MappableNode> = {
  target: T;
  source: S;
  parent?: MappableNode;
};
