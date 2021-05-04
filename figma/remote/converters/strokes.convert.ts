import { Paint as RemPaint } from "../types";
import { Paint } from "../../types/v1";
import { figmaRemotePaintToFigma } from "./paint.convert";

export function convertFigmaRemoteStrokesToFigma(
  ...fills: RemPaint[]
): Paint[] {
  return fills.map((f) => figmaRemotePaintToFigma(f));
}
