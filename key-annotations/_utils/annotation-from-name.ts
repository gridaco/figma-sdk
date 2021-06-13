import { SpecialKeys, SPECIAL_KEY_PREFIX_TOKEN } from "../keys";
import { SpecialKeyType } from "../types";

export function specialKeyTypeFrom(name: string): SpecialKeyType {
  if (name.includes(SPECIAL_KEY_PREFIX_TOKEN)) {
    // TODO support glob pattern matching
    for (const kk of Object.keys(SpecialKeys)) {
      const v = SpecialKeys[kk];
      if (name.includes(v)) {
        return v;
      }
    }
  }
}
