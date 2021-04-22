import type { ReflectSceneNode } from "../node-type-alias";
import { ReflectConstraintMixin } from "./constraint.mixin";
import { RGBAF } from "@reflect-ui/uiutils/lib/types";

export abstract class ReflectChildrenMixin extends ReflectConstraintMixin {
  children: Array<ReflectSceneNode>;
  get constraintableChildren(): Array<ReflectConstraintMixin> {
    return filterConstraintableChildren(this);
  }
  isRelative?: boolean;

  get mostUsedColor(): ReadonlyArray<RGBAF> {
    throw "not implemented";
  }
}

function filterConstraintableChildren(node: ReflectChildrenMixin) {
  const constraintables: Array<ReflectConstraintMixin> = [];
  for (const childNode of node.children) {
    if (
      childNode.type == "INSTANCE" ||
      childNode.type == "COMPONENT" ||
      childNode.type == "FRAME" ||
      childNode.type == "RECTANGLE" ||
      childNode.type == "GROUP" ||
      childNode.type == "LINE" ||
      childNode.type == "ELLIPSE" ||
      childNode.type == "TEXT"
    ) {
      constraintables.push(childNode as ReflectConstraintMixin);
    }
  }
  return constraintables;
}
