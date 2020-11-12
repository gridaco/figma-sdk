/**
 * Retrieve the first visible color that is being used by the layer, in case there are more than one.
 */
export function retrieveFill<T extends Paint>(fills: ReadonlyArray<Paint> | PluginAPI["mixed"], options?: {
    onlySolid?: boolean
}): T | undefined {

    const filter = (f: Paint): boolean => {
        if (options?.onlySolid) {
            if (f.type !== 'SOLID') {
                return false
            }
        }
        return f.visible !== false
    }

    if (fills && fills !== figma.mixed && fills.length > 0) {
        // on Figma, the top layer is always at the last position
        // reverse, then try to find the first layer that is visible, if any.
        return [...fills].reverse().find(filter) as T;
    }
}