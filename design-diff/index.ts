export * from "./diff-text";
export * from "./diff-instance";

// ------------------------------------------------------------
import type { InstanceDiff_1on1, MultichildDiff } from "./diff-instance";
import type { TextDiff } from "./diff-text";
export type NodeDiff = TextDiff | InstanceDiff_1on1 | MultichildDiff;
