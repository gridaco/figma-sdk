import { LineHeight } from "@design-sdk/figma-types";
import { TypeStyle } from "@design-sdk/figma-remote-types";

export function figmaRemoteLineHeightToFigma(params: TypeStyle): LineHeight {
  switch (params.lineHeightUnit) {
    case "PIXELS":
      return {
        unit: "PIXELS",
        value: params.lineHeightPx,
      };

    /**
     * README: https://www.figma.com/developers/api
     * issue: https://github.com/gridaco/designto-code/issues/27 - `line-height percentage calculation error`
     * Change the previously used `lineHeightPercent` to `lineHeightPercentFontSize` according to the description of the api document below.
     * "Line height as a percentage of normal line height.
     * This is deprecated; in a future version of the API only lineHeightPx and lineHeightPercentFontSize will be returned."
     */
    case "FONT_SIZE_%":
      return {
        unit: "PERCENT",
        value: params.lineHeightPercentFontSize,
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
