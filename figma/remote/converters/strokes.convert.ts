import { Paint as RemPaint } from "../types";
import { Paint } from "@design-sdk/figma-types";
import { figmaRemotePaintToFigma } from "./paint.convert";

export function convertFigmaRemoteStrokesToFigma(
  ...fills: RemPaint[]
): Paint[] {
  return fills.map((f) => figmaRemotePaintToFigma(f));
}
