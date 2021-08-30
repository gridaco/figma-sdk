export type FigmaEnum = {
  type: "enum";
  values: string[];
};
export const FigmaNumber = Symbol("figma/variant-type/number");
export const FigmaBoolean = Symbol("figma/variant-type/boolean");
export const FigmaUnique = Symbol("figma/variant-type/unique");

export type FigmaVariantPropertyCompatType =
  | FigmaEnum
  | typeof FigmaNumber
  | typeof FigmaBoolean
  | typeof FigmaUnique;

export function _FigmaVariantPropertyCompatType_to_string(
  t: FigmaVariantPropertyCompatType
) {
  if (t == FigmaNumber) {
    return "number";
  } else if (t == FigmaBoolean) {
    return "boolean";
  } else if (t == FigmaUnique) {
    return "unique";
  } else {
    return "enum";
  }
}

/** e.g. on=true is key=on & type=boolean with defaultValue=true*/
export interface VariantProperty {
  key: string;
  type: FigmaVariantPropertyCompatType;
  defaultValue?: string;
  nullable: boolean;
}

export interface VariantPopertyValue {
  key: string;
  value: string;
}
