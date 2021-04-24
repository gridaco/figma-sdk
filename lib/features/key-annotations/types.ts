import { SpecialKeys } from "./keys";

export interface SpecialKeyResult {
  type?: SpecialKeyType;
  specified: boolean;
  reason?: string[];
}

export type SpecialKeyType =
  | typeof SpecialKeys.KEY_DATA_SOURCE
  | typeof SpecialKeys.KEY_IGNORE_ALL
  | typeof SpecialKeys.KEY_DATA_MAPPER_TARGET;
