
/**
 * check if rect, elipes, or frame contains image based on its fills.
 * @param fills 
 */
export function hasImage(fills: ReadonlyArray<Paint>): boolean {
    if (Array.isArray(fills)) {
        return fills.some((el) => {
            return isImage(el)
        })
    }
    return false;
}

export function isImage(fill: Paint) {
    return fill.type === "IMAGE"
}