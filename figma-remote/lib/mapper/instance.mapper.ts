import type { Instance, Frame } from "@design-sdk/figma-remote-types";
import type { MappingInstanceNode } from "./mapping-instance";
import { Figma } from "@design-sdk/figma-types";
import { mapFigmaRemoteFrameToFigma } from "./frame.mapper";

export function mapFigmaRemoteInstanceToFigma(
  remInstance: Instance,
  parent?
): Figma.InstanceNode {
  const mapping: MappingInstanceNode = {} as any;

  const frame = mapFigmaRemoteFrameToFigma(remInstance as any as Frame, parent);

  return <Figma.InstanceNode>{
    ...mapping,
    // @ts-ignore
    ...(frame as Figma.InstanceNode),
    type: "INSTANCE",
    mainComponent: undefined, // TODO: support main component
    mainComponentId: remInstance.componentId,
  };
}
