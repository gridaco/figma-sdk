import { SpecialKeys, SPECIAL_KEY_PREFIX_TOKEN } from "./keys";
import { SpecialKeyResult, SpecialKeyType } from "./types";
export * from "./keys";

/**
 * case 1. //@ignore/some-name : null
 * case 2. //@data-target/some-name : "some-name"
 * case 3. Rectangle 1 : "Rectangle 1"
 * @param name
 * @returns
 */
export function normalizedName(name: string) {
  if (specialKeyTypeFrom(name) == SpecialKeys.KEY_IGNORE_ALL) {
    return null;
  }

  return name.replace(SPECIAL_KEY_PREFIX_TOKEN, "");
}

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
