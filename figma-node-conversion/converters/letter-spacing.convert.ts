import type { TextNode, LetterSpacing } from "@design-sdk/figma-types";
import { plugin } from "@design-sdk/figma-types";

export function convertLetterSpacingToReflect(
  origin: LetterSpacing,
  node?: TextNode
): LetterSpacing {
  if (origin && Math.round(origin.value) !== 0) {
    if (origin.unit === "PIXELS") {
      return origin;
    } else {
      if (node) {
        if (node.fontSize !== plugin.mixed) {
          // read [commonLineHeight] comment to understand what is going on here.
          const _value =
            ((node.fontSize as number) *
              ((node.letterSpacing as LetterSpacing).value as number)) /
            100;

          return {
            ...origin,
            value: _value,
          };
        }
      }
    }
  }

  // default
  return {
    value: 0,
    unit: "PIXELS",
  };
}
