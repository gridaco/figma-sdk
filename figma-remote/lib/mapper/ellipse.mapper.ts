import { Ellipse } from "@design-sdk/figma-remote-types";
import { EllipseNode } from "@design-sdk/figma-types";
import { MappingEllipseNode } from "./mapping-instance";
import { blendBaseNode } from "../blenders";

export function mapFigmaRemoteEllipseToFigma(remRect: Ellipse): EllipseNode {
  const mapping = new MappingEllipseNode();
  blendBaseNode({
    target: mapping,
    source: remRect,
  });

  return <EllipseNode>{
    ...mapping,
    type: "ELLIPSE",
  };
}
