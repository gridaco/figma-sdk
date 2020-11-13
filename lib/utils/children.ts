import { ReflectChildrenMixin, ReflectGroupNode, ReflectSceneNode } from "../nodes"

export function mapGrandchildren(node: ReflectChildrenMixin, options?: {
    includeThis?: boolean
}): Array<ReflectSceneNode> {
    const children: Array<ReflectSceneNode> = []

    // if includeThis option enabled, add this.
    if (options?.includeThis) {
        children.push(node)
    }

    for (const child of node.children) {
        if (child instanceof ReflectChildrenMixin) {
            const grandchildren = mapGrandchildren(child)
            children.push(...grandchildren)
        }

        // frame can be also a child, but not group. group only holds children, so we do not push group nodes
        if (!(child instanceof ReflectGroupNode)) {
            children.push(child)
        }
    }
    return children
}