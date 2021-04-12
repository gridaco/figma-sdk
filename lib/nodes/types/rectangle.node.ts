import { ReflectDefaultShapeMixin, ReflectCornerMixin } from "./mixins";
import { ReflectSceneNodeType } from "./node-type";

export class ReflectRectangleNode
  extends ReflectDefaultShapeMixin
  implements ReflectCornerMixin {
  get type() {
    return ReflectSceneNodeType.rectangle;
  }
}
