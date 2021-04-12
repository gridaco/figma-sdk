import { BorderRadiusManifest } from "@reflect-ui/core/lib/ui/border-radius";
import {
  Axis,
  CrossAxisAlignment,
  MainAxisAlignment,
} from "@reflect-ui/core/lib";
import {
  ReflectGeometryMixin,
  ReflectCornerMixin,
  ReflectBlendMixin,
  ReflectLayoutMixin,
} from "./mixins";

import {
  LayoutGrid,
  Guide,
  Constraints,
  Paint,
  BlendMode,
  StrokeJoin,
  StrokeCap,
  Effect,
} from "../../figma/types/v1";
import { ReflectSceneNode, ReflectSceneNodeType } from "./node-type";
import { ReflectChildrenMixin } from "./base.node";

//#region frame
interface ReflectFrameMixin {
  /**
   * figma: this property is only available when layoutMode != "NONE"
   */
  itemSpacing: number;

  layoutGrids: ReadonlyArray<LayoutGrid>;
  gridStyleId: string;
  clipsContent: boolean;
  guides: ReadonlyArray<Guide>;
}

export class ReflectFrameNode
  extends ReflectChildrenMixin
  implements
    ReflectFrameMixin,
    ReflectGeometryMixin,
    ReflectCornerMixin,
    ReflectBlendMixin,
    ReflectLayoutMixin {
  get type() {
    return ReflectSceneNodeType.frame;
  }

  constraints: Constraints;

  // frame mixin
  layoutGrow: number;
  mainAxisAlignment: MainAxisAlignment;
  crossAxisAlignment: CrossAxisAlignment;
  layoutMode?: Axis | undefined;
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  itemSpacing: number;
  paddingRight: number;
  paddingLeft: number;
  paddingTop: number;
  paddingBottom: number;
  layoutGrids: ReadonlyArray<LayoutGrid>;
  gridStyleId: string;
  clipsContent: boolean;
  guides: ReadonlyArray<Guide>;

  // children mixin
  children: Array<ReflectSceneNode>;
  isRelative?: boolean;

  // geometry mixin
  fills: ReadonlyArray<Paint> | undefined;
  strokes: ReadonlyArray<Paint>;
  strokeWeight: number;
  strokeMiterLimit: number;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  strokeCap: StrokeCap | undefined;
  strokeJoin: StrokeJoin | undefined;
  dashPattern: ReadonlyArray<number>;
  fillStyleId: string | undefined;
  strokeStyleId: string;

  // corner mixin
  cornerRadius: BorderRadiusManifest;
  cornerSmoothing: number;

  // rectangle corner mixin
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;

  // blend mixin
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
  visible: boolean;
  radius: number;

  // layout mixin
  x: number;
  y: number;
  rotation: number; // In degrees
  width: number;
  height: number;
  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";
}
//#endregion
