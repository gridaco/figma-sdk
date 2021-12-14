import { convertFigmaRemoteEffectsToFigma } from "../converters/effect.convert";
import { convertFigmaRemoteFillsToFigma } from "../converters/fills.convert";
import { convertFigmaRemoteLayoutConstraintsToFigmaConstraints } from "../converters/layout-constraints.convert";
import { convertFigmaRemoteStrokesToFigma } from "../converters/strokes.convert";
import { MappingBlendInput } from "./_in";
import { Transform } from "@design-sdk/figma-remote-types";
export function blendBaseNode(p: MappingBlendInput) {
  const { target, source } = p;
  target.id = source.id;
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

  target.relativeTransform = source.relativeTransform as [
    [number, number, number],
    [number, number, number]
  ];

  // for some reason, xywh is not available for some node types by figma rem api.
  const xy = xy_as_relative(
    p?.parent?.absoluteBoundingBox,
    source.absoluteBoundingBox,
    p?.parent === undefined
  );
  target.x = xy.x; // this is converted to relative position.
  target.y = xy.y; // this is converted to relative position.
  target.width = source.absoluteBoundingBox.width;
  target.height = source.absoluteBoundingBox.height;

  // static override
  target.effectStyleId = undefined;
  target.removed = false;
  target.locked = false;
  target.parent = undefined;
  target.constrainProportions = undefined;
  target.layoutGrow = undefined;
  if (target.type !== "GROUP") {
    target.strokeStyleId = undefined;
    target.fillStyleId = undefined;
    target.strokeMiterLimit = undefined;
    target.strokeCap = undefined;
    target.dashPattern = undefined;
    target.strokeJoin = undefined;
  }

  // TODO:
  target.reactions = undefined;
  target.rotation = angleFromTransform(source.relativeTransform); // calculate with transform: ;
  // TODO: use  `source.relativeTransform`
  target.absoluteTransform = [
    [1, 0, 0],
    [0, 1, 0],
  ]; // calculate with transform
}

function xy_as_relative(
  parent: { x: number; y: number },
  child: { x: number; y: number },
  isRoot = false
) {
  if (isRoot) {
    return {
      x: 0,
      y: 0,
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
