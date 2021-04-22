///
/// this file's function implementation follows figma's variant component naming convention, which splits property and value by comma (,) in single line node name.
///

/**
 * builds property map to figma variant component node name
 * e.g. { on: false, variant: hover } -> "on=false, variant=hover"
 * @param properties
 */
export function buildVariantName_Figma(properties: Map<string, string>) {
  Array.from(properties)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join(", ");
}

/**
 * extracts property map from variant component node's name
 * e.g. "on=false, variant=hover" -> { on: false, variant: hover }
 * @param name
 * @returns
 */
export function extractPropertiesFromVariantName_Figma(
  name: string
): Map<string, string> {
  const properties = new Map<string, string>();
  name.split(",").forEach((propertyPair) => {
    const [k, v] = propertyPair.split("=");
    properties.set(k, v);
  });
  return properties;
}
