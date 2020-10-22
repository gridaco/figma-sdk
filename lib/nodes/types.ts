import { checkIfRoot } from "../utils/check-if-root";
import { calculateLCRS, getGroupLCRS, getNodeLCRS, LCRS } from "../utils/lcrs";

export type ReflectSceneNode =
  | ReflectFrameNode
  | ReflectGroupNode
  | ReflectRectangleNode
  | ReflectEllipseNode
  | ReflectTextNode
  | ReflectLineNode
  | ReflectComponentNode
  | ReflectInstanceNode
  | ReflectConstraintMixin
  | ReflectChildrenMixin
// TODO
// | StarNode
// | LineNode
// | PolygonNode;



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

export enum ReflectSceneNodeType {
  group = "GROUP",
  component = "COMPONENT",
  constraint = "CONSTRAINT",
  instance = "INSTANCE",
  text = "TEXT",
  frame = "FRAME",
  ellipse = "ELLIPSE",
  rectangle = "RECTANGLE",
  line = "LINE",
}

class ReflectBaseNode implements ReflectLayoutMixin, ReflectBlendMixin {
  readonly type: ReflectSceneNodeType

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

  // layout related
  x: number;
  y: number;
  rotation: number; // In degrees
  width: number;
  height: number;
  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH";
  //

  // blen related
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
  visible: boolean;
  radius: number;
  //

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


export class ReflectConstraintMixin extends ReflectBaseNode {
  // @ts-ignore
  get type() {
    return ReflectSceneNodeType.constraint
  }
  constraints: Constraints

  /**
   * the current node's LCRS positioning.
   */
  get lcrs(): LCRS {
    return getNodeLCRS(this)
  }

  /**
   * the cureent node's LCRS positioning actually relative to parent.
   */
  get relativeLcrs(): LCRS {
    return getReletiveLCRS(this, this.parent);
  }
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


export abstract class ReflectDefaultShapeMixin
  extends ReflectConstraintMixin implements
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


export class ReflectLineNode extends ReflectDefaultShapeMixin {
  get type() {
    return ReflectSceneNodeType.line
  }
}

/**
 * 
 * @param target the target node a.k.a current node
 * @param reletiveTo the parent node of target node in generatl.
 */
function getReletiveLCRS(target: ReflectSceneNode, reletiveTo: ReflectSceneNode): LCRS {

  // FIXME rel does not work with group as expected.
  const relX = target.x
  const relXCenter = relX + (target.width / 2)
  const relY = target.y
  const relYCenter = relY + (target.height / 2)

  const lcrs = calculateLCRS({
    centerPosition: relXCenter,
    startPosition: target.x,
    containerWidth: reletiveTo.width,
    width: target.width
  })

  return lcrs
}

export class ReflectRectangleNode extends ReflectDefaultShapeMixin implements
  ReflectCornerMixin,
  ReflectRectangleCornerMixin {

  get type() {
    return ReflectSceneNodeType.rectangle
  }

}

export class ReflectEllipseNode extends ReflectDefaultShapeMixin {
  get type() {
    return ReflectSceneNodeType.ellipse
  }
}

//#region frame
interface ReflectFrameMixin {
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

export abstract class ReflectChildrenMixin extends ReflectConstraintMixin {

  children: Array<ReflectSceneNode>;
  get constraintableChildren(): Array<ReflectConstraintMixin> {
    return filterConstraintableChildren(this)
  }
  isRelative?: boolean;
}

function filterConstraintableChildren(node: ReflectChildrenMixin) {
  const constraintables: Array<ReflectConstraintMixin> = [];
  for (const childNode of node.children) {
    if (childNode.type == "INSTANCE" || childNode.type == "COMPONENT" || childNode.type == "FRAME" || childNode.type == "RECTANGLE" || childNode.type == "GROUP" || childNode.type == "LINE" || childNode.type == "ELLIPSE" || childNode.type == "TEXT") {
      constraintables.push(childNode as ReflectConstraintMixin);
    }
  }
  return constraintables;
}


export class ReflectFrameNode
  extends ReflectChildrenMixin implements ReflectFrameMixin,
  ReflectGeometryMixin,
  ReflectCornerMixin,
  ReflectRectangleCornerMixin,
  ReflectBlendMixin,
  ReflectLayoutMixin {

  get type() {
    return ReflectSceneNodeType.frame;
  }

  constraints: Constraints


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
  readonly type = ReflectSceneNodeType.component;

  description: string;
  readonly remote: boolean;
  readonly key: string;
}

export class ReflectInstanceNode extends ReflectFrameNode {
  // FIXME
  // @ts-ignore
  readonly type = ReflectSceneNodeType.instance;

  masterComponent: ComponentNode;
}



//#region group node
export class ReflectGroupNode
  extends ReflectChildrenMixin implements
  ReflectChildrenMixin,
  ReflectBlendMixin,
  ReflectLayoutMixin {
  get type() {
    return ReflectSceneNodeType.group
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

