// FIXME - migrate this
import { Paint } from "@design-sdk/figma";

/**
 * check if rect, elipes, or frame contains image based on its fills.
 * @param fills
 */
export function hasImage(fills: ReadonlyArray<Paint>): boolean {
  if (Array.isArray(fills)) {
    return fills.some((el) => {
      return isImage(el);
    });
  }
  return false;
}

/**
 * returns true if fill is visible and type of image. if fill is invisible, always returns false
 * @param fill
 */
export function isImage(fill: Paint) {
  return fill.visible && fill.type === "IMAGE";
}
