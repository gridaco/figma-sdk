import { Figma } from "@design-sdk/figma-types";
import { blendBaseNode } from "../blenders";
import { BooleanGroup } from "@design-sdk/figma-remote-types";
import { MappingBooleanOperationNode } from "./mapping-instance";

export function mapFigmaRemoteBooleanOperationToFigma(
  remBool: BooleanGroup,
  parent?
): Figma.BooleanOperationNode {
  const mapping = new MappingBooleanOperationNode();
  blendBaseNode({
    target: mapping,
    source: remBool,
    parent,
  });

  return <Figma.BooleanOperationNode>{
    ...mapping,
    type: "BOOLEAN_OPERATION",
    booleanOperation: remBool.booleanOperation,
  };
}
