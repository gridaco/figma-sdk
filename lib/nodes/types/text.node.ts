import { ReflectSceneNodeType } from ".";
import { getTextStyleById } from "../../figma";
import { ReflectDefaultShapeMixin } from "./mixins";


export type TextHorizontalAligment = "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
export type TextVerticalAligment = "TOP" | "CENTER" | "BOTTOM";
export type TextAutoResize = "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT"

export class ReflectTextNode extends
    ReflectDefaultShapeMixin {
    get type() {
        return ReflectSceneNodeType.text
    }

    characters: string;
    textAutoResize: "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT";

    textAlignHorizontal: TextHorizontalAligment
    textAlignVertical: TextVerticalAligment

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

