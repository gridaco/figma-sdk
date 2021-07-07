import { LayoutConstraint } from "../types";
import { Constraints, ConstraintType } from "@design-sdk/figma-types";
/**
 *
 * from : https://www.figma.com/developers/api#layoutconstraint-type
 *
 * to: https://www.figma.com/plugin-docs/api/Constraints/
 */
export function convertFigmaRemoteLayoutConstraintsToFigmaConstraints(
  remLayoutConstraints: LayoutConstraint
): Constraints {
  return {
    vertical: __vert_mapping[remLayoutConstraints.vertical],
    horizontal: __horiz_mapping[remLayoutConstraints.horizontal],
  };
}

const __vert_mapping: { [s: string]: ConstraintType } = {
  TOP: "MIN",
  BOTTOM: "MAX",
  CENTER: "CENTER",
  TOP_BOTTOM: "STRETCH",
  SCALE: "SCALE",
};

const __horiz_mapping: { [s: string]: ConstraintType } = {
  LEFT: "MIN",
  RIGHT: "MAX",
  CENTER: "CENTER",
  LEFT_RIGHT: "STRETCH",
  SCALE: "SCALE",
};
