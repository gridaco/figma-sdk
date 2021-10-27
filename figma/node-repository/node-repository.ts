import type { ReflectSceneNode } from "@design-sdk/figma-node";
import type { InstanceNode, ComponentNode } from "@design-sdk/figma-types";

type Node = ReflectSceneNode;

/**
 * A simple node repository that can contain component relations
 */
export class NodeRepository {
  constructor({
    components = [],
    nodes,
  }: {
    components?: ComponentNode[];
    nodes: Node[];
  }) {
    this.nodes = nodes;
    this.components = components;
  }

  readonly nodes: Array<Node>;
  readonly components: Array<ComponentNode>;

  get(id: string): Node {
    return this.nodes.find((node) => node.id === id);
  }

  mainComponentOf(instance: InstanceNode): ComponentNode {
    return this.components.find(
      (master) => master.id === instance.mainComponentId
    ) as ComponentNode;
  }
}
