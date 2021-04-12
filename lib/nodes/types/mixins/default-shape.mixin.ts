import { ReflectConstraintMixin } from "../base.node";
import { ReflectCornerMixin } from "./corner.mixin";
import { ReflectGeometryMixin } from "./geometry.mixin";
import { ReflectLayoutMixin } from "./layout.mixin";

import {
  Paint,
  BlendMode,
  Effect,
  StrokeCap,
  StrokeJoin,
} from "../../../figma/types/v1";
import { BorderRadiusManifest } from "@reflect-ui/core/lib/ui/border-radius";

export class ReflectDefaultShapeMixin
  extends ReflectConstraintMixin
  implements ReflectGeometryMixin, ReflectCornerMixin, ReflectLayoutMixin {
  layoutGrow: number;
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
  visible: boolean;
  radius: number;

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

  cornerRadius: BorderRadiusManifest;
  cornerSmoothing: number;

  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";
}
