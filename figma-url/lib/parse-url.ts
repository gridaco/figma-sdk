/**
 * extracts file id from share link
 *
 * e.g. in - "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=775%3A112"
 *
 * out - "Y0Gh77AqBoHH7dG1GtK3xF"
 * @param url
 * @returns
 */
export function parseFigmaFileIdFromUrl(url: string) {
  // this logic is dangerous, but clean and simple. works for now. (think the url format won't change)
  if (url.includes("https://www.figma.com/file/")) {
    return url.split("/")[4];
  } else {
    throw `figma file url must contain "https://www.figma.com/file/". the givven was ${url}, which we cannot extract file id from it.`;
  }
}

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

/**
 * pattern is "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=775%3A112"
 * @param url
 */
export function parseFigmaFileAndNodeIdFromUrl(
  r_url: string
): FigmaTargetNodeConfig | undefined {
  try {
    const url = new URL(r_url);
    const params = new URLSearchParams(url.search);
    const nodeId = params.get("node-id");
    const fileId = parseFigmaFileIdFromUrl(r_url);
    return {
      url: r_url,
      file: fileId,
      node: nodeId,
    };
  } catch (_) {
    // empty url, invalud url
    return;
  }
}
