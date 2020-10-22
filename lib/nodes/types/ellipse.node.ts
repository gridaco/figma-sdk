import { ReflectSceneNodeType } from ".";
import { ReflectDefaultShapeMixin } from "./mixins";

export class ReflectEllipseNode extends ReflectDefaultShapeMixin {
    get type() {
        return ReflectSceneNodeType.ellipse
    }
}
