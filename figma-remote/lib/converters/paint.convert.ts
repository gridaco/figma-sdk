import type {
  Paint as RemPaint,
  Vector2,
} from "@design-sdk/figma-remote-types";
import type {
  Paint,
  SolidPaint,
  GradientPaint,
  ImagePaint,
  Transform,
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
        gradientTransform: _map_gradient_transform(
          remPaint.gradientHandlePositions
        ),
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

/**
 *
 * converts the handles data (3 items of Vector2 - x, y) to transform data ([[f, f, f], [f, f, f]])
 *
 * > description from figma api docs (not plugin, the remote api.):
 *
 * handles:
 * This field contains three vectors, each of which are a position in
 * normalized object space (normalized object space is if the top left
 * corner of the bounding box of the object is (0, 0) and the bottom
 * right is (1,1)). The first position corresponds to the start of the
 * gradient (value 0 for the purposes of calculating gradient stops),
 * the second position is the end of the gradient (value 1), and the
 * third handle position determines the width of the gradient (only
 * relevant for non-linear gradients).
 * @param handles = GradientPaint#gradientHandlePositions
 * @returns
 */
function _map_gradient_transform(handles: ReadonlyArray<Vector2>): Transform {
  // TODO: We're note sure if this is the correct transformation of the data.

  const _x = handles[0].x;
  const _y = handles[0].y;
  const _x2 = handles[1].x;
  const _y2 = handles[1].y;
  const _x3 = handles[2].x;
  const _y3 = handles[2].y;

  return [
    [_x, _y, _x2 - _x],
    [_y2 - _y, _x3 - _x2, _y3 - _y2],
  ];
}
