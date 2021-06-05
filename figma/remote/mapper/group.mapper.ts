import { Figma } from "../..";
import {
  blendBaseNode,
  blendCornerNode,
  blendRectangleCornerNode,
} from "../blenders";
import { Group } from "../types";
import { MappingGroupNode } from "./mapping-instance";

export function mapFigmaRemoteGroupToFigma(remGroup: Group): Figma.GroupNode {
  const mapping = new MappingGroupNode();
  blendBaseNode({
    target: mapping,
    source: remGroup,
  });

  return <Figma.GroupNode>{
    ...mapping,
    type: "GROUP",
    layoutAlign: remGroup.layoutAlign,
  };
}
