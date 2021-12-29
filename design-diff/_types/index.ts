export interface IDiff<O> {
  diff: boolean;
  /**
   * - `[0]` - origin value
   * - `[1]` - new value (with diff)
   */
  values: [O, O];
}

/**
 * e.g. type PaintTypeDiff = ITypeDiff<"solid" | "image" | "gradient">
 */
export interface ITypeDiff<T> extends IDiff<T> {}
