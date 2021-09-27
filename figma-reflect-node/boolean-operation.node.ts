import { FigmaBooleanOpeartionType } from "@design-sdk/figma-types";
import { ReflectBaseNode } from "./base.node";
import { ReflectSceneNodeType } from "./node-type";
import type { ReflectSceneNode } from "./node-type-alias";

export class ReflectBooleanOperationNode extends ReflectBaseNode {
  readonly type: ReflectSceneNodeType.boolean_operation =
    ReflectSceneNodeType.boolean_operation;

  booleanOperation: FigmaBooleanOpeartionType;

  /**
   * @deprecated - this exists on plugin typings, but no document is available. update this property's doc later.
   * https://www.figma.com/plugin-docs/api/BooleanOperationNode/
   */
  expanded: boolean;

  children: Array<ReflectSceneNode> = [];
  cornerRadius: number;
  cornerSmoothing: number;
}
