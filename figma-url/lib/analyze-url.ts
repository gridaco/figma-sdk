import {
  _FIGMA_EMBED_URL_PREFIX,
  _FIGMA_FILE_URL_PREFIX,
  _PARAM_NODE_ID,
} from "./constants";

export enum FigmaUrlType {
  /**
   * embed ready url
   */
  embed = "embed",

  /**
   * file id only url. this cannot be used for embedding (cannot be used as a source)
   */
  file = "file",

  /**
   * url with file & node this can be used for embedding. (can be used as a source)
   */
  node = "node",

  /**
   * empty url. undefined or ""
   */
  empty = "empty",
}

export function analyze(url: string): FigmaUrlType {
  if (!url) {
    // return if url is empty
    return FigmaUrlType.empty;
  }
  let _u: URL;

  // pre url validation
  try {
    _u = new URL(url);
  } catch (_) {
    throw `this url cannot be analyzed. this is not a valid url string - "${url}"`;
  }

  //
  if (url.startsWith(_FIGMA_EMBED_URL_PREFIX)) {
    return FigmaUrlType.embed;
  } else {
    // you might think the value of the embed target might be encoded,
    // so it is wrong to compare value with raw string,
    // but the only case the url is encoded is when it's for embeding
    // - which will be returned above. it's fine.
    if (_u.hostname == "figma.com" || _u.hostname == "www.figma.com") {
      // file path is required for both file and node.
      if (_u.pathname.includes("file/")) {
        if (_u.searchParams.get(_PARAM_NODE_ID)?.length > 0) {
          return FigmaUrlType.node;
        } else {
          return FigmaUrlType.file;
        }
      }
    }
    // otherwise,
    throw `not a valid figma url.`;
  }
}
