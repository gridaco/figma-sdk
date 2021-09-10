import type { ReflectSceneNodeType } from "./node-type";
export {
  makeComponentReference,
  makeReference,
} from "./make-reflect-node-reference";

export interface IReflectNodeReference {
  readonly type: ReflectSceneNodeType;
  /**
   * origin type
   */
  origin: ReflectSceneNodeType;
  name: string;
  id: string;
  parent?: IReflectNodeReference;
  children?: Array<IReflectNodeReference>;
  mainComponent?: IReflectNodeReference;
  variantProperties?: { [property: string]: string } | null;

  readonly isInstance: boolean;
  readonly isMasterComponent: boolean;
  readonly isRoot: boolean;
}
