import { ReflectSceneNodeType } from ".";
import { ReflectDefaultShapeMixin } from "./mixins";

export class ReflectTextNode extends
    ReflectDefaultShapeMixin {
    get type() {
        return ReflectSceneNodeType.text
    }

    characters: string;
    textAutoResize: "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT";

    textAlignHorizontal: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
    textAlignVertical: "TOP" | "CENTER" | "BOTTOM";

    paragraphIndent: number;
    paragraphSpacing: number;

    fontSize: number | PluginAPI["mixed"];
    fontName: FontName | PluginAPI["mixed"];
    textStyleId: string | PluginAPI['mixed']
    textCase: TextCase | PluginAPI["mixed"];
    textDecoration: TextDecoration | PluginAPI["mixed"];
    letterSpacing: LetterSpacing | PluginAPI["mixed"];
    lineHeight: LineHeight | PluginAPI["mixed"];
}

