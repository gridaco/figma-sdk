
/**
 * check if rect, elipes, or frame contains image based on its fills.
 * @param fills 
 */
export function hasImage(fills: ReadonlyArray<Paint> | PluginAPI['mixed']): boolean {
    if (Array.isArray(fills)) {
        return fills.some((el) => {
            return el.type === "IMAGE"
        })
    }
    return false;
}