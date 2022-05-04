import { VectorNode } from "@design-sdk/figma-types";
import { Vector } from "@design-sdk/figma-remote-types";
import { MappingVectorNode } from "./mapping-instance";
import { blendBaseNode } from "../blenders";
import { blendVectorNode } from "../blenders/vector.blend";

export function mapFigmaRemoteVectorToFigma(
  remRect: Vector,
  parent?
): VectorNode {
  const mapping: MappingVectorNode = {} as any;

  blendBaseNode({
    target: mapping,
    source: remRect,
    parent,
  });

  blendVectorNode({
    target: mapping,
    source: remRect,
    parent,
  });

  // this is only available via plugin api
  // learn more at https://www.figma.com/plugin-docs/api/VectorNetwork/
  mapping.vectorNetwork = undefined;
  mapping.handleMirroring = "NONE";

  return <VectorNode>{
    ...mapping,
    type: "VECTOR",
  };
}
