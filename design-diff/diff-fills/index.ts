import { Figma } from "@design-sdk/figma-types";
import assert from "assert";
import { same_typeof } from "../diff-utils";
import type { IDiff, ITypeDiff } from "../_types";

type Fills = ReadonlyArray<Figma.Paint>;
type FillsDiffs = Array<FillDiff>;

type FillDiffLike = Array<
  { type: "paint"; diff: true; values: [Figma.Paint, Figma.Paint] } | FillDiff
>;

export interface FillsDiff extends IDiff<FillDiffLike> {
  type: "fills";
  values: [FillDiffLike, FillDiffLike];
  diff: boolean;
}

type FillDiff = SolidPaintDiff | ImagePaintDiff | PaintTypeDiff;

interface PaintTypeDiff extends ITypeDiff<Figma.Paint["type"]> {
  type: "paint-type";
  diff: boolean;
}

interface SolidPaintDiff extends IDiff<Figma.SolidPaint> {
  type: "solid-paint";
  diff: boolean;
  values: [Figma.SolidPaint, Figma.SolidPaint];
}

interface ImagePaintDiff extends IDiff<Figma.ImagePaint> {
  type: "image-paint";
  diff: boolean;
  values: [Figma.ImagePaint, Figma.ImagePaint];
}

export function fills(a: Fills, b: Fills): FillsDiff {
  if (!same_typeof(a, b)) {
    return {
      type: "fills",
      values: [a as any, b as any],
      diff: true,
    };
  }

  if (a.length !== b.length) {
    return {
      type: "fills",
      values: [a as any, b as any],
      diff: true,
    };
  }

  const diffs: [FillDiffLike, FillDiffLike] = [[], []];
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const aFill = a[i];
    const bFill = b[i];
    if (aFill.type === bFill.type) {
      const filldiff = fill(aFill, bFill);
      if (filldiff.diff) {
        diffs[0].push(filldiff);
        // diffs[1].push(bFill);
      }
      diffs.push();
    } else {
      diffs[0][i] = { type: "paint", diff: true, values: [aFill, bFill] };
      // diffs[1][i] = b;
    }
  }

  return {
    type: "fills",
    values: diffs,
    diff: diffs.some((d) => d.some((dd) => dd.diff === true)),
  };
}

export function fill(a: Figma.Paint, b: Figma.Paint): FillDiff {
  if (a.type !== b.type) {
    return {
      type: "paint-type",
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
        assert(a.type === b.type);
        if (a.imageHash === b.imageHash) {
          return {
            type: "image-paint",
            diff: false,
            values: [a, b],
          };
        } else {
          return {
            type: "image-paint",
            diff: true,
            values: [a, b],
          };
        }
        break;
      case "SOLID":
        assert(a.type === b.type);
        if (
          a.color.r !== b.color.r ||
          a.color.g !== b.color.g ||
          a.color.b !== b.color.b
        ) {
          return {
            type: "solid-paint",
            diff: true,
            values: [a, b],
          };
        }
    }
  }

  return {
    type: undefined,
    diff: false,
    values: [a as any, b as any],
  };
}
