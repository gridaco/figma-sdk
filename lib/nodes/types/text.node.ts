import {
  TextAlign,
  TextAlignVertical,
  TextStyle,
  TextStyleManifest,
} from "@reflect-ui/core";
import { ReflectSceneNodeType } from ".";
import { getTextStyleById } from "../../figma";
import { extractTextStyleFromTextNode } from "../../figma/converters/text-style.convert";
import { ReflectDefaultShapeMixin } from "./mixins";
import {
  FontName,
  TextCase,
  TextDecoration,
  LetterSpacing,
  LineHeight,
} from "../../figma/types/v1";

export { TextAlign, TextAlignVertical };

export type TextAutoResize = "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT";

export class ReflectTextNode extends ReflectDefaultShapeMixin {
  get type() {
    return ReflectSceneNodeType.text;
  }

  characters: string;
  textAutoResize: "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT";

  textAlignHorizontal: TextAlign;
  textAlignVertical: TextAlignVertical;

  paragraphIndent: number;
  paragraphSpacing: number;

  fontSize: number | undefined;
  fontName: FontName | undefined;
  textStyleId: string | undefined;
  textCase: TextCase | undefined;

  // FIXME - this conversion is not working
  textDecoration: TextDecoration | undefined;
  // FIXME - this conversion is not working
  letterSpacing: LetterSpacing | undefined;
  // FIXME - this conversion is not working
  lineHeight: LineHeight | undefined;

  get hasTextStyle(): boolean {
    if (this.textStyleId !== "") {
      return true;
    }
    return false;
  }

  get textStyle(): TextStyleManifest {
    try {
      return getTextStyleById(this.textStyleId as string);
    } catch (e) {
      // console.error(`error occcured while getting text style by id`, e)
      return extractTextStyleFromTextNode(this);
    }
  }
}
