// FIXME -- migrate this
import type { SceneNode } from "@design-sdk/figma";

/**
 * returns if giveen node is a root node.
 * @param node
 */
export function checkIfRoot(node: SceneNode) {
  // if no parent is provided, it means it is from api or manually generated data, and it is okay to be considered as root.
  // but we need caution to this logic. (WARNING)
  if (!node.parent) {
    return true;
  }
  if (node.parent.type == "PAGE") {
    return true;
  }
  return false;
}
