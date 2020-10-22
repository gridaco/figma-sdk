import { ReflectSceneNodeType } from ".";
import { ReflectDefaultShapeMixin } from "./mixins";

export class ReflectLineNode extends ReflectDefaultShapeMixin {
    get type() {
        return ReflectSceneNodeType.line
    }
}