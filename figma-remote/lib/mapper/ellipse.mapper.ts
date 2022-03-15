import { Ellipse } from "@design-sdk/figma-remote-types";
import { EllipseNode } from "@design-sdk/figma-types";
import { MappingEllipseNode } from "./mapping-instance";
import { blendBaseNode, blendVectorNode } from "../blenders";

export function mapFigmaRemoteEllipseToFigma(
  remEllipse: Ellipse,
  parent?
): EllipseNode {
  const mapping = new MappingEllipseNode();
  blendBaseNode({
    target: mapping,
    source: remEllipse,
    parent,
  });

  blendVectorNode({
    target: mapping,
    source: remEllipse,
    parent,
  });

  // ellipse specific
  mapping.arcData = remEllipse.arcData ?? {
    startingAngle: 0,
    endingAngle: 0,
    innerRadius: 0,
  };

  return <EllipseNode & { vectorPaths }>{
    ...mapping,
    type: "ELLIPSE",
  };
}
