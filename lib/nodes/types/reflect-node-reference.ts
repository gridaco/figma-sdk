import type { ReflectBaseNode } from ".";
import { ReflectSceneNodeType } from "./node-type";

export interface IReflectNodeReference {
  readonly type: ReflectSceneNodeType;
  /**
   * origin type
   */
  origin: ReflectSceneNodeType;
  name: string;
  id: string;
  parentReference?: IReflectNodeReference;
  children?: Array<IReflectNodeReference>;

  readonly isInstance: boolean;
  readonly isMasterComponent: boolean;
  readonly isRoot: boolean;
}

export function makeReference(r: ReflectBaseNode): IReflectNodeReference {
  return <IReflectNodeReference>{
    name: r.name,
    type: r.type,
    origin: r.origin,
    id: r.id,
    parentReference: {
      name: r.parent.name,
      type: r.parent.type,
      // FIXME somehow parent origin is undefined. (handling this with temporary ?? operator)
      // this is caused because initially converting the node, we use figma's raw nod as a parent.
      // reflect conversion must be fixed before resolving this issue.
      origin: r.parent.origin ?? r.parent.type,
      id: r.parent.id,
      children: r.parent.children.map((c) => ({
        name: c.name,
        type: c.type,
        origin: c.origin,
        id: c.id,
      })),
    },
    children: r.hasChildren
      ? r.children.map((c) => makeReference(c))
      : undefined,
  };
}
