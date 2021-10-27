export * from "./diff-text";
export * from "./diff-instance";

// ------------------------------------------------------------
import type { InstanceDiff } from "./diff-instance";
import type { TextDiff } from "./diff-text";
export type NodeDiff = TextDiff | InstanceDiff;
