import type { ReflectEllipseNode } from "./ellipse.node";
import type { ReflectFrameNode } from "./frame.node";
import type { ReflectGroupNode } from "./group.node";
import type { ReflectLineNode } from "./line.node";
import type { ReflectRectangleNode } from "./rectangle.node";
import type { ReflectTextNode } from "./text.node";
import type { ReflectVectorNode } from ".";
import type { ReflectBooleanOperationNode } from "./boolean-operation.node";

type ReflectSceneNode =
  | ReflectFrameNode
  | ReflectGroupNode
  | ReflectRectangleNode
  | ReflectEllipseNode
  | ReflectVectorNode
  | ReflectTextNode
  | ReflectLineNode
  | ReflectBooleanOperationNode;
// TODO
// | StarNode
// | PolygonNode;

export type { ReflectSceneNode };
