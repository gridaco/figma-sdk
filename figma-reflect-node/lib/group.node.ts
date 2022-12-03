import { ReflectChildrenMixin } from "./mixins/children.mixin";
import type { IReflectBlendMixin, IReflectLayoutMixin } from "./mixins";
import type { ReflectSceneNode } from "./node-type-alias";
import type { BlendMode } from "@reflect-ui/cg";
import type {
  // FIXME: - migrate this
  Effect,
  FigmaLayoutGrow,
  FigmaLayoutAlign,
} from "@design-sdk/figma-types";
import { ReflectSceneNodeType } from "./node-type";
import { types } from "@reflect-ui/uiutils";

//#region group node
export class ReflectGroupNode
  extends ReflectChildrenMixin
  implements ReflectChildrenMixin, IReflectBlendMixin, IReflectLayoutMixin
{
  readonly type: ReflectSceneNodeType.group = ReflectSceneNodeType.group;

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
  layoutAlign: FigmaLayoutAlign;
  layoutGrow: FigmaLayoutGrow;

  children: Array<ReflectSceneNode>;
}

//#endregion
