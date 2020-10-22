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

    // base node mixin
    id: string;
    parent: (ReflectSceneNode & ReflectChildrenMixin) | null;
    name: string;
    readonly pluginData: { [key: string]: string };

    // children mixin
    children: Array<ReflectSceneNode>;
    isRelative?: boolean;

    // blend mixin
    opacity: number;
    blendMode: "PASS_THROUGH" | BlendMode;
    isMask: boolean;
    effects: ReadonlyArray<Effect>;
    effectStyleId: string;
    visible: boolean;
    radius: number;

    // layout mixin
    x: number;
    y: number;
    rotation: number;
    width: number;
    height: number;
    layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH";

}

//#endregion