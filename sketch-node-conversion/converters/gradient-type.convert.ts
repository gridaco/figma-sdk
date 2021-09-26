import { GradientType as SketchGradientType } from "@design-sdk/sketch-types";
import { GradientType } from "@reflect-ui/core/lib/gradient/gradient.manifest";

export function sketch_gradient_type_to_reflect_gradient_type(
  g: SketchGradientType
): GradientType {
  switch (g) {
    case SketchGradientType.Linear:
      return GradientType.LINEAR;
    case SketchGradientType.Radial:
      return GradientType.RADIAL;
    case SketchGradientType.Angular:
      return GradientType.ANGULAR;
    default:
      throw new Error(`Unknown sketch gradient type: ${g}`);
  }
}
