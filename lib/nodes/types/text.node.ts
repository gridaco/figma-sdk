import { TextAlign, TextAlignVertical } from "@reflect.bridged.xyz/core/lib";
import { ReflectSceneNodeType } from ".";
import { getTextStyleById } from "../../figma";
import { ReflectDefaultShapeMixin } from "./mixins";

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

    get textStyle(): TextStyle {
        try {
            return getTextStyleById(this.textStyleId as string)
        } catch (e) {
            return undefined
        }
    }
}

