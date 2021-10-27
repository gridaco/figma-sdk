export function same_typeof(a, b) {
  return typeof a === typeof b;
}

/**
 * if nested or non neseted array is equal.
 * @param a
 * @param b
 * @returns
 */
export function equals(a: readonly any[], b: readonly any[]) {
  // if the other array is a falsy value, return
  if (!b) return false;

  // compare lengths - can save a lot of time
  if (a.length != b.length) return false;

  for (var i = 0, l = a.length; i < l; i++) {
    // Check if we have nested arrays
    if (a[i] instanceof Array && b[i] instanceof Array) {
      // recurse into the nested arrays
      if (!equals(a[i], b[i])) return false;
    } else if (a[i] != b[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}
