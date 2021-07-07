import { mixed } from "@design-sdk/core/nodes";

export interface FigmaCornerRadius {
  cornerRadius: number | typeof mixed;
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
}
