export const SPECIAL_KEY_PREFIX_TOKEN = "//@";
/**
 * ignore keys contains special keys such as simply ignore, data source + ..
 */
export const SpecialKeys = {
  /**
   * key to be fully ignored
   */
  ignore_all: {
    key: "ignore",
    pattern: "//@ignore",
  },
  /**
   * key to represent that this is a datasource node and (which will not be converted anyway)
   */
  data_source: {
    key: "data-source",
    pattern: "//@data-source",
  },

  /**
   * this key specified unmanaged node (non-component) to be explicitly detected by data mapper
   * so, "//@data-target/name" will be a property target corresponding to "name"
   */
  data_mapper_target: {
    key: "data-target",
    pattern: "//@data-target/",
  },
};

export const _all_keys = Object.keys(SpecialKeys).map(
  (k) => SpecialKeys[k].key
);

export interface SpecialKeyResult {
  type?: SpecialKeyType;
  specified: boolean;
  reason?: string[];
}

export type SpecialKeyType =
  | typeof SpecialKeys.data_source
  | typeof SpecialKeys.ignore_all
  | typeof SpecialKeys.data_mapper_target;
