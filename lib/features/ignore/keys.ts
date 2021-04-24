/**
 * ignore keys contains special keys such as simply ignore, data source + ..
 */
export const IgnoreKeys = {
  /**
   * key to be fully ignored
   */
  KEY_IGNORE_ALL: "//@ignore",
  /**
   * key to represent that this is a datasource node and (which will not be converted anyway)
   */
  KEY_DATA_SOURCE: "//@data-source",
};
