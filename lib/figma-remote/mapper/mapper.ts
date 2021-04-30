import { SceneNode } from "../../figma/types/v1";
import { Node } from "../types";
import { mapFigmaRemoteTextToFigma } from "./text.mapper";
export function mapFigmaRemoteToFigma(remNode: Node): SceneNode {
  switch (remNode.type) {
    case "TEXT":
      return mapFigmaRemoteTextToFigma(remNode);
      break;

    default:
      console.warn(`type "${remNode.type}" not handled`);
      return (remNode as any) as SceneNode;
      break;
  }
}
