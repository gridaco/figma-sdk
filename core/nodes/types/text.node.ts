import {
  TextAlign,
  TextAlignVertical,
  TextStyleManifest,
} from "@reflect-ui/core";
import { ReflectSceneNodeType } from "./node-type";
import { converters } from "../../";
import { ReflectDefaultShapeMixin } from "./mixins";

// region FIXME - migrate this
import { getTextStyleById } from "@design-sdk/figma";
import {
  FontName,
  TextCase,
  TextDecoration,
  LetterSpacing,
  LineHeight,
} from "@design-sdk/figma";
import { extractTextStyleFromTextNode } from "@design-sdk/figma/converters";
// endregion

export class ReflectTextNode extends ReflectDefaultShapeMixin {
  type = ReflectSceneNodeType.text;

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
