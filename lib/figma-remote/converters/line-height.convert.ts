import { LineHeight } from "../../figma/types/v1";
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
  } else if (params.unit == "PERCENT") {
    return {
      unit: "PERCENT",
      value: params.percent,
      // TODO - we haven't used 'percentFontSize' - is this not required?
    };
  } else {
    console.warn(
      "figma api version might have been updated. this cannot be thrown. check this."
    );
    // safely return fallback
    return {
      unit: "AUTO",
    };
  }
}
