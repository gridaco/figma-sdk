/**
 * Retrieve the first visible color that is being used by the layer, in case there are more than one.
 */
export function retrieveFill<T extends Paint>(fills: ReadonlyArray<Paint> | Paint, options?: {
    onlySolid?: boolean
}): T | undefined {

    if (Array.isArray(fills)) {
        const filter = (f: Paint): boolean => {
            if (options?.onlySolid) {
                if (f.type !== 'SOLID') {
                    return false
                }
            }
            return f.visible !== false
        }

        if (fills.length > 0) {
            // on Figma, the top layer is always at the last position
            // reverse, then try to find the first layer that is visible, if any.
            return [...fills].reverse().find(filter) as T;
        }
    } else {
        if (fills) {
            return fills as T
        }
    }
}