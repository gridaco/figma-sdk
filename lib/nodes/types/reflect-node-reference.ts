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
      origin: r.parent.origin,
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
