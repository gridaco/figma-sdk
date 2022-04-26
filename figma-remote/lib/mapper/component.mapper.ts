import { Figma } from "@design-sdk/figma-types";
import { Component, Frame } from "@design-sdk/figma-remote-types";
import { MappingComponentNode } from "./mapping-instance";
import { mapFigmaRemoteFrameToFigma } from "./frame.mapper";
import { _FILL_INTERFACE_METHODS } from "./_utils";

export function mapFigmaRemoteComponentToFigma(
  remComponent: Component,
  parent?
): Figma.ComponentNode {
  const mapping: MappingComponentNode = {} as any;
  const frame = mapFigmaRemoteFrameToFigma(
    remComponent as any as Frame,
    parent
  );

  return <Figma.ComponentNode>{
    ...mapping,
    // @ts-ignore
    ...(frame as Figma.ComponentNode),
    type: "COMPONENT",
  };
}
