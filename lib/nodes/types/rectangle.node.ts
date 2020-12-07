import { ReflectSceneNodeType } from ".";
import { ReflectDefaultShapeMixin, ReflectCornerMixin } from "./mixins";

export class ReflectRectangleNode extends ReflectDefaultShapeMixin implements
    ReflectCornerMixin {

    get type() {
        return ReflectSceneNodeType.rectangle
    }
}
