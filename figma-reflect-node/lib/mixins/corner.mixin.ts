import type { BorderRadiusManifest } from "@reflect-ui/core";

export interface IReflectRectangleCornerMixin {
  cornerRadius: BorderRadiusManifest;
  cornerSmoothing: number;
}

export interface IReflectCornerMixin {
  cornerSmoothing: number;
  shapeCornerRadius: number;
}
