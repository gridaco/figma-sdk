import { Paint as RemPaint } from "../types";
import { Paint } from "../../figma/types/v1";
import { figmaRemotePaintToFigma } from "./paint.convert";

export function convertFigmaRemoteFillsToFigma(...fills: RemPaint[]): Paint[] {
  return fills.map((f) => figmaRemotePaintToFigma(f));
}
