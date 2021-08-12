export interface FigmaAuthStoreOptions {
  /** e.g prefix = 'figma/' => 'figma/persianl-access-token'
   *
   * defaults to 'figma/'
   */
  prefix?: string;
}

const default_prefix = "figma/";
const default_options: FigmaAuthStoreOptions = {
  prefix: default_prefix,
};

export class FigmaAuthStore {
  static __options: FigmaAuthStoreOptions = default_options;
  static get options(): FigmaAuthStoreOptions {
    return this.__options;
  }

  static configure({ prefix = default_prefix }: FigmaAuthStoreOptions) {
    this.__options.prefix = prefix;
  }

  static makekey(key: string): string {
    return this.options.prefix + key;
  }
}
