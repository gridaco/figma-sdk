import { ReflectChildrenMixin } from "./base.node";
import { ReflectBlendMixin, ReflectLayoutMixin } from "./mixins";
import { ReflectSceneNode, ReflectSceneNodeType } from "./node-type";

//#region group node
export class ReflectGroupNode
  extends ReflectChildrenMixin
  implements ReflectChildrenMixin, ReflectBlendMixin, ReflectLayoutMixin {
  get type() {
    return ReflectSceneNodeType.group;
  }

  children: Array<ReflectSceneNode>;
}

//#endregion
