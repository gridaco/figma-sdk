import type { ReflectChildrenMixin } from "../nodes/types/mixins/children.mixin";
import type { ReflectSceneNode } from "../nodes/types/node-type-alias";
import { ReflectSceneNodeType } from "../nodes/types/node-type";

export function mapGrandchildren(
  node: ReflectChildrenMixin,
  options?: {
    includeThis?: boolean;
  }
): Array<ReflectSceneNode> {
  const children: Array<ReflectSceneNode> = [];

  // if includeThis option enabled, add this.
  if (options?.includeThis) {
    children.push(node);
  }

  for (const child of node.children) {
    // TODO - we might neeed better type checking for this.
    if ("children" in child) {
      const grandchildren = mapGrandchildren(child as ReflectChildrenMixin);
      children.push(...grandchildren);
    }

    // frame can be also a child, but not group. group only holds children, so we do not push group nodes
    if (!(child.type == ReflectSceneNodeType.group)) {
      children.push(child);
    }
  }
  return children;
}
