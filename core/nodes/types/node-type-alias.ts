import type { ReflectChildrenMixin } from "./mixins/children.mixin";
import type { ReflectConstraintMixin } from "./mixins/constraint.mixin";
import type { ReflectEllipseNode } from "./ellipse.node";
import type { ReflectFrameNode } from "./frame.node";
import type { ReflectGroupNode } from "./group.node";
import type { ReflectLineNode } from "./line.node";
import type { ReflectRectangleNode } from "./rectangle.node";
import type { ReflectTextNode } from "./text.node";

type ReflectSceneNode =
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

export type { ReflectSceneNode };
