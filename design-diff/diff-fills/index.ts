import { Figma } from "@design-sdk/figma-types";
import assert from "assert";
import { same_typeof } from "../diff-utils";

type Fills = ReadonlyArray<Figma.Paint>;

interface FillsDiff {
  type: "fills";
  values: any[];
  diff: boolean;
}

interface PaintDiff {
  type: "paint";
  values: any[];
  diff: boolean;
}

export function fills(a: Fills, b: Fills): FillsDiff {
  if (!same_typeof(a, b)) {
    return {
      type: "fills",
      values: [a, b],
      diff: true,
    };
  }

  const diffs = [];
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const aFill = a[i];
    const bFill = b[i];
    diffs.push(paint(aFill, bFill));
  }

  return {
    type: "fills",
    values: diffs,
    diff: diffs.some((d) => d.diff === true),
  };
}

export function paint(a: Figma.Paint, b: Figma.Paint): PaintDiff {
  if (!same_typeof(a, b)) {
    return {
      type: "paint",
      values: [a, b],
      diff: true,
    };
  }

  if (a.type !== b.type) {
    return {
      type: "paint",
      diff: true,
      values: [a.type, b.type],
    };
  } else {
    switch (a.type) {
      case "GRADIENT_ANGULAR":
        break;
      case "GRADIENT_DIAMOND":
        break;
      case "GRADIENT_LINEAR":
        break;
      case "GRADIENT_RADIAL":
        break;
      case "IMAGE":
        break;
      case "SOLID":
        assert(a.type === b.type);
        if (
          a.color.r !== b.color.r ||
          a.color.g !== b.color.g ||
          a.color.b !== b.color.b
        ) {
          return {
            type: "paint",
            diff: true,
            values: [a.color, b.color],
          };
        }
    }
  }
  return {
    type: "paint",
    diff: false,
    values: [a, b],
  };
}
