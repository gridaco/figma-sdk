// FIXME - migrate this
import { Paint } from "@design-sdk/figma";

export function filterFills(
  fills: ReadonlyArray<Paint>,
  options?: {
    visibleOnly?: boolean;
  }
): ReadonlyArray<Paint> {
  return fills.filter((f) => {
    // 1. visible filter
    if (options?.visibleOnly) {
      if (!f.visible && f.opacity > 0) {
        return false;
      }
    }
    // if all filter passed, return true
    return true;
  });
}
