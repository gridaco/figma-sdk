import { analyze, FigmaUrlType } from "./analyze-url";
import { _FIGMA_EMBED_URL_PREFIX } from "./constants";

export type FigmaEmbedInput =
  | string
  | { url: string }
  | { fileid: string; nodeid?: string };

/**
 * build embedding url. - https://www.figma.com/developers/embed
 * @param src : ;
 * @returns
 */
export function embed(src: FigmaEmbedInput) {
  const url = builEmbedableSourceUrl(src);
  const urltype = analyze(url);
  switch (urltype) {
    case FigmaUrlType.embed:
      return url;
    case FigmaUrlType.file:
      console.warn(
        "incomplete url input. the target node is not specified in the embedding target source url. this wont display contents as expected"
      );
      return _build(url);
    case FigmaUrlType.node:
      return _build(url);
  }
}

function _build(url: string) {
  const _embed_url = `${_FIGMA_EMBED_URL_PREFIX}?embed_host=astra&url=${url}`;
  return _embed_url;
}

/**
 * e.g. - https://www.figma.com/file/HSozKEVWhh8saZa2vr1Nxd?node-id=111%3A0
 *
 * (*this does not contain logic for checking if input url is valid.*)
 * @param src : ;
 * @returns
 */
export function builEmbedableSourceUrl(
  src?: FigmaEmbedInput
): string | undefined {
  if (!src) {
    return;
  }

  if (typeof src == "string") {
    return src;
  } else if ("url" in src) {
    return src.url;
  } else if ("fileid" in src) {
    /// WWW prefix is required. if non passed, figma embed won't accept it.
    return `https://www.figma.com/file/${src.fileid}/${
      src.nodeid && `?node-id=${src.nodeid}`
    }`;
  } else {
    return undefined;
  }
}
