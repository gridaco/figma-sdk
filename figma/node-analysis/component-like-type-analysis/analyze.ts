import { ReflectSceneNodeType, ReflectSceneNode } from "@design-sdk/core/nodes";
import type { IReflectNodeReference } from "@design-sdk/core/nodes/lignt";
import { SchemaDefinitionLike } from "./type";

export function analyzeNode(node: IReflectNodeReference): SchemaDefinitionLike {
  if (!node) {
    return;
  }

  if (
    node.origin != ReflectSceneNodeType.component &&
    node.origin != ReflectSceneNodeType.variant_set &&
    node.origin != ReflectSceneNodeType.instance
  ) {
    // TODO:
    const __todo_is_parent_component_like = false;
    if (__todo_is_parent_component_like) {
      return "single-layer-property";
    } else {
      return "invalid-target";
    }
  } else if (node?.origin == ReflectSceneNodeType.variant_set) {
    return "variant-set";
  } else if (node?.origin == ReflectSceneNodeType.instance) {
    if (isThisInstanceAVariantInstance(node)) {
      return "variant-instance";
    } else {
      return "instance-component";
    }
  } else if (node?.origin == ReflectSceneNodeType.component) {
    if (isMasterVariant(node)) {
      return "master-variant-compoent";
    } else {
      return "master-component";
    }
  }

  // default
  return "invalid-target";
}

export function isThisInstanceAVariantInstance(node: IReflectNodeReference) {
  const _master = node.mainComponent;
  return isMasterVariant(_master);
}

export function isMasterVariant(node: IReflectNodeReference) {
  return isPossibleBeingAVariant(node) && isParentAVariantSet(node);
}

export function isPossibleBeingAVariant(node: IReflectNodeReference) {
  // at the point of 2021.9, figma requires a variat-set to be a frame and a variant must live under it. variant itself is also a compoennt.
  // so, we check
  // 1. if node is type of a component
  // 2. if node has a parent.
  return node.origin == ReflectSceneNodeType.component && _hasParent(node);
  // thant this has a minimal requirement for the possibility being a variant.
  // the exceptional case is that master-component being placed uner some sort of frame. (even if it is not a variant.)
}

/**
 * is parent a variant set?
 */
export function isParentAVariantSet(node: IReflectNodeReference) {
  return node.parent.origin == ReflectSceneNodeType.variant_set;
}

export function isThisAInstanceOfVariant(node: IReflectNodeReference): boolean {
  throw "no impl";
  return false;
}

/**
 * rathers check if the node is inside a component-like node
 */
function isMemberOfComponentLike(node: ReflectSceneNode) {
  throw "no impl";
}

function _hasParent(n: IReflectNodeReference): boolean {
  return n.parent != null;
}
