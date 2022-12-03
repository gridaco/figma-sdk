import { FigmaLayoutAlign } from "@design-sdk/figma-types";
import { MainAxisSize } from "@reflect-ui/core";

/**
 * read the [figma's layout-align docs](https://www.figma.com/plugin-docs/api/properties/nodes-layoutalign/)
 * @param layoutAlign
 * @returns
 */
export function layoutAlignToReflectMainAxisSize(
  layoutAlign: FigmaLayoutAlign
): MainAxisSize {
  switch (layoutAlign) {
    case "INHERIT":
      /**
       * Setting "INHERIT" does not "stretch" the node.
       */
      return MainAxisSize.min;
    case "STRETCH":
      /**
       * - Setting "STRETCH" will make the node "stretch" to fill the width of the parent vertical auto-layout frame, or the height of the parent horizontal auto-layout frame excluding the frame's padding.
       * - If the current node is an auto layout frame (e.g. an auto layout frame inside a parent auto layout frame) if you set layoutAlign to “STRETCH” you should set the corresponding axis – either primaryAxisSizingMode or counterAxisSizingMode – to be“FIXED”. This is because an auto-layout frame cannot simultaneously stretch to fill its parent and shrink to hug its children.
       */
      return MainAxisSize.max;
    case undefined:
      return;
  }

  // error region
  // @deprecated, but some design still may contain these values
  // since MAX | MIN values are deprecated, it still can be living in a older version file (not reported.)
  if (process.env.NODE_ENV !== "production") {
    console.error("=".repeat(80));
    console.error(
      `"${layoutAlign}" is not hanlded for converting to reflect. report this error @ https://github.com/gridaco/design-sdk/issues/new`
    );
    console.error("=".repeat(80));
  }
  switch (layoutAlign) {
    case "MIN":
      return MainAxisSize.min;
    case "MAX":
      return MainAxisSize.max;
  }
  //
}
