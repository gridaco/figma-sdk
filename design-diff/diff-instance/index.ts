import { Figma } from "@design-sdk/figma-types";
import { text, TextDiff } from "..";
import {
  findWithRelativeIndexPath,
  getRelativeIndexPath,
} from "@design-sdk/figma-xpath";
import assert from "assert";

export interface InstanceDiff {
  type: "instance-to-master";
  diff: boolean;
  ids: string[];
  values: (TextDiff | InstanceDiff)[];
}

export function compare_instance_with_master({
  instance,
  master,
  components,
}: {
  instance: Figma.InstanceNode;
  master: Figma.ComponentNode;
  components: Figma.ComponentNode[];
}): InstanceDiff {
  assert(instance);
  assert(master);
  if (instance.mainComponentId !== master.id) {
    throw new Error(
      `Instance id ${instance.mainComponent.id} does not match master id ${master.id}`
    );
  }

  const diffs = instance.children.map((ic) => {
    const relpath = getRelativeIndexPath(instance, ic);
    const eq = findWithRelativeIndexPath<Figma.SceneNode>(
      { ...master, origin: master?.type as any } as any,
      relpath
    );
    // console.log("relpathed", relpath, eq);
    switch (eq.type) {
      case "INSTANCE":
        return compare_instance_with_master({
          instance: ic as Figma.InstanceNode,
          master: components.find(
            (_) => _.id === (ic as Figma.InstanceNode).mainComponentId
          ),
          components: components,
        });
        break;
      case "BOOLEAN_OPERATION":
      case "ELLIPSE":
      case "FRAME":
      case "GROUP":
        break;
      case "LINE":
      case "POLYGON":
      case "RECTANGLE":
        break;
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
  return {
    ids: [master.id, instance.id],
    type: "instance-to-master",
    values: diffs,
    diff: diffs.some((_) => _.diff),
  };
}
