import { ReflectSceneNodeType, ReflectSceneNode } from ".";
import { ReflectChildrenMixin, ReflectBlendMixin, ReflectLayoutMixin } from "./mixins";


//#region group node
export class ReflectGroupNode
    extends ReflectChildrenMixin implements
    ReflectChildrenMixin,
    ReflectBlendMixin,
    ReflectLayoutMixin {
    get type() {
        return ReflectSceneNodeType.group
    }

    children: Array<ReflectSceneNode>;
}

//#endregion