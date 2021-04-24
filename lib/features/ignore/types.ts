import { IgnoreKeys } from "./keys";

export interface IgnoreResult {
  type?: IgnoranceType;
  ignored: boolean;
  reason?: string[];
}

export type IgnoranceType =
  | typeof IgnoreKeys.KEY_DATA_SOURCE
  | typeof IgnoreKeys.KEY_IGNORE_ALL;
