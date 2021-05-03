import { Figma } from "../../figma";
import {
  blendBaseNode,
  blendCornerNode,
  blendRectangleCornerNode,
} from "../blenders";
import { Frame } from "../types";
import { MappingFrameNode } from "./mapping-instance";

export function mapFigmaRemoteFrameToFigma(remFrame: Frame): Figma.FrameNode {
  const mapping = new MappingFrameNode();
  blendBaseNode({
    target: mapping,
    source: remFrame,
  });

  blendCornerNode({
    target: mapping,
    source: remFrame,
  });

  blendRectangleCornerNode({
    target: mapping,
    source: remFrame,
  });

  //   console.log("remFrame", remFrame);
  //   console.log("mapping", mapping);

  return <Figma.FrameNode>{
    ...mapping,
    type: "FRAME",
  };
}
