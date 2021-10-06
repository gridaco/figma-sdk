const prefix = /(__)?\/\/@/gy;
const pattern = /(__)?\/\/@([a-zA-Z-]+)/gy;

export function parse(
  from: string,
  patterns: string | string[] | "*"
): string | false {
  patterns = Array.isArray(patterns)
    ? patterns
    : patterns === "*"
    ? "*"
    : [patterns];
  const matches = from.match(pattern);
  const _valid_prefix = matches?.length > 0;
  if (_valid_prefix) {
    const token = matches[0].replace(prefix, "");
    if (patterns === "*" || (patterns as []).some((p) => p == token)) {
      return token;
    }
  }
  return false;
}
