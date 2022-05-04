import { convertFigmaRemoteEffectsToFigma } from "../converters/effect.convert";
import { convertFigmaRemoteFillsToFigma } from "../converters/fills.convert";
import { convertFigmaRemoteLayoutConstraintsToFigmaConstraints } from "../converters/layout-constraints.convert";
import { convertFigmaRemoteStrokesToFigma } from "../converters/strokes.convert";
import { MappingBlendInput } from "./_in";
import { Transform } from "@design-sdk/figma-remote-types";

type Transform2DMatrix = [[number, number, number], [number, number, number]];

export function blendBaseNode(p: MappingBlendInput) {
  const { target, source } = p;

  // @ts-ignore
  target.id = source.id;
  // @ts-ignore
  target.parentId = p.parent?.id ?? null;
  target.name = source.name;
  target.visible = source.visible ?? true;
  target.opacity = source.opacity ?? 1;
  target.layoutAlign = source.layoutAlign;
  target.layoutGrow = source.layoutGrow ?? 0;
  target.exportSettings = source.exportSettings;
  target.blendMode = source.blendMode ?? "NORMAL";
  target.isMask = source.isMask ?? false;

  if (target.type !== "GROUP") {
    target.strokes = convertFigmaRemoteStrokesToFigma(...source.strokes);
    target.strokeWeight = source.strokeWeight;
    target.strokeAlign = source.strokeAlign;
    target.fills = convertFigmaRemoteFillsToFigma(...source.fills);
    target.constraints = convertFigmaRemoteLayoutConstraintsToFigmaConstraints(
      source.constraints
    );
  }

  target.effects = convertFigmaRemoteEffectsToFigma(...source.effects);

  target.relativeTransform = source.relativeTransform as Transform2DMatrix;
  target.x = source.relativeTransform[0][2];
  target.y = source.relativeTransform[1][2];

  // @ts-ignore
  target.width = source.size.x;
  // @ts-ignore
  target.height = source.size.y;

  // static override --------------------
  target.effectStyleId = undefined;
  // target.removed = false;
  // target.parent = undefined;
  target.locked = false;
  target.constrainProportions = undefined;
  if (target.type !== "GROUP") {
    target.strokeStyleId = undefined;
    target.fillStyleId = undefined;
    target.strokeMiterLimit = undefined;
    target.strokeCap = undefined;
    target.dashPattern = undefined;
    target.strokeJoin = undefined;
  }
  // -------------------------------------

  // reaction are not supported via remote api - https://github.com/gridaco/designto-code/issues/157
  // target.reactions;

  target.rotation = angleFromTransform(source.relativeTransform); // calculate with transform: ;

  // @ts-ignore
  target.absoluteTransform = [
    // TODO: support rotation
    [1, 0, source.absoluteBoundingBox.x],
    [0, 1, source.absoluteBoundingBox.y],
  ]; // calculate with transform
}

/**
 * @deprecated
 */
function xy_as_relative(
  parent: { x: number; y: number },
  child: { x: number; y: number },
  isRoot = false
) {
  if (isRoot) {
    return {
      x: child.x,
      y: child.y,
    };
  }

  return {
    x: child?.x - parent?.x ?? 0,
    y: child?.y - parent?.y ?? 0,
  };
}

function angleFromTransform(transform: Readonly<Transform>): number {
  try {
    const [a, b, c] = transform[0];
    const [d, e, f] = transform[1];
    var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle < 0 ? angle + 360 : angle;
  } catch (e) {
    console.error(e);
    return 0;
  }
}
