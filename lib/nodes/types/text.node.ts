import { TextAlign, TextAlignVertical, TextStyle, TextStyleManifest } from "@reflect.bridged.xyz/core";
import { ReflectSceneNodeType } from ".";
import { getTextStyleById } from "../../figma";
import { convertFontStyleToReflect } from "../../figma/converters/font-style.convert";
import { convertFontWeightToReflect } from "../../figma/converters/font-weight.convert";
import { convertTextDecorationToReflect } from "../../figma/converters/tetx-decoration.convert";
import { extractTextStyleFromTextNode } from "../../figma/converters/text-style.convert";
import { ReflectDefaultShapeMixin } from "./mixins";
// import { TextDecoration } from "@reflect.bridged.xyz/core/lib"
export {
    TextAlign as TextAlign,
    TextAlignVertical as TextAlignVertical
}

export type TextAutoResize = "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT"

export class ReflectTextNode extends
    ReflectDefaultShapeMixin {
    get type() {
        return ReflectSceneNodeType.text
    }

    characters: string;
    textAutoResize: "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT";

    textAlignHorizontal: TextAlign
    textAlignVertical: TextAlignVertical

    paragraphIndent: number;
    paragraphSpacing: number;

    fontSize: number | undefined
    fontName: FontName | undefined
    textStyleId: string | undefined
    textCase: TextCase | undefined
    textDecoration: TextDecoration | undefined
    letterSpacing: LetterSpacing | undefined
    lineHeight: LineHeight | undefined //PluginAPI["mixed"];

    get hasTextStyle(): boolean {
        if (this.textStyleId !== "") {
            return true
        }
        return false
    }

    get textStyle(): TextStyleManifest {
        try {
            return getTextStyleById(this.textStyleId as string)
        } catch (e) {
            // console.error(`error occcured while getting text style by id`, e)
            return extractTextStyleFromTextNode(this)
        }
    }
}

