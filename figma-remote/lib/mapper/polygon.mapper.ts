import { RegularPolygon } from "@design-sdk/figma-remote-types";
import { Figma } from "@design-sdk/figma-types";
import { MappingPolygonNode } from "./mapping-instance";
import { blendBaseNode, blendVectorNode } from "../blenders";

export function mapFigmaRemotePolygonToFigma(
  remPol: RegularPolygon,
  parent?
): Figma.PolygonNode {
  const mapping: MappingPolygonNode = {} as any;

  blendBaseNode({
    target: mapping,
    source: remPol,
    parent,
  });

  blendVectorNode({
    target: mapping,
    source: remPol,
    parent,
  });

  return <Figma.PolygonNode>{
    ...mapping,
    type: "POLYGON",
  };
}
