import { Rectangle } from "../types";
import { Figma } from "@design-sdk/figma-types";
import { MappingRectangleNode } from "./mapping-instance";
import { blendBaseNode } from "../blenders";
import {
  blendCornerNode,
  blendRectangleCornerNode,
} from "../blenders/corner.blend";
export function mapFigmaRemoteRectangleToFigma(
  remRect: Rectangle
): Figma.RectangleNode {
  const mapping = new MappingRectangleNode();
  blendBaseNode({
    target: mapping,
    source: remRect,
  });
  console.log("mapping.absoluteTransform", mapping.absoluteTransform);

  blendCornerNode({
    target: mapping,
    source: remRect,
  });

  blendRectangleCornerNode({
    target: mapping,
    source: remRect,
  });

  return <Figma.RectangleNode>{
    ...mapping,
    type: "RECTANGLE",
  };
}
