import { ReflectConstraintMixin } from "./constraint.mixin";

import type { BorderRadiusManifest } from "@reflect-ui/core";
import type { IReflectDefaultShapeMixin } from "../interfaces/default-shape-mixin";
import type { BlendMode } from "@reflect-ui/core/lib/cg/filters";

// FIXME - migrate this
import type {
  Paint,
  Effect,
  StrokeCap,
  StrokeJoin,
  FimgaLayoutAlign,
  VectorPaths,
} from "@design-sdk/figma-types";
import { FigmaLayoutGrow } from "@design-sdk/figma-types";

export class ReflectDefaultShapeMixin
  extends ReflectConstraintMixin
  implements IReflectDefaultShapeMixin
{
  layoutGrow: FigmaLayoutGrow;
  layoutAlign: FimgaLayoutAlign;
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
  strokeGeometry: VectorPaths;
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
}
