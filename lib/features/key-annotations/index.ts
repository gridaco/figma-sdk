import { SpecialKeys, SPECIAL_KEY_PREFIX_TOKEN } from "./keys";
import { SpecialKeyResult, IgnoranceType } from "./types";
export * from "./keys";

export function shouldIgnore(name: string): boolean {
  const result = specialKeyAnalysis(name);
  if (result.specified && result.type == SpecialKeys.KEY_IGNORE_ALL) {
    return true;
  }
  return false;
}

export function specialKeyAnalysis(name: string): SpecialKeyResult {
  const specialType = specialKeyTypeFrom(name);
  if (specialType) {
    return {
      type: specialType,
      specified: true,
      reason: [`ignored since it contains key ${specialType}`],
    };
  }

  return {
    specified: false,
  };
}

export function specialKeyTypeFrom(name: string): IgnoranceType {
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
