import type { BlendMode as FigmaBlendMode } from "@design-sdk/figma-types";
import { BlendMode } from "@reflect-ui/cg";

export function convertBlendModeToReflect(
  figmaBlendMode: FigmaBlendMode | "PASS_THROUGH"
): BlendMode | "PASS_THROUGH" {
  if (figmaBlendMode == "PASS_THROUGH") {
    return "PASS_THROUGH";
  }
  switch (figmaBlendMode) {
    case "COLOR":
      return BlendMode.Color;
    case "COLOR_BURN":
      return BlendMode.ColorBurn;
    case "COLOR_DODGE":
      return BlendMode.ColorDodge;
    case "DARKEN":
      return BlendMode.Darken;
    case "DIFFERENCE":
      return BlendMode.Difference;
    case "EXCLUSION":
      return BlendMode.Exclusion;
    case "HARD_LIGHT":
      return BlendMode.HardLight;
    case "HUE":
      return BlendMode.Hue;
    case "LIGHTEN":
      return BlendMode.Lighten;
    case "LINEAR_BURN":
      return BlendMode.LinearBurn;
    case "LINEAR_DODGE":
      return BlendMode.LinearDodge;
    case "LUMINOSITY":
      return BlendMode.Luminosity;
    case "MULTIPLY":
      return BlendMode.Multiply;
    case "NORMAL":
      return BlendMode.Normal;
    case "OVERLAY":
      return BlendMode.Overlay;
    case "SATURATION":
      return BlendMode.Saturation;
    case "SCREEN":
      return BlendMode.Screen;
    case "SOFT_LIGHT":
      return BlendMode.SoftLight;

    default:
      throw `figma api must been updated. cannot convert figma origin type "BlenMode.${figmaBlendMode}" to reflect typings.`;
      break;
  }
}
