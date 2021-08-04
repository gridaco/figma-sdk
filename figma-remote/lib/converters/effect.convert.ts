import { Effect as RemEffect } from "@design-sdk/figma-remote-types";
import { Effect, ShadowEffect, BlurEffect } from "@design-sdk/figma-types";
export function convertFigmaRemoteEffectToFigma(remEffect: RemEffect): Effect {
  switch (remEffect.type) {
    // blurs
    case "BACKGROUND_BLUR":
    case "LAYER_BLUR":
      return <BlurEffect>{
        type: remEffect.type,
        radius: remEffect.radius,
        visible: remEffect.visible,
      };
    // shadows
    case "DROP_SHADOW":
    case "INNER_SHADOW":
      return <ShadowEffect>{
        type: remEffect.type,
        color: remEffect.color,
        offset: remEffect.offset,
        radius: remEffect.radius,
        spread: remEffect.spread,
        visible: remEffect.visible,
        blendMode: remEffect.blendMode,
      };
    default:
      throw `cannot handle input data from remote - ${JSON.stringify(
        remEffect,
        null,
        2
      )}`;
      break;
  }
}

export function convertFigmaRemoteEffectsToFigma(
  ...remEffects: RemEffect[]
): Effect[] {
  return remEffects.map((re) => convertFigmaRemoteEffectToFigma(re));
}
