import type {
  Paint,
  StrokeCap,
  StrokeJoin,
  VectorPaths,
} from "@design-sdk/figma";

export interface IReflectGeometryMixin {
  fills: ReadonlyArray<Paint> | undefined;
  // TODO: add fillGeometry
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
}
