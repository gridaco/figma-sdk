import { SpecialKeyResult } from "../types";
import { specialKeyTypeFrom } from "./annotation-from-name";

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
