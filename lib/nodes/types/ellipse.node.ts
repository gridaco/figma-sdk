import { ReflectDefaultShapeMixin } from "./mixins";
import { ReflectSceneNodeType } from "./node-type";

export class ReflectEllipseNode extends ReflectDefaultShapeMixin {
  get type() {
    return ReflectSceneNodeType.ellipse;
  }
}
