import { IgnoreKeys } from "./keys";
import { IgnoreResult, IgnoranceType } from "./types";
export * from "./keys";

export function shouldIgnoreNode(name: string): IgnoreResult {
  const ignoreType = ignoranceTypeFrom(name);
  if (ignoreType) {
    return {
      type: ignoreType,
      ignored: true,
      reason: [`ignored since it contains key ${ignoreType}`],
    };
  }

  return {
    ignored: false,
  };
}

export function ignoranceTypeFrom(name: string): IgnoranceType {
  // TODO support glob pattern matching
  for (const kk of Object.keys(IgnoreKeys)) {
    const v = IgnoreKeys[kk];
    if (name.includes(v)) {
      return v;
    }
  }
}
