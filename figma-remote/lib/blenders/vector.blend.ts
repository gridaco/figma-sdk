import { VectorBase } from "@design-sdk/figma-remote-types";
import {
  MappingEllipseNode,
  MappingLineNode,
  MappingPolygonNode,
  MAppingStarNode,
  MappingVectorNode,
} from "../mapper/mapping-instance";
import { MappingBlendInput } from "./_in";

export function blendVectorNode(
  p: MappingBlendInput<
    | MappingVectorNode
    | MappingPolygonNode
    | MAppingStarNode
    | MappingLineNode
    | MappingEllipseNode,
    VectorBase
  >
) {
  const { target, source } = p;
  target.vectorPaths = source.fillGeometry
    // we do not add stroke geometry to vector paths for now.
    // TODO: how to handle "strokeGeometry"?
    // .concat(source.strokeGeometry)
    .map((g) => {
      return {
        data: g.path,
        windingRule: g.windingRule,
      };
    });
}
