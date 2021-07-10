import { DesignProvider } from "@design-sdk/core-types";

export function analyzeDesignUrl(url: string): DesignProvider {
  try {
    const u = new URL(url);
    switch (u.hostname) {
      /**
       * https://figma.com/file/~
       */
      case "figma.com":
      case "www.figma.com":
        return "figma";
        break;
      /**
       * https://sketch.com/s/~
       */
      case "www.sketch.com":
      case "sketch.com":
        return "sketch";
        break;

      /**
       * powered by nothing graphics engine
       */
      case "www.nothing.app":
      case "nothing.app":
        return "nothing";
      case "www.bridged.xyz":
      case "www.grida.co":
      case "grida.co":
      case "bridged.xyz": // legacy bridged.xyz urls
        return "grida";
      default:
        return "unknown";
    }
  } catch (_) {
    // console.warn(`failed analyzing url. the url "${url}" is not a valid url.`)
    return "unknown";
  }
}
