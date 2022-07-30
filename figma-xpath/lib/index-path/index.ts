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
  readonly parentId?: string | null;
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
export function getRelativeIndexPath(
  entryRoot: PathNode,
  target: PathNode
): string {
  const paths = [];

  const _childrens = childrens(entryRoot);
  const _parents = parents(entryRoot, 1);

  if (target.id === entryRoot.id) {
    return "";
  }
  while (target) {
    const children_in_same_depth = _childrens.filter(
      (c) => c.parentId === target.parentId
    );

    const index = children_in_same_depth.findIndex((_) => _.id === target.id);
    if (index !== -1) {
      paths.push(index);
    } else {
      break;
    }

    const parent_of_target = _parents.find((_) => _.id === target.parentId);
    if (!parent_of_target) {
      break;
    }
    target = parent_of_target;
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

/**
 * extract only container node from node tree.
 */
function parents(node: PathNode, minlength = 0): PathNode[] {
  if (node.children && node.children.length >= minlength) {
    return [node, ...node.children.flatMap(parents)];
  } else {
    return [];
  }
}

function childrens(node: PathNode): PathNode[] {
  if (node.children) {
    return [...node.children, ...node.children.flatMap(childrens)];
  } else {
    return [];
  }
}
