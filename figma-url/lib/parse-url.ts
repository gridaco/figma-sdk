import { FigmaTargetNodeConfig } from "./target-node-config";

/**
 * extracts file id from share link
 *
 * e.g. in - "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=775%3A112"
 *
 * out - "Y0Gh77AqBoHH7dG1GtK3xF"
 * @param url
 * @returns
 */
export function parseFileId(url: string) {
  // this logic is dangerous, but clean and simple. works for now. (think the url format won't change)
  if (url.includes("https://www.figma.com/file/")) {
    return url.split("/")[4];
  } else {
    throw `figma file url must contain "https://www.figma.com/file/". the givven was ${url}, which we cannot extract file id from it.`;
  }
}

/**
 * pattern is "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/?node-id=775%3A112"
 * @param url
 */
export function parseFileAndNodeId(
  url: string
): FigmaTargetNodeConfig | undefined {
  try {
    const _url = new URL(url);
    const params = new URLSearchParams(_url.search);
    const nodeId = params.get("node-id");
    const fileId = parseFileId(url);
    return {
      url: url,
      file: fileId,
      node: nodeId,
    };
  } catch (_) {
    // empty url, invalud url
    return;
  }
}
