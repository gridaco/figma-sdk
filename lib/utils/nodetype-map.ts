import { ReflectSceneNodeType } from "../nodes/types/node-type";

export function rawTypeToReflectType(type: string): ReflectSceneNodeType {
  if (type in ReflectSceneNodeType) {
    return ReflectSceneNodeType[type];
  }

  switch (type) {
    case "GROUP":
      return ReflectSceneNodeType.group;
    case "FRAME":
      return ReflectSceneNodeType.frame;
    case "VECTOR":
      return ReflectSceneNodeType.vector;
    case "COMPONENT":
      return ReflectSceneNodeType.component;
    case "TEXT":
      return ReflectSceneNodeType.text;
    case "INSTANCE":
      return ReflectSceneNodeType.instance;
    case "RECTANGLE":
      return ReflectSceneNodeType.rectangle;
    case "LINE":
      return ReflectSceneNodeType.line;
    case "ELLIPSE":
      return;
    case "COMPONENT_SET":
      return ReflectSceneNodeType.variant_set;
    default:
      return ReflectSceneNodeType.unknown;
  }
}
