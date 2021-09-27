import { FigmaBooleanOpeartionType } from "@design-sdk/figma-types";
import { IReflectCornerMixin, ReflectDefaultShapeMixin } from "./mixins";
import { ReflectSceneNodeType } from "./node-type";
import type { ReflectSceneNode } from "./node-type-alias";

export class ReflectBooleanOperationNode
  extends ReflectDefaultShapeMixin
  implements IReflectCornerMixin {
  readonly type = ReflectSceneNodeType.boolean_operation;

  // --------------- BOOL OP -----------------
  booleanOperation: FigmaBooleanOpeartionType;
  shapeCornerRadius: number;
  cornerSmoothing: number;

  /**
   * @deprecated - this exists on plugin typings, but no document is available. update this property's doc later.
   * https://www.figma.com/plugin-docs/api/BooleanOperationNode/
   */
  expanded: boolean;
  // --------------- BOOL OP -----------------

  children: Array<ReflectSceneNode> = [];
}
