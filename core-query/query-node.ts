type Node = {
  id: string;
  children?: Node[];
};

/**
 * Internal class for managing document query. memory stored
 */
class DocumentQuerySnapshot<T extends Node> {
  private readonly nodes: T[];
  constructor(seed: T | T[]) {
    if (Array.isArray(seed)) {
      this.nodes = seed;
    } else {
      this.nodes = [seed];
    }
  }

  getNodeById(id: string): T | null {
    return getNodeByIdFrom(id, this.nodes);
  }

  getNodeAndRootById(id: string): { node: T; root: Node } {
    return getNodeAndRootByIdFrom<T>(id, this.nodes);
  }
}

export function document<T extends Node = Node>(seed: T | T[]) {
  return new DocumentQuerySnapshot<T>(seed);
}

export function getNodeByIdFrom<T extends Node = Node>(
  id: string,
  from: T | T[]
): T | null {
  if (Array.isArray(from)) {
    for (const node of from) {
      const found = find(id, node) as T;
      if (found) {
        return found;
      }
    }
    return null;
  } else {
    return find<T>(id, from as T);
  }
}

/**
 * finds root of the target node under the page by id
 *
 * e.g. based on below example, if the id `c1` was givven, it will return `C`.
 *
 * - A
 *    - a1
 *    - a2
 * - B
 *    - b1
 *    - b2
 * - C
 *    - c1
 * @param id
 * @param nodes
 * @returns
 */
export function getNodeAndRootByIdFrom<T extends Node = Node>(
  id: string,
  nodes: T[]
): { node: T; root: T } {
  for (const node of nodes) {
    const found = find<T>(id, node);
    if (found) {
      return { node: found, root: node };
    }
  }
}

function find<T extends Node = Node>(id: string, entry: T): T {
  if (!entry) return null;
  if (entry.id === id) {
    return entry;
  }
  if (entry.children) {
    for (const child of entry.children) {
      const found = find<T>(id, child as T);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
