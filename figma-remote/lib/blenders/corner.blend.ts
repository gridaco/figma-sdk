import { CornerMixin, RectangleCornerMixin } from "@design-sdk/figma-types";
import { Frame, Rectangle } from "@design-sdk/figma-remote-types";
import { MappingBlendInput } from "./_in";

type CornerMixinRemoteNode = Rectangle | Frame;

export function blendCornerNode(
  p: MappingBlendInput<CornerMixin, CornerMixinRemoteNode>
) {
  const { target, source } = p;

  target.cornerRadius = source.cornerRadius ?? 0;
  // target.cornerSmoothing - not supported
}

export function blendRectangleCornerNode(
  p: MappingBlendInput<RectangleCornerMixin, CornerMixinRemoteNode>
) {
  const { target, source } = p;

  target.topLeftRadius =
    source.rectangleCornerRadii?.[0] ?? source.cornerRadius ?? 0;
  target.topRightRadius =
    source.rectangleCornerRadii?.[1] ?? source.cornerRadius ?? 0;
  target.bottomRightRadius =
    source.rectangleCornerRadii?.[2] ?? source.cornerRadius ?? 0;
  target.bottomLeftRadius =
    source.rectangleCornerRadii?.[3] ?? source.cornerRadius ?? 0;
}
