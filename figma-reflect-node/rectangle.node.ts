import {
  ReflectDefaultShapeMixin,
  IReflectRectangleCornerMixin,
} from "./mixins";
import { ReflectSceneNodeType } from "./node-type";

export class ReflectRectangleNode
  extends ReflectDefaultShapeMixin
  implements IReflectRectangleCornerMixin {
  type = ReflectSceneNodeType.rectangle;
}
