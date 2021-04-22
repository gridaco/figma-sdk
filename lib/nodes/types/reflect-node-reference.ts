import { ReflectSceneNodeType } from "./node-type";

export interface IReflectNodeReference {
  readonly type: ReflectSceneNodeType;
  name: string;
  id: string;
  parentReference?: IReflectNodeReference;
}
