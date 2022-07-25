import type { BorderRadiusManifest } from "@reflect-ui/core";
import type {
  Axis,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisAlignment,
} from "@reflect-ui/core";
import type {
  IReflectGeometryMixin,
  IReflectRectangleCornerMixin,
  IReflectBlendMixin,
  IReflectLayoutMixin,
} from "./mixins";

// FIXME - migrate this to reflect core
import type {
  LayoutGrid,
  Guide,
  Constraints,
  Paint,
  StrokeJoin,
  StrokeCap,
  Effect,
  Transform,
  FimgaLayoutAlign,
  FigmaLayoutGrow,
  FigmaPrimaryAxisSizingMode,
  FigmaCounterAxisSizingMode,
  VectorPaths,
} from "@design-sdk/figma-types";
import type { ReflectSceneNode } from "./node-type-alias";
import type { BlendMode } from "@reflect-ui/cg";
import { ReflectChildrenMixin } from "./mixins/children.mixin";
import { ReflectSceneNodeType } from "./node-type";
import { checkIfAutoLayout } from "@design-sdk/figma-utils";

//#region frame
interface IReflectFrameMixin {
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
    IReflectFrameMixin,
    IReflectGeometryMixin,
    IReflectRectangleCornerMixin,
    IReflectBlendMixin,
    IReflectLayoutMixin
{
  readonly type: ReflectSceneNodeType.frame = ReflectSceneNodeType.frame;

  absoluteTransform: Transform;

  constraints: Constraints;

  // frame mixin
  layoutGrow: FigmaLayoutGrow;
  mainAxisAlignment: MainAxisAlignment;
  crossAxisAlignment: CrossAxisAlignment;
  layoutMode?: Axis | undefined;
  primaryAxisSizingMode: FigmaPrimaryAxisSizingMode;
  counterAxisSizingMode: FigmaCounterAxisSizingMode;
  itemSpacing: number;
  padding: EdgeInsets;
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
  strokeGeometry: VectorPaths;
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
  layoutAlign: FimgaLayoutAlign;

  get isAutoLayout(): boolean {
    return checkIfAutoLayout(this);
  }
}
//#endregion
