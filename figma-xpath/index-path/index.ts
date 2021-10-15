import type { IReflectNodeReference } from "@design-sdk/figma-node";

/**
 * simple path data containing node. using instead of,
 * ```
 * import type { IReflectNodeReference } from "@design-sdk/figma-node"
 * ```
 */
interface PathNode {
  readonly id: string;
  readonly name: string;
  readonly parent?: PathNode;
  readonly children?: ReadonlyArray<PathNode>;
}

/**
 * relative path of current node. (not main component)
 * e.g. 0/1
 * ```
 * instance
 *   - layer
 *     - layer
 *     - THIS
 *   - layer
 * ```
 */
export function getRelativeIndexPath<
  T extends PathNode = IReflectNodeReference
>(root: PathNode, target: PathNode): string {
  const paths = [];
  while (target) {
    if (target.id === root.id) {
      break;
    }
    console.log("target", target);
    paths.push(target.parent.children.findIndex((c) => c.id === target.id));
    target = target.parent;
  }

  return paths.reverse().join("/");
}

export function findWithRelativeIndexPath<
  T extends PathNode = IReflectNodeReference
>(root: PathNode, indexPath: string | number[]): T {
  if (typeof indexPath === "string") {
    indexPath = indexPath.split("/").map(Number);
  }

  let children = root.children;
  let i = 0;
  for (const at of indexPath) {
    if (i === indexPath.length - 1) {
      return children[at] as T;
    }
    try {
      children = children[at].children;
    } catch (_) {
      console.error(_, root.children, indexPath);
      throw `givven data is incorrect. we couldn't find target layer from "${
        root.name
      }" with givven path ${indexPath.join("/")}`;
    }
    i++;
  }
}
