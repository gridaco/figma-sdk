import type { ArcData } from "@design-sdk/figma-types";
import { ReflectDefaultShapeMixin } from "./mixins";
import { ReflectSceneNodeType } from "./node-type";

export class ReflectEllipseNode extends ReflectDefaultShapeMixin {
  readonly type: ReflectSceneNodeType.ellipse = ReflectSceneNodeType.ellipse;

  arcData: ArcData;
}
