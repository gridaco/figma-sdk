export * from "./@special";
import { parse as parse_special } from "./@special";
import { parse as parse_dashdash } from "./parsing-strategy-dashdash";
export function parseFromName(name: string) {
  const _maybe_special = parse_special(name);
  if (_maybe_special) {
    return { [_maybe_special]: true };
  }

  // otherwise, parse for normal flags
  return parse_dashdash(name);
}
