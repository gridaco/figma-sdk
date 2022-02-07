import { Figma } from "@design-sdk/figma-types";
import { text, TextDiff } from "..";
import {
  findWithRelativeIndexPath,
  getRelativeIndexPath,
} from "@design-sdk/figma-xpath";
import assert from "assert";

type DiffValueLike = TextDiff | InstanceDiff_1on1 | MultichildDiff;
export interface InstanceDiff_1on1 {
  type: "instance-to-master";
  diff: boolean;
  ids: [string, string];
  values: DiffValueLike[];
}

export interface MultichildDiff {
  type: "multi-child";
  diff: boolean;
  ids: [string, string];
  values: DiffValueLike[];
}

const _assert_err_msg = (missing: string) =>
  `comparing instance with master requires both instance and master to be defined. \`${missing}\` is missing`;

export function compare_instance_with_master({
  instance,
  master,
  components,
}: {
  instance: Figma.InstanceNode;
  master: Figma.ComponentNode;
  components: Figma.ComponentNode[];
}): InstanceDiff_1on1 {
  assert(instance, _assert_err_msg("instance"));
  assert(master, _assert_err_msg("master"));

  if (instance.mainComponentId !== master.id) {
    throw new Error(
      `Instance id ${instance.mainComponent.id} does not match master id ${master.id}`
    );
  }

  const diffs = instance.children
    .map((ic) => {
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
        default:
          return compare({ instance, master, path: relpath });
      }
    })
    .filter(Boolean);
  return {
    ids: [master.id, instance.id],
    type: "instance-to-master",
    values: diffs,
    diff: diffs.some((_) => _.diff),
  };
}

function compare({
  instance,
  master,
  path,
}: {
  instance: Figma.SceneNode;
  master: Figma.SceneNode;
  path: string;
}): DiffValueLike {
  const eq = findWithRelativeIndexPath<Figma.SceneNode>(
    { ...master, origin: master?.type as any } as any,
    path
  );

  const target = findWithRelativeIndexPath<Figma.SceneNode>(
    { ...instance, origin: instance?.type as any } as any,
    path
  );

  // console.log("relpathed", relpath, eq);
  switch (eq.type) {
    case "BOOLEAN_OPERATION":
    case "FRAME":
    case "GROUP":
      const diffs = eq.children
        .map((c) => {
          const relpath = getRelativeIndexPath(eq, c);
          return compare({ master: eq, instance: target, path: relpath });
        })
        .flat()
        .filter(Boolean);
      return {
        type: "multi-child",
        ids: [eq.id, target.id],
        diff: diffs.some((_) => _.diff),
        values: diffs,
      };
      break;
    case "ELLIPSE":
    case "LINE":
    case "POLYGON":
    case "RECTANGLE":
      break;
    case "TEXT":
      return text(eq as Figma.TextNode, target as Figma.TextNode);
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
    default:
      // Add global diff checker
      break;
  }
}
