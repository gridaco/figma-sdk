import { FontWeight } from "@reflect-ui/core";

const _DEFAULT_FALLBACK_STYLE = "regular";

/**
 * Scenarios
 *
 * 1. RobotoRegular -> regular
 * 2. roboto-regular -> regular
 * 3. regular -> regular
 * 4. RobotoExtraLight -> extra-light
 * 5. Roboto-ExtraLight -> extra-light
 * 6. Roboto-extra-light -> extra-light
 * 7. roboto-extralight -> extra-light
 * @param fontStyle
 */
export function convertFontStyleNameToFontWeightReflect(fontStyle: string) {
  if (!fontStyle) {
    return convertFontWeightToReflect(_DEFAULT_FALLBACK_STYLE);
  }
  const _one_of_the_substring_is_matching_possible_style_name = POSSIBLE_STYLE_INDICATOR_TOKEN_CASES.filter(
    (cases) => {
      return cases.filter((c) => fontStyle.includes(c)).length >= 1;
    }
  );

  let style = _DEFAULT_FALLBACK_STYLE; // falback style. the default text style

  const _length = _one_of_the_substring_is_matching_possible_style_name.length;

  switch (_length) {
    case 0: {
      // non was matched
      // console.info(
      //   'no standard font style found with givven style name. using "regular" style instead. the givven style name was',
      //   fontStyle
      // );
      style = _DEFAULT_FALLBACK_STYLE;
      break;
    }

    case 1:
    case 2: {
      style =
        _one_of_the_substring_is_matching_possible_style_name[_length - 1][0];
      break;
    }

    default: {
      // more than 1
      console.info(
        "more than one style is found in style name",
        fontStyle,
        "this is currently not supported. please avoid using font name that includes multiple style names.",
        "this will fallback to use 'regular' instead."
      );
      break;
    }
  }

  return convertFontWeightToReflect(style);
}

// Convert generic named weights to numbers, which is the way tailwind understands
export function convertFontWeightToReflect(weight: string): FontWeight {
  weight = weight?.toLowerCase();
  switch (weight) {
    case "thin":
      return FontWeight.w100;
    case "extra light":
    case "extra-light":
      return FontWeight.w200;
    case "light":
      return FontWeight.w300;
    case "regular":
      return FontWeight.w400;
    case "medium":
      return FontWeight.w500;
    case "semi bold":
    case "semi-bold":
    case "semibold":
      return FontWeight.w600;

    case "bold":
      return FontWeight.w700;
    case "extra bold":
    case "extra-bold":
      return FontWeight.w800;
    case "heavy":
      return FontWeight.w800;
    case "black":
      return FontWeight.w900;
    default:
      console.warn(
        `"${weight}" not handled properly. converting it as regular instead.`
      );
      return FontWeight.w400;
  }
}

/**
 * each token will be transformed to possible cases.
  e.g. extra-light to
   1. extralight
   2. extra light
   3. Extra light
   4. Extra Light
   5. extra-light
   6. Extra-light
   7. Extra-Light
 * @param token 
 * @returns 
 */
function makeAllPossibleStyleIndicatorTokenCases(token: string): string[] {
  const _split = token.split("-");
  const _default = token;
  const _1 = _split.join(); // extralight
  const _2 = _split.join(" "); //extra light
  const _3 = _split.map((s) => capitalize(s)).join(""); // ExtraLight
  const _4 = _split.map((s) => capitalize(s)).join(" "); // Extra Light
  const _5 = _split.join("-"); //extra-light
  const _7 = _split.map((s) => capitalize(s)).join("-"); // Extra-Light

  return [_default, _1, _2, _3, _4, _5, _7];
}

/**
 * in lower case
 */
const GENERAL_FONT_WEIGHT_INDICATOR_TOKNES = [
  "thin",
  "light",
  "extra-light",
  "regular",
  "medium",
  "semi-bold",
  "bold",
  "extra-bold",
  "heavy",
  "black",
];

const POSSIBLE_STYLE_INDICATOR_TOKEN_CASES: string[][] = GENERAL_FONT_WEIGHT_INDICATOR_TOKNES.map(
  (token) => makeAllPossibleStyleIndicatorTokenCases(token)
);

/**
 * ['l', 'i', 'g', 'h', 't'] to Light
 * @param param0
 * @returns
 */
function capitalize(word: string) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
