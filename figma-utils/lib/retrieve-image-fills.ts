import type { ImagePaint, Paint } from "@design-sdk/figma-types";
import { isImage } from "./has-image";

export function retrieveImageFills(
  fills: ReadonlyArray<Paint>
): Array<ImagePaint> {
  const imagefills: Array<ImagePaint> = [];
  if (Array.isArray(fills)) {
    const imagePaints: Array<ImagePaint> = fills;
    for (const fill of imagePaints) {
      if (isImage(fill)) {
        imagefills.push(fill);
      }
    }
  }
  return imagefills;
}

export function retrievePrimaryImageFill(
  fills: ReadonlyArray<Paint>
): ImagePaint {
  const images = retrieveImageFills(fills);
  if (images && images.length > 0) {
    return images[0];
  } else {
    throw `no image available in fills`;
  }
}
