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
 * this does not contains the type of the property. only value.
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

type FigmaVariantPropertyCompatType = "enum" | "boolean" | "string";
interface FimaVariantPropertyData {
  name: string;
  type: FigmaVariantPropertyCompatType;
  defaultValue: string;
  nullable: boolean;
}

/**
 * figma's variant values' type are ok to be translated as enum (custom type alias) or boolean value since it's all selectable
 * at this point (2021), only boolean and string types are supported and string are hanlded as selectable on figma editor ui.
 * the special strings are ["on", "off", "true", "false"]
 * some values may be nullable if there is a variant that contains no value.
 * @param params
 */
export function extractTypeFromVariantNames_Figma(
  names: string[]
): FimaVariantPropertyData[] {
  // some names may not contain value, which means there are some blanked property by names (varaints)
  // so, we'll need to find the longest property container to be a sample.

  const propertyMaps = names.map((n) =>
    extractPropertiesFromVariantName_Figma(n)
  );

  // 1. find the sample map

  const i_highestBidder = propertyMaps
    .map((a) => a.size)
    .indexOf(Math.max(...propertyMaps.map((a) => a.size)));
  const highestBidder = propertyMaps[i_highestBidder];

  // this stores infered property type of the iterated property value
  // it's lke this.
  // case 1. isOn: ["boolean", "boolean"] -> this type can be fixed as boolean
  // case 2. isOn: ["string", "boolean"] -> this type is fallbacking to enum
  const inferedPropertyTypeMap = new Map<
    string,
    Array<FigmaVariantPropertyCompatType>
  >();

  // iterates through single property
  highestBidder.forEach((v, k) => {
    const p_name = k;
    const p_value = v;
    const p_infered_type = inferTypeFromVariantValue_Figma(v);
    inferedPropertyTypeMap[k];
  });

  // inferedPropertyTypeMap to fixed type
  // inferedPropertyTypeMap.forEach((v, k) => {
  //   if (k.)
  // })

  return [];
}

const FIGMA_BOOLEAN_REPRESENTERS = ["on", "off", "true", "false"];
function inferTypeFromVariantValue_Figma(
  value: string
): FigmaVariantPropertyCompatType {
  if (FIGMA_BOOLEAN_REPRESENTERS.includes(value)) {
    return "boolean";
  } else {
    return "string";
  }
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
