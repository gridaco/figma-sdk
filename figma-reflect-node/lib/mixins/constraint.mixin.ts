import { ReflectBaseNode } from "../base.node";
import {
  LCRS,
  getNodeActualLCRS,
  getReletiveLCRS,
} from "@design-sdk/figma-utils";
import type { ReflectSceneNode } from "../node-type-alias";

// FIXME - migrate this to reflect core cg
import type { Constraints } from "@design-sdk/figma-types";
export interface IReflectConstraintMixin {
  constraints: Constraints;
}

export class ReflectConstraintMixin
  extends ReflectBaseNode
  implements IReflectConstraintMixin
{
  constraints: Constraints;

  /**
   * the current node's constraint LCRS positioning. as is.
   */
  get constraintLcrs(): LCRS {
    return getNodeActualLCRS(this as any);
  }

  /**
   * the cureent node's visual LCRS positioning actually relative to parent.
   */
  get relativeLcrs(): LCRS {
    return getReletiveLCRS(this, this.parent);
  }

  getRelativeToLcrs(to: ReflectSceneNode) {
    // TODO add validation if 'to' node is somewhere on the parent tree of this node
    return getReletiveLCRS(this, to);
  }
}
