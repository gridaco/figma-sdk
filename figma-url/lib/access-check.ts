///
/// simple functions to check if file is accessible by public.
///

import { analyze, FigmaUrlType } from "./analyze-url";

/**
 * e.g.
 *
 * - **ok**: (public file) - https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/grida?node-id=1545%3A247
 * - **not found**: (private file) - https://www.figma.com/file/8R57Uv5Siu1ZhhGkVIyyQg/private-file-api-demo?node-id=2%3A2
 *
 */
export async function isPublic(url: string): Promise<boolean> {
  const type = analyze(url);
  if (type == FigmaUrlType.embed || FigmaUrlType.file || FigmaUrlType.node) {
    try {
      const res = await fetch(url);
      return res.status == 200;
    } catch (e) {
      return false;
    }
  }
  return false;
}
