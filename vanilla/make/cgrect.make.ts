import { ReflectFrameNode, ReflectRectangleNode } from "@design-sdk/core";
import { CGRectManifest } from "@reflect-ui/core/lib";

export function makeCGRect(
  node: ReflectFrameNode | ReflectRectangleNode
): CGRectManifest {
  const fill = node.primaryColor;
  const borderRadius = node.cornerRadius;
  const shadow = node.primaryShadow;
  // TODO border support
  // TODO gradient support

  return {
    borderRadius: borderRadius,
    width: node.width,
    height: node.height,
    shadow: shadow,
    fill: fill,
    opacity: node.opacity,
  };
}
