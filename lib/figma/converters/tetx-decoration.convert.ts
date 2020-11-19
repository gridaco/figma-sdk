import { TextDecoration } from "@reflect.bridged.xyz/core/lib";

export type FigmaTextDecoration = "NONE" | "UNDERLINE" | "STRIKETHROUGH"

export function convertTextDecorationToReflect(origin: FigmaTextDecoration): TextDecoration {
    switch (origin) {
        case "NONE":
            return TextDecoration.none
        case "STRIKETHROUGH":
            return TextDecoration.linethrough
        case "UNDERLINE":
            return TextDecoration.underline
        default:
            return TextDecoration.none
    }
    return
}