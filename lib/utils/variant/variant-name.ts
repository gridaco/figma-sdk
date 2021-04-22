///
/// this file's function implementation follows figma's variant component naming convention, which splits property and value by comma (,) in single line node name.
///

/**
 * builds property map to figma variant component node name
 * e.g. { on: false, variant: hover } -> "on=false, variant=hover"
 * @param properties
 */
export function buildVariantName_Figma(
  properties: Map<string, string>
): string {
  return Array.from(properties)
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

/**
 * the formatting of variant name may slightly differ. mostly the empty spacing between the comma.
 * this function flats all givven and target and find the matching pattern so that slightly differing variant can be recognized
 * @param from
 * @param target
 */
export function findMatchingVariantName(
  from: string[],
  target: string
): string | undefined {
  const normalizedTarget = _normalizeName(target);
  for (const origin of from) {
    const normalizedOrigin = _normalizeName(origin);
    if (normalizedOrigin == normalizedTarget) {
      return origin;
    }
  }
  return undefined;
}

/**
 * compares two raw input after normalizing with same logic.
 * checks if two name represents the same value
 * @param _with
 * @param _this
 * @returns
 */
export function isVariantMatchingName(_with: string, _this: string): boolean {
  return _normalizeName(_with) == _normalizeName(_this);
}

/**
 * used for comparing the generated variant name and existing variant name to be indicating the same value
 * @param name
 * @returns
 */
function _normalizeName(name: string): string {
  let final = name;
  // replace empty spaces
  final = final.replace(/\s/g, "");
  // replace commas
  final = final.replace(/,/g, "");

  return final;
}
