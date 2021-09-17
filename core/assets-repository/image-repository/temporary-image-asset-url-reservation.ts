/**
 *
 * @param prefix full uri scheme like prefix, e.g. `https://domain.com/`
 * @param key
 * @returns
 */
export function build_temp_static_remote_asset_uri_to_be_replaced_later__dangerous(
  prefix: string,
  key: string
): string {
  return `${prefix || ""}${key}`;
}
