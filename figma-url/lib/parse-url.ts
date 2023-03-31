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
 * Figma file url's node-id changed over time, this function is to make sure we can handle both formats.
 * to keep `00:00` format
 * @param node_id
 * @returns
 */
export function formatNodeId(node_id: string) {
  if (
    node_id.includes(":") ||
    node_id.includes("%3A") ||
    node_id.includes("-")
  ) {
    // "%3A" is ":" as in url encoding
    if (node_id.includes("%3A")) {
      // decode value, assuming it is url encoded
      node_id = decodeURIComponent(node_id);
    }
    if (node_id.includes("-")) {
      // if id is formatted with `-` instead of `:`, replace it.
      node_id = node_id.split("-").join(":");
    }
    // 2. run regex
    if (node_id.match(/[0-9]+:[0-9]+/) !== null) {
      return node_id;
    }
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
    const nodeId = formatNodeId(params.get("node-id"));
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
