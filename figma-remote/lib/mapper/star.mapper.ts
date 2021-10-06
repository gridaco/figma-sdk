import { Star } from "@design-sdk/figma-remote-types";
import { Figma } from "@design-sdk/figma-types";
import { MAppingStarNode } from "./mapping-instance";
import { blendBaseNode, blendVectorNode } from "../blenders";
export function mapFigmaRemoteStarToFigma(
  remRect: Star,
  parent?
): Figma.StarNode {
  const mapping = new MAppingStarNode();
  blendBaseNode({
    target: mapping,
    source: remRect,
    parent,
  });

  blendVectorNode({
    target: mapping,
    source: remRect,
    parent,
  });

  return <Figma.StarNode>{
    ...mapping,
    type: "STAR",
  };
}
