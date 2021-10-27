import { Paint as RemPaint } from "@design-sdk/figma-remote-types";
import {
  Paint,
  SolidPaint,
  GradientPaint,
  ImagePaint,
} from "@design-sdk/figma-types";

/**
 * from: https://www.figma.com/developers/api#paint-type
 *
 * to: https://www.figma.com/plugin-docs/api/Paint/
 * @param remPaint
 * @returns
 */
export function figmaRemotePaintToFigma(remPaint: RemPaint): Paint {
  // when visible is not provided by api, it's true by default.
  const _visible = remPaint.visible ?? true;
  // when opacity is not provided by api, it's 1(100%) by default.
  const _opacity = remPaint.opacity ?? 1;

  switch (remPaint.type) {
    case "EMOJI":
      console.warn("type EMOJI cannot be handled on converter");
      return undefined;
      break;

    case "GRADIENT_ANGULAR":
    case "GRADIENT_DIAMOND":
    case "GRADIENT_LINEAR":
    case "GRADIENT_RADIAL":
      return <GradientPaint>{
        type: remPaint.type,
        // FIXME: STATIC OVERRIDE
        gradientTransform: [
          [1, 0, 0],
          [0, 1, 0],
        ], // remPaint.gradientHandlePositions, TODO
        gradientStops: remPaint.gradientStops,
        visible: _visible,
        opacity: _opacity,
        blendMode: remPaint.blendMode,
      };
      break;

    case "IMAGE":
      return <ImagePaint>{
        type: "IMAGE",
        scaleMode: remPaint.scaleMode,
        imageHash: remPaint.imageRef,
        imageTransform: remPaint.imageTransform,
        scalingFactor: remPaint.scalingFactor,
        // FILTER NOT SUPPORTED
        visible: _visible,
        opacity: _opacity,
        blendMode: remPaint.blendMode,
      };
      break;

    case "SOLID":
      return <SolidPaint>{
        type: "SOLID",
        color: remPaint.color,
        visible: _visible,
        opacity: _opacity,
        blendMode: remPaint.blendMode,
      };
      break;

    default:
      throw `cannot handle input ${JSON.stringify(remPaint, null, 2)}`;
      break;
  }
}
