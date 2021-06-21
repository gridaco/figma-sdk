export type FigmaEmbedInput =
  | { url: string }
  | { fileid: string; nodeid?: string };

/**
 * build embedding url. - https://www.figma.com/developers/embed
 * @param src : ;
 * @returns
 */
export function buildFigmaEmbedUrl(src: FigmaEmbedInput) {
  const url = builFigmaEmbedableSourceUrl(src);
  const _embed_url = `https://www.figma.com/embed?embed_host=astra&url=${url}`;
  return _embed_url;
}

/**
 * e.g. - https://www.figma.com/file/HSozKEVWhh8saZa2vr1Nxd?node-id=111%3A0
 * @param src : ;
 * @returns
 */
export function builFigmaEmbedableSourceUrl(
  src?: FigmaEmbedInput
): string | undefined {
  if (!src) {
    return;
  }

  if ("url" in src) {
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
