import { LineHeight } from "@design-sdk/figma-types";
import { TypeStyle } from "@design-sdk/figma-remote-types";

export function figmaRemoteLineHeightToFigma(params: TypeStyle): LineHeight {
  switch (params.lineHeightUnit) {
    case "PIXELS":
      return {
        unit: "PIXELS",
        value: params.lineHeightPx,
      };
    case "FONT_SIZE_%":
      return {
        unit: "PERCENT",
        value: params.lineHeightPercent,
      };
    case "INTRINSIC_%":
      return {
        unit: "AUTO",
      };

    default:
      _warnNotHandled(params);
      // safely return fallback
      return {
        unit: "AUTO",
      };
  }
}

function _warnNotHandled(params) {
  console.warn(
    `cannot perform "figmaRemoteLineHeightToFigma" with givven parameters. figma api version might have been updated. this cannot be thrown. check this.`,
    "the input param was",
    params
  );
}
