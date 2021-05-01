import { Figma } from "../../figma";
import { Frame, Rectangle } from "../types";
import { MappingBlendInput } from "./_in";

type CornerMixinRemoteNode = Rectangle | Frame;

export function blendCornerNode(
  p: MappingBlendInput<Figma.CornerMixin, CornerMixinRemoteNode>
) {
  const { target, source } = p;

  target.cornerRadius = source.cornerRadius;
}

export function blendRectangleCornerNode(
  p: MappingBlendInput<Figma.RectangleCornerMixin, CornerMixinRemoteNode>
) {
  const { target, source } = p;

  target.topLeftRadius = source.rectangleCornerRadii?.[0];
  target.topRightRadius = source.rectangleCornerRadii?.[1];
  target.bottomRightRadius = source.rectangleCornerRadii?.[2];
  target.bottomLeftRadius = source.rectangleCornerRadii?.[3];
}
