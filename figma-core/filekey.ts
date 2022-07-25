/**
 * on figma plugin, the file key is not provided by defaylt. grida assistant asks user to input the fileey, but this cannot be 100% trusted and can be empty.
 * in this case, use this symbol to represent the file key.
 */
const anonymous_figma_plugin_file_key = Symbol("figma-plugin");
const unknown_figma_file_key = Symbol("unknown");
export const figma_special_filekeys = {
  anonymous_plugin_file: anonymous_figma_plugin_file_key,
  unknown_file: unknown_figma_file_key,
} as const;

export type FigmaAnonymousFileKey =
  | typeof anonymous_figma_plugin_file_key
  | typeof unknown_figma_file_key;

export type FigmaFileKey = string | FigmaAnonymousFileKey;
