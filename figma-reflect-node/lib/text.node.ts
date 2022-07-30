import type {
  DimensionLength,
  TextAlign,
  TextAlignVertical,
  TextDecoration,
  TextManifest,
  TextStyleManifest,
  TextOverflow,
  TextTransform,
} from "@reflect-ui/core";
import type {
  TextAutoResize,
  FontName,
  LetterSpacing,
} from "@design-sdk/figma-types";
import { FontWeight } from "@reflect-ui/core";
import { ReflectSceneNodeType } from "./node-type";
import { ReflectDefaultShapeMixin } from "./mixins";
import { inferFontWeight } from "@reflect-ui/font-utils";
// endregion

export class ReflectTextNode
  extends ReflectDefaultShapeMixin
  implements Omit<TextManifest, "style">
{
  readonly type: ReflectSceneNodeType.text = ReflectSceneNodeType.text;

  autoRename: boolean;

  /**
   * text content; text characters
   */
  data: string;

  overflow: TextOverflow;
  maxLines: number;

  textAutoResize: TextAutoResize;

  textAlign: TextAlign;
  textAlignVertical: TextAlignVertical;

  paragraphIndent: number;
  paragraphSpacing: number;

  fontSize: number | undefined;
  fontName: FontName | undefined;
  textStyleId: string | undefined;
  textCase: TextTransform | undefined;
  textDecoration?: TextDecoration;

  letterSpacing: LetterSpacing;
  lineHeight: DimensionLength;

  // omitted - style: TextStyleManifest; (FIXME: make text style as unified property)
  textStyle: TextStyleManifest | undefined;

  get hasTextStyle(): boolean {
    if (this.textStyleId !== "") {
      return true;
    }
    return false;
  }

  get fontFamily(): string {
    return this.fontName.family;
  }

  get fontWeight(): FontWeight {
    try {
      return inferFontWeight(this.fontName.style);
    } catch (_) {
      // fallback.
      return FontWeight.normal;
    }
  }
}
