import { SpecialKeys, _all_keys } from "./keys";
import { parse as parseunique } from "../parsing-strategy-unique";
export * from "./keys";

export function shouldIgnore(name: string): boolean {
  const _maybe_special = parseunique(name, [SpecialKeys.ignore_all.key]);
  return _maybe_special == SpecialKeys.ignore_all.key;
}

export function parse(name: string): string | false {
  return parseunique(name, _all_keys);
}
