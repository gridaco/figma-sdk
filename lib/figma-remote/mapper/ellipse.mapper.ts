import { Ellipse } from "../types";
import { Figma } from "../../figma";
import { MappingEllipseNode } from "./mapping-instance";
import { blendBaseNode } from "../blenders";

export function mapFigmaRemoteEllipseToFigma(
  remRect: Ellipse
): Figma.EllipseNode {
  const mapping = new MappingEllipseNode();
  blendBaseNode({
    target: mapping,
    source: remRect,
  });

  return <Figma.EllipseNode>{
    ...mapping,
    type: "ELLIPSE",
  };
}
