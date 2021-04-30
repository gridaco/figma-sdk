import { FontWeight } from "@reflect-ui/core";

// Convert generic named weights to numbers, which is the way tailwind understands
export function convertFontWeightToReflect(weight: string): FontWeight {
  weight = weight?.toLowerCase();
  switch (weight) {
    case "thin":
      return FontWeight.w100;
    case "extra light":
      return FontWeight.w200;
    case "light":
      return FontWeight.w300;
    case "regular":
      return FontWeight.w400;
    case "medium":
      return FontWeight.w500;
    case "semi bold":
      return FontWeight.w600;
    case "semibold":
      return FontWeight.w600;
    case "bold":
      return FontWeight.w700;
    case "extra bold":
      return FontWeight.w800;
    case "heavy":
      return FontWeight.w800;
    case "black":
      return FontWeight.w900;
    default:
      console.warn(
        `"${weight}" not handled properly. converting it as regular instead.`
      );
      return FontWeight.w400;
  }
}
