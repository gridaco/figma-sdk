import { ReflectBaseNode } from "../base.node";
import { ReflectSceneNodeType } from "../node-type";
import { LCRS, getNodeActualLCRS, getReletiveLCRS } from "../../../utils/lcrs";
import type { ReflectSceneNode } from "../node-type-alias";

export class ReflectConstraintMixin extends ReflectBaseNode {
  // @ts-ignore
  get type() {
    return ReflectSceneNodeType.constraint;
  }
  constraints: Constraints;

  /**
   * the current node's constraint LCRS positioning. as is.
   */
  get constraintLcrs(): LCRS {
    return getNodeActualLCRS(this);
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
