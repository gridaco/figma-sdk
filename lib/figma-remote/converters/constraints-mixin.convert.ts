import { ConstraintMixin } from "../../figma/types/v1";
import { LayoutConstraint } from "../types";
import { convertFigmaRemoteLayoutConstraintsToFigmaConstraints } from "./layout-constraints.convert";
export function convertForFigmaConstraintsMixin(
  _do: LayoutConstraint,
  _for: ConstraintMixin
) {
  _for.constraints = convertFigmaRemoteLayoutConstraintsToFigmaConstraints(_do);
  return _for;
}
