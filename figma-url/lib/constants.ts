/**
 * e.g. full url should look like -
 * https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/HSozKEVWhh8saZa2vr1Nxd?node-id=111%3A0
 *
 * ref: https://www.figma.com/developers/embed
 */
export const _FIGMA_EMBED_URL_PREFIX = "https://www.figma.com/embed";

/**
 * e.g. full url should look like -
 * https://www.figma.com/file/HSozKEVWhh8saZa2vr1Nxd?node-id=111%3A0
 */
export const _FIGMA_FILE_URL_PREFIX = "https://www.figma.com/file";

/**
 * param key for node id specification.
 *
 * e.g. - `https://www.figma.com/file/ABC/?node-id=1234` `(node-id = 1234)`
 */
export const _PARAM_NODE_ID = "node-id";

// ======================================================================================================
// escape with __ for "super-internal" usage
/**
 * file id of Grida design - https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/
 */
export const __FIGMA_DEMO_DEFAULT_FILE_ID = "Y0Gh77AqBoHH7dG1GtK3xF";
export const __FIGMA_DEMO_DEFAULT_FILE_URL =
  "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/";
export const __FIGMA_DEMO_DEFAULT_FILE_NODE_URL =
  "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=264%3A49";
// ======================================================================================================
