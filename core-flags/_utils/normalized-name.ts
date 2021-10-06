import { SpecialKeys, SPECIAL_KEY_PREFIX_TOKEN } from "../@special/keys";
import { specialKeyTypeFrom } from "./annotation-from-name";

/**
 * case 1. //@ignore/some-name : null
 * case 2. //@data-target/some-name : "some-name"
 * case 3. Rectangle 1 : "Rectangle 1"
 * @param name
 * @returns
 */
export function normalizedName(name: string) {
  if (specialKeyTypeFrom(name) == SpecialKeys.KEY_IGNORE_ALL) {
    return null;
  }

  return name.replace(SPECIAL_KEY_PREFIX_TOKEN, "");
}
