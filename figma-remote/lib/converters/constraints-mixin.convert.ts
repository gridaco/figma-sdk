import { ConstraintMixin } from "@design-sdk/figma-types";
import { LayoutConstraint } from "@design-sdk/figma-remote-types";
import { convertFigmaRemoteLayoutConstraintsToFigmaConstraints } from "./layout-constraints.convert";
export function convertForFigmaConstraintsMixin(
  _do: LayoutConstraint,
  _for: ConstraintMixin
) {
  _for.constraints = convertFigmaRemoteLayoutConstraintsToFigmaConstraints(_do);
  return _for;
}
