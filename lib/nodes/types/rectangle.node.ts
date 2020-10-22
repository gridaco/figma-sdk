import { ReflectSceneNodeType } from ".";
import { ReflectDefaultShapeMixin, ReflectCornerMixin, ReflectRectangleCornerMixin } from "./mixins";

export class ReflectRectangleNode extends ReflectDefaultShapeMixin implements
    ReflectCornerMixin,
    ReflectRectangleCornerMixin {

    get type() {
        return ReflectSceneNodeType.rectangle
    }
}
