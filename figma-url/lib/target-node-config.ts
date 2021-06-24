/**
 * target node configuration for figma node that contains all fileid, nodeid and the figma url of the target.
 */
export interface FigmaTargetNodeConfig {
  /**
   * url of target node originated from figma
   */
  url: string;
  /**
   * id of the file originated from figma
   */
  file: string;
  /**
   * id of the node originated from figma
   */
  node: string;
}
