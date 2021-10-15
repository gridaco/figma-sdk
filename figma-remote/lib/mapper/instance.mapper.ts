import { Figma } from "@design-sdk/figma-types";
import { Instance, Frame } from "@design-sdk/figma-remote-types";
import { MappingInstanceNode } from "./mapping-instance";
import { mapFigmaRemoteFrameToFigma } from "./frame.mapper";
import { _FILL_INTERFACE_METHODS } from "./_utils";
import { nodes } from "@design-sdk/figma";

export function mapFigmaRemoteInstanceToFigma(
  remInstance: Instance,
  parent?
): Figma.InstanceNode {
  const mapping = new MappingInstanceNode();
  const frame = mapFigmaRemoteFrameToFigma(
    (remInstance as any) as Frame,
    parent
  );

  return <Figma.InstanceNode>{
    ...mapping,
    // @ts-ignore
    ...(frame as Figma.InstanceNode),
    type: "INSTANCE",
    mainComponent: undefined, // TODO: support main component
    mainComponentId: remInstance.componentId,
    swapComponent: _FILL_INTERFACE_METHODS,
    setProperties: _FILL_INTERFACE_METHODS,
    detachInstance: _FILL_INTERFACE_METHODS,
  };
}
