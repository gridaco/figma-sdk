import { Line } from "@design-sdk/figma-remote-types";
import { Figma } from "@design-sdk/figma-types";
import { MappingLineNode } from "./mapping-instance";
import { blendBaseNode, blendVectorNode } from "../blenders";

export function mapFigmaRemoteLineToFigma(
  remLine: Line,
  parent?
): Figma.LineNode {
  const mapping: MappingLineNode = {} as any;
  blendBaseNode({
    target: mapping,
    source: remLine,
    parent,
  });

  blendVectorNode({
    target: mapping,
    source: remLine,
    parent,
  });

  return <Figma.LineNode & { vectorPaths }>{
    ...mapping,
    type: "LINE",
  };
}
