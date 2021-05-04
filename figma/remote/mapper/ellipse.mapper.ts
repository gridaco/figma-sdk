import { Ellipse } from "../types";
import { EllipseNode } from "../../types/v1";
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
