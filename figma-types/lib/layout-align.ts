/**
 * [Figma#LayoutAlign](https://www.figma.com/plugin-docs/api/properties/nodes-layoutalign/)
 * Changing this property will cause the x, y, size, and relativeTransform properties on this node to change, if applicable (inside an auto-layout frame).
 *
 * Setting "STRETCH" will make the node "stretch" to fill the width of the parent vertical auto-layout frame, or the height of the parent horizontal auto-layout frame excluding the frame's padding.
 * If the current node is an auto layout frame (e.g. an auto layout frame inside a parent auto layout frame) if you set layoutAlign to “STRETCH” you should set the corresponding axis – either primaryAxisSizingMode or counterAxisSizingMode – to be“FIXED”. This is because an auto-layout frame cannot simultaneously stretch to fill its parent and shrink to hug its children.
 * Setting "INHERIT" does not "stretch" the node.
 *
 * - applicable only inside auto-layout frames
 *
 * > ⚠️ Previously, layoutAlign also determined counter axis alignment of auto-layout frame children. Counter axis alignment is now set on the auto-layout frame itself through counterAxisAlignItems. Note that this means all layers in an auto-layout frame must now have the same counter axis alignment. This means "MIN", "CENTER", and "MAX" are now deprecated values of layoutAlign.
 */
export type FigmaLayoutAlign = "STRETCH" | "INHERIT";
