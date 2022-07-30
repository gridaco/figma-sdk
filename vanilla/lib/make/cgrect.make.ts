import type {
  ReflectFrameNode,
  ReflectRectangleNode,
} from "@design-sdk/figma-node";
import type { CGRectManifest } from "@reflect-ui/core";

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
