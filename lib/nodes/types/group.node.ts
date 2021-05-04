import { BlendMode, Effect } from "../../figma/types/v1";
import { types } from "@reflect-ui/uiutils";
import { ReflectChildrenMixin } from "./mixins/children.mixin";
import { IReflectBlendMixin, IReflectLayoutMixin } from "./mixins";
import { ReflectSceneNodeType } from "./node-type";
import { ReflectSceneNode } from "./node-type-alias";

//#region group node
export class ReflectGroupNode
  extends ReflectChildrenMixin
  implements ReflectChildrenMixin, IReflectBlendMixin, IReflectLayoutMixin {
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: readonly Effect[];
  effectStyleId: string;
  visible: boolean;
  radius: number;
  absoluteTransform: types.Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  layoutAlign: "CENTER" | "MIN" | "MAX" | "STRETCH" | "INHERIT";
  layoutGrow: "FIXED" | "STRETCH";

  type = ReflectSceneNodeType.group;

  children: Array<ReflectSceneNode>;
}

//#endregion
