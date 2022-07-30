import { ReflectDefaultShapeMixin } from "./mixins";
import { ReflectSceneNodeType } from "./node-type";

export class ReflectLineNode extends ReflectDefaultShapeMixin {
  readonly type: ReflectSceneNodeType.line = ReflectSceneNodeType.line;
}
