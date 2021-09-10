import type { ReflectBaseNode } from "..";
import { Figma } from "@design-sdk/figma";
import type { IReflectNodeReference } from "./reflect-node-reference";

export function makeReference(r: ReflectBaseNode): IReflectNodeReference {
  if (!r) {
    throw 'cannot perform "makeReference". input node to make reference was empty';
  }

  const make_infinite_parent_reference = (r: IReflectNodeReference) => {
    return {
      name: r.name,
      type: r.type,
      // FIXME: somehow parent origin is undefined. (handling this with temporary ?? operator)
      // this is caused because initially converting the node, we use figma's raw nod as a parent.
      // reflect conversion must be fixed before resolving this issue.
      origin: r.origin ?? r.type,
      id: r.id,
      parent: r.parent && make_infinite_parent_reference(r.parent),
      mainComponent:
        r.mainComponent && _safely_makeComponentReference(r.mainComponent),
      variantProperties: r.variantProperties,
      children: r.children.map((c) => ({
        name: c.name,
        type: c.type,
        origin: c.origin,
        id: c.id,
      })),
    };
  };

  // figma node
  if ("$schema" in r) {
    return <IReflectNodeReference>{
      name: r.name,
      type: r.type,
      origin: r.origin,
      id: r.id,
      parent: make_infinite_parent_reference(r.parent),
      children: r.hasChildren
        ? r.children.map((c) => makeReference(c))
        : undefined,
      mainComponent: r.mainComponent,
      variantProperties: r.variantProperties,
    };
  }
}

function _safely_makeComponentReference(r: IReflectNodeReference) {
  if (r.origin === "COMPONENT" || r.type == "COMPONENT") {
    return makeComponentReference((r as any) as Figma.ComponentNode);
  }
}

export function makeComponentReference(r: Figma.ComponentNode) {
  if (!r) {
    console.warn(
      "the givven input was empty. cannot perform 'makeComponentReference'"
    );
    return;
  }

  const make_infinite_children_reference = (
    children: ReadonlyArray<Figma.SceneNode>
  ): Array<IReflectNodeReference> => {
    return children?.map((c) => {
      return <IReflectNodeReference>{
        id: c.id,
        name: c.name,
        origin: c.type,
        type: c.type,
        parent: {
          id: c.parent.id,
        },
        children:
          "children" in c
            ? make_infinite_children_reference(c.children)
            : undefined,
      };
    });
  };

  if (r.type == "COMPONENT") {
    return <IReflectNodeReference>{
      name: r.name,
      type: r.type,
      origin: r.type,
      id: r.id,
      parent: r.parent && {
        name: r.parent.name,
        type: r.parent.type,
        origin: r.parent.type,
        id: r.parent.id,
        children: r.parent.children.map(
          (c) =>
            c && {
              name: c.name,
              type: c.type,
              origin: c.type,
              id: c.id,
            }
        ),
      },
      children:
        "children" in r
          ? make_infinite_children_reference(r.children)
          : undefined,
      variantProperties: r.variantProperties,
    };
  }
}

//     PluginSdk.fetchMetadata({
//   type: "node-meta-fetch-request",
//   id: id,
//   namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
//   key: "layer-property-data",
// }).then((d) => {
