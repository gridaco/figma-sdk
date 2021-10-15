import { mapGrandchildren } from "@design-sdk/core/utils";
import { Figma } from "@design-sdk/figma-types";
import { text } from "..";

export function compare_instance_with_master({
  instance,
  master,
}: {
  instance: Figma.InstanceNode;
  master: Figma.ComponentNode;
}) {
  if (instance.mainComponent.id !== master.id) {
    throw new Error(
      `Instance id ${instance.mainComponent.id} does not match master id ${master.id}`
    );
  }

  const masterGrandchildren = mapGrandchildren<
    Figma.SceneNode,
    Figma.SceneNode
  >(master);
  const grandchildren = mapGrandchildren<Figma.SceneNode, Figma.SceneNode>(
    instance
  );

  grandchildren.forEach((ic) => {
    const eq = masterGrandchildren.find((mc) => mc.id === ic.id);
    switch (eq.type) {
      case "BOOLEAN_OPERATION":
      case "ELLIPSE":
      case "FRAME":
      case "GROUP":
      case "INSTANCE":
        return compare_instance_with_master({
          instance: ic as Figma.InstanceNode,
          master: (ic as Figma.InstanceNode).mainComponent,
        });
      case "LINE":
      case "POLYGON":
      case "RECTANGLE":
      case "TEXT":
        return text(eq as Figma.TextNode, ic as Figma.TextNode);
      case "SLICE":
      case "STAR":
      case "VECTOR":
        // will be supported
        return;
      case "CONNECTOR":
      case "STAMP":
      case "SHAPE_WITH_TEXT":
      case "STICKY":
        throw new Error("Design diff is only supported for design files");
      case "COMPONENT":
        throw new Error(
          `Invalid input: Master Component can't be under instance's children`
        );
    }
  });
}
