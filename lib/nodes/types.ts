import { checkIfRoot } from "../utils/check-if-root";
import { getGroupLCRS, getNodeLCRS, LCRS } from "../utils/lcrs";

export type ReflectSceneNode =
  | ReflectFrameNode
  | ReflectGroupNode
  | ReflectRectangleNode
  | ReflectEllipseNode
  | ReflectTextNode
  | ReflectLineNode
  | ReflectComponentNode
  | ReflectInstanceNode
// TODO
// | StarNode
// | LineNode
// | PolygonNode;


export interface IConstraintable {
  readonly lcrs: LCRS
}

export interface ReflectConstraintMixin extends IConstraintable {
  constraints: Constraints
}

export interface ReflectGeometryMixin {
  fills: ReadonlyArray<Paint> | PluginAPI["mixed"];
  strokes: ReadonlyArray<Paint>;
  strokeWeight: number;
  strokeMiterLimit: number;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  strokeCap: StrokeCap | PluginAPI["mixed"];
  strokeJoin: StrokeJoin | PluginAPI["mixed"];
  dashPattern: ReadonlyArray<number>;
  fillStyleId: string | PluginAPI["mixed"];
  strokeStyleId: string;
}

export interface ReflectCornerMixin {
  cornerRadius: number | PluginAPI["mixed"];
  cornerSmoothing: number;
}

export interface ReflectRectangleCornerMixin {
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
}

export interface ReflectBlendMixin {
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
  visible: boolean;
  radius: number;
}

export interface ReflectLayoutMixin {
  x: number;
  y: number;
  rotation: number; // In degrees

  width: number;
  height: number;

  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH"; // applicable only inside auto-layout frames
}



class ReflectBaseNode {
  readonly type: NodeType

  constructor(props: {
    id: string,
    name: string
  }) {
    this.id = props.id
    this.name = props.name
  }

  locked: boolean
  id: string;
  parent: (ReflectSceneNode & ReflectChildrenMixin) | null;
  name: string;
  readonly pluginData: { [key: string]: string };

  get isComponent(): boolean {
    return this.type === "COMPONENT" || this.type == "INSTANCE";
  }

  get isMasterComponent(): boolean {
    return this.type == "COMPONENT";
  }

  get isRoot(): boolean {
    // DANGEROUS
    return checkIfRoot(this as any)
  }
}


export abstract class ReflectDefaultShapeMixin
  extends ReflectBaseNode implements
  ReflectBlendMixin,
  ReflectGeometryMixin,
  ReflectRectangleCornerMixin,
  ReflectCornerMixin,
  ReflectLayoutMixin {
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
  visible: boolean;
  radius: number;

  fills: ReadonlyArray<Paint> | PluginAPI["mixed"];
  strokes: ReadonlyArray<Paint>;
  strokeWeight: number;
  strokeMiterLimit: number;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  strokeCap: StrokeCap | PluginAPI["mixed"];
  strokeJoin: StrokeJoin | PluginAPI["mixed"];
  dashPattern: ReadonlyArray<number>;
  fillStyleId: string | PluginAPI["mixed"];
  strokeStyleId: string;

  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;

  cornerRadius: number | PluginAPI["mixed"];
  cornerSmoothing: number;


  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH";
}


export class ReflectLineNode extends ReflectDefaultShapeMixin implements ReflectConstraintMixin {
  readonly type = "LINE"
  constraints: Constraints

  get lcrs(): LCRS {
    return getNodeLCRS(this)
  }
}

export class ReflectRectangleNode extends ReflectDefaultShapeMixin implements
  ReflectCornerMixin,
  ReflectConstraintMixin,
  ReflectRectangleCornerMixin {
  readonly type = "RECTANGLE";


  constraints: Constraints

  get lcrs(): LCRS {
    return getNodeLCRS(this)
  }
}

export class ReflectEllipseNode extends ReflectDefaultShapeMixin {
  readonly type = "ELLIPSE";
}

//#region frame
interface ReflectFrameMixin extends ReflectConstraintMixin {
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  counterAxisSizingMode: "FIXED" | "AUTO"; // applicable only if layoutMode != "NONE"

  // horizontal and vertical were replaced by individual padding in each direction.
  // horizontalPadding: number; // applicable only if layoutMode != "NONE"
  // verticalPadding: number; // applicable only if layoutMode != "NONE"
  itemSpacing: number; // applicable only if layoutMode != "NONE"

  paddingRight: number;
  paddingLeft: number;
  paddingTop: number;
  paddingBottom: number;

  layoutGrids: ReadonlyArray<LayoutGrid>;
  gridStyleId: string;
  clipsContent: boolean;
  guides: ReadonlyArray<Guide>;
}


export class ReflectFrameNode
  extends ReflectBaseNode implements ReflectFrameMixin,
  ReflectChildrenMixin,
  ReflectGeometryMixin,
  ReflectCornerMixin,
  ReflectRectangleCornerMixin,
  ReflectBlendMixin,
  ReflectLayoutMixin {

  readonly type = "FRAME";

  constraints: Constraints

  get lcrs(): LCRS {
    return getNodeLCRS(this)
  }


  // frame mixin
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  counterAxisSizingMode: "FIXED" | "AUTO";
  itemSpacing: number;
  paddingRight: number;
  paddingLeft: number;
  paddingTop: number;
  paddingBottom: number;
  layoutGrids: ReadonlyArray<LayoutGrid>;
  gridStyleId: string;
  clipsContent: boolean;
  guides: ReadonlyArray<Guide>;


  // children mixin
  children: Array<ReflectSceneNode>;
  isRelative?: boolean;

  // geometry mixin
  fills: ReadonlyArray<Paint> | PluginAPI["mixed"];
  strokes: ReadonlyArray<Paint>;
  strokeWeight: number;
  strokeMiterLimit: number;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  strokeCap: StrokeCap | PluginAPI["mixed"];
  strokeJoin: StrokeJoin | PluginAPI["mixed"];
  dashPattern: ReadonlyArray<number>;
  fillStyleId: string | PluginAPI["mixed"];
  strokeStyleId: string;

  // corner mixin
  cornerRadius: number | PluginAPI["mixed"];
  cornerSmoothing: number;


  // rectangle corner mixin
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;


  // blend mixin
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
  visible: boolean;
  radius: number;


  // layout mixin
  x: number;
  y: number;
  rotation: number; // In degrees
  width: number;
  height: number;
  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH";
}
//#endregion

export class ReflectComponentNode extends ReflectFrameNode {
  // FIXME
  // @ts-ignore
  readonly type = "COMPONENT";

  description: string;
  readonly remote: boolean;
  readonly key: string;
}

export class ReflectInstanceNode extends ReflectFrameNode {
  // FIXME
  // @ts-ignore
  readonly type = "INSTANCE";

  masterComponent: ComponentNode;
}



//#region group node
export class ReflectGroupNode
  extends ReflectBaseNode implements
  ReflectChildrenMixin,
  ReflectBlendMixin,
  ReflectLayoutMixin,
  IConstraintable {
  readonly type = "GROUP";

  get lcrs(): LCRS {
    return getGroupLCRS(this)
  }

  // base node mixin
  id: string;
  parent: (ReflectSceneNode & ReflectChildrenMixin) | null;
  name: string;
  readonly pluginData: { [key: string]: string };

  // children mixin
  children: Array<ReflectSceneNode>;
  isRelative?: boolean;

  // blend mixin
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
  visible: boolean;
  radius: number;

  // layout mixin
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH";

}

//#endregion

export class ReflectTextNode extends
  ReflectDefaultShapeMixin implements ReflectConstraintMixin {
  readonly type = "TEXT";

  constraints: Constraints
  get lcrs(): LCRS {
    return getNodeLCRS(this)
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


interface ReflectChildrenMixin {
  children: Array<ReflectSceneNode>;
  isRelative?: boolean;
}