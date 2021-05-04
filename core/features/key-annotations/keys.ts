export const SPECIAL_KEY_PREFIX_TOKEN = "//@";
/**
 * ignore keys contains special keys such as simply ignore, data source + ..
 */
export const SpecialKeys = {
  /**
   * key to be fully ignored
   */
  KEY_IGNORE_ALL: "//@ignore",
  /**
   * key to represent that this is a datasource node and (which will not be converted anyway)
   */
  KEY_DATA_SOURCE: "//@data-source",

  /**
   * this key specified unmanaged node (non-component) to be explicitly detected by data mapper
   * so, "//@data-target/name" will be a property target corresponding to "name"
   */
  KEY_DATA_MAPPER_TARGET: "//@data-target/",
};
