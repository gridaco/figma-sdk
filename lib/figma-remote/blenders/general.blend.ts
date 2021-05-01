import { convertFigmaRemoteEffectsToFigma } from "../converters/effect.convert";
import { convertFigmaRemoteFillsToFigma } from "../converters/fills.convert";
import { convertFigmaRemoteLayoutConstraintsToFigmaConstraints } from "../converters/layout-constraints.convert";
import { convertFigmaRemoteStrokesToFigma } from "../converters/strokes.convert";
import { MappingBlendInput } from "./_in";

export function blendBaseNode(p: MappingBlendInput) {
  const { target, source } = p;
  target.id = source.id;
  target.name = source.name;
  target.visible = source.visible;
  target.layoutAlign = source.layoutAlign;

  target.strokes = convertFigmaRemoteStrokesToFigma(...source.strokes);
  target.fills = convertFigmaRemoteFillsToFigma(...source.fills);
  target.effects = convertFigmaRemoteEffectsToFigma(...source.effects);

  target.relativeTransform = source.relativeTransform as [
    [number, number, number],
    [number, number, number]
  ];

  target.constraints = convertFigmaRemoteLayoutConstraintsToFigmaConstraints(
    source.constraints
  );

  // for some reason, xywh is not available for some node types by figma rem api.
  target.x = source["x"];
  target.y = source["y"];
  target.width = source["width"];
  target.height = source["height"];
}
