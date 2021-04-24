import { SpecialKeys } from "./keys";

export interface SpecialKeyResult {
  type?: IgnoranceType;
  specified: boolean;
  reason?: string[];
}

export type IgnoranceType =
  | typeof SpecialKeys.KEY_DATA_SOURCE
  | typeof SpecialKeys.KEY_IGNORE_ALL
  | typeof SpecialKeys.KEY_DATA_MAPPER_TARGET;
