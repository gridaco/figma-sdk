import { Rect } from "../types";
import { Figma } from "../../figma";
export function mapFigmaRemoteTextToFigma(remRect: Rect): Figma.RectangleNode {
  return <Figma.RectangleNode>{
    width: remRect.width,
  };
}
