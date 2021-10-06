import { SpecialKeys, SPECIAL_KEY_PREFIX_TOKEN } from "../keys";
import { specialKeyAnalysis } from "../_utils/special-key-analysis";

export function shouldIgnore(name: string): boolean {
  const result = specialKeyAnalysis(name);
  if (result.specified && result.type == SpecialKeys.KEY_IGNORE_ALL) {
    return true;
  }
  return false;
}
