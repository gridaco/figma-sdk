/**
 * swaps current instance to other component instance (variant)
 * this is mostly used for mocking user's variant switch action in figma, which is not provided by the figma plugin api
 */
export function swapInstance(
  from: InstanceNode,
  swapTo: ComponentNode
): boolean {
  try {
    const sharedParent = from.parent;
    const indexInParent = from.parent.children.findIndex(
      (c) => c.id == from.id
    );
    const instance = swapTo.createInstance();

    //#region sync transform
    instance.x = from.x;
    instance.y = from.y;
    // scale factor might should be applied after - not tested
    instance.scaleFactor = from.scaleFactor;
    instance.resize(from.width, from.height);
    instance.rotation = from.rotation;
    //#endregion

    // insesrt child and remove origin (from)
    sharedParent.insertChild(indexInParent, instance);
    // remove origin
    from.remove();
  } catch (_) {
    return false;
  }
  return true;
}
