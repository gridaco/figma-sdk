import { TextDecorationStyle, TextStyle as RFTextStyle } from "@reflect.bridged.xyz/core/lib"
import { convertLetterSpacingToReflect } from "./letter-spacing.convert"
import { convertLineHeightToReflect } from "./line-height.convert"
import { convertTextDecorationToReflect } from "./tetx-decoration.convert"

export function textStyleToReflect(origin: TextStyle): RFTextStyle {
    origin.lineHeight
    return {
        fontFamily: origin.fontName.family,
        // TODO
        fontWeight: undefined, // origin.fontName.style // TODO
        wordSpacing: undefined, // non-figma property
        decoration: convertTextDecorationToReflect(origin.textDecoration),
        decorationStyle: undefined,
        decorationThickness: undefined,
        letterSpacing: convertLetterSpacingToReflect(origin.letterSpacing),
        lineHeight: convertLineHeightToReflect(origin.lineHeight),
        color: undefined // non-figma property (figma does not contain color to text style)
    }
}