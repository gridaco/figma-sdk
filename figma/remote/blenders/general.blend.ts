import { convertFigmaRemoteEffectsToFigma } from "../converters/effect.convert";
import { convertFigmaRemoteFillsToFigma } from "../converters/fills.convert";
import { convertFigmaRemoteLayoutConstraintsToFigmaConstraints } from "../converters/layout-constraints.convert";
import { convertFigmaRemoteStrokesToFigma } from "../converters/strokes.convert";
import { MappingBlendInput } from "./_in";

export function blendBaseNode(p: MappingBlendInput) {
  const { target, source } = p;
  target.id = source.id;
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
  target.x = source.absoluteBoundingBox.x;
  target.y = source.absoluteBoundingBox.y;
  target.width = source.absoluteBoundingBox.width;
  target.height = source.absoluteBoundingBox.height;
  // target.width = source.size.x;
  // target.height = source.size.y;

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

  // TODO
  target.reactions = undefined;
  target.rotation = 0; // calculate with transform
  target.absoluteTransform = [
    [1, 0, 0],
    [0, 1, 0],
  ]; // calculate with transform
}
