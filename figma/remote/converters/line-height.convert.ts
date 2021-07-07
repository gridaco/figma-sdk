import { LineHeight } from "@design-sdk/figma-types";
export function figmaRemoteLineHeightToFigma(params: {
  px?: number;
  unit: string;
  percent?: number;
  percentFontSize?: number;
}): LineHeight {
  if (params.unit == "PIXELS") {
    return {
      unit: "PIXELS",
      value: params.px,
    };
  }
  // Todo - conversion logic is incomplete.
  else if (params.unit.includes("%")) {
    if (params.unit == "FONT_SIZE_%") {
      return {
        unit: "PERCENT",
        value: params.percent,
        // TODO - we haven't used 'percentFontSize' - is this not required?
      };
    } else if (params.unit == "INTRINSIC_%") {
      return {
        unit: "PERCENT",
        value: params.percent,
        // TODO - we haven't used 'percentFontSize' - is this not required?
      };
    } else {
      _warnNotHandled(params);
      return {
        unit: "AUTO",
      };
    }
  } else {
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
