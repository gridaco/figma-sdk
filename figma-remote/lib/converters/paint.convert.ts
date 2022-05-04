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
 * converts the handles data (3 items of Vector2 - x, y) to affine transform data ([[f, f, f], [f, f, f]])
 *
 * for example, if the handles data is: [{x: 0.5, y: 0}, {x: 0.5, y: 1}, ??], it means the gradient direction is top to bottom, which the affine transform data is: [[0, 1, 0], [-1, 0, 1]]
 * The identity transform is [[1, 0, 0], [0, 1, 0]].
 *
 * - The x axis (t[0][0], t[1][0])
 * - The y axis (t[0][1], t[1][1])
 * - The translation offset (t[0][2], t[1][2])
 *
 * and a rotation matrix will typically look like:
 * ```
 * [[cos(angle), sin(angle), 0],
 * [-sin(angle), cos(angle), 0]]
 * ```
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
  // TODO: We're note sure if this is the correct transformation of the data. (linear works exept, tx, ty)
  // Only supports linear-gradient perfectly. (radial, angular, diamond required additional data to be handled - the [2] of the handles, which indicates the width of the gradient)

  const _x = handles[0].x;
  const _y = handles[0].y;
  const _x2 = handles[1].x;
  const _y2 = handles[1].y;

  const angle = Math.atan2(_y2 - _y, _x2 - _x);

  // make the affine transform data
  const _affine_transform: Transform = [
    // _x, _y assignment does not match the figma plugin ver, but it's enough to represent the angle.
    // the angle value is accurate.
    [Math.cos(angle), Math.sin(angle), _x],
    [-Math.sin(angle), Math.cos(angle), _y],
  ];

  return _affine_transform;
}
