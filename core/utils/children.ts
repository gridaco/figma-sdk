import type {
  IChildrenMixin,
  IReflectChildrenMixin,
} from "../nodes/types/mixins/children.mixin";
import type { ReflectSceneNode } from "../nodes/types/node-type-alias";
import { ReflectSceneNodeType } from "../nodes/types/node-type";

type MaybeChildrenMixin<T = any> = IChildrenMixin<T> | object;

/**
 * maps all children under complex object determined by property name "children" and it's type (if its a array)
 * @param node
 * @param options
 * @returns
 */
export function mapGrandchildren<
  I extends MaybeChildrenMixin<any> = IReflectChildrenMixin,
  O = ReflectSceneNode
>(
  node: I,
  options?: {
    includeThis?: boolean;
  }
): Array<O> {
  const children: Array<O> = [];
  // if includeThis option enabled, add this.
  if (options?.includeThis) {
    children.push(node as any);
  }

  if ("children" in node) {
    const castedNode = node as IChildrenMixin<I>;
    // children field may exist, but not a array or undefined
    if (castedNode.children && Array.isArray(castedNode.children)) {
      for (const child of castedNode.children) {
        if ("children" in child && Array.isArray((child as any).children)) {
          const grandchildren = mapGrandchildren(
            child as IReflectChildrenMixin
          );
          children.push(...(grandchildren as any));
        }

        // frame can be also a child, but not group. group only holds children, so we do not push group nodes
        if (!((child as any).type == ReflectSceneNodeType.group)) {
          children.push(child as any);
        }
      }
    }
  }

  return children;
}
