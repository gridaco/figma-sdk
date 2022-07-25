//
// WIP
//
import { mixed } from "@design-sdk/figma-core";

type Transform = [[number, number, number], [number, number, number]];

interface Vector {
  readonly x: number;
  readonly y: number;
}

interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

interface RGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

interface RGBA {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

interface FontName {
  readonly family: string;
  readonly style: string;
}

type TextCase = "ORIGINAL" | "UPPER" | "LOWER" | "TITLE";

type TextDecoration = "NONE" | "UNDERLINE" | "STRIKETHROUGH";

interface ArcData {
  readonly startingAngle: number;
  readonly endingAngle: number;
  readonly innerRadius: number;
}

interface DropShadowEffect {
  readonly type: "DROP_SHADOW";
  readonly color: RGBA;
  readonly offset: Vector;
  readonly radius: number;
  readonly spread?: number;
  readonly visible: boolean;
  readonly blendMode: BlendMode;
  readonly showShadowBehindNode?: boolean;
}

interface InnerShadowEffect {
  readonly type: "INNER_SHADOW";
  readonly color: RGBA;
  readonly offset: Vector;
  readonly radius: number;
  readonly spread?: number;
  readonly visible: boolean;
  readonly blendMode: BlendMode;
}

interface BlurEffect {
  readonly type: "LAYER_BLUR" | "BACKGROUND_BLUR";
  readonly radius: number;
  readonly visible: boolean;
}

type Effect = DropShadowEffect | InnerShadowEffect | BlurEffect;

type ConstraintType = "MIN" | "CENTER" | "MAX" | "STRETCH" | "SCALE";

interface Constraints {
  readonly horizontal: ConstraintType;
  readonly vertical: ConstraintType;
}

interface ColorStop {
  readonly position: number;
  readonly color: RGBA;
}

interface ImageFilters {
  readonly exposure?: number;
  readonly contrast?: number;
  readonly saturation?: number;
  readonly temperature?: number;
  readonly tint?: number;
  readonly highlights?: number;
  readonly shadows?: number;
}

interface SolidPaint {
  readonly type: "SOLID";
  readonly color: RGB;

  readonly visible?: boolean;
  readonly opacity?: number;
  readonly blendMode?: BlendMode;
}

interface GradientPaint {
  readonly type:
    | "GRADIENT_LINEAR"
    | "GRADIENT_RADIAL"
    | "GRADIENT_ANGULAR"
    | "GRADIENT_DIAMOND";
  readonly gradientTransform: Transform;
  readonly gradientStops: ReadonlyArray<ColorStop>;

  readonly visible?: boolean;
  readonly opacity?: number;
  readonly blendMode?: BlendMode;
}

interface ImagePaint {
  readonly type: "IMAGE";
  readonly scaleMode: "FILL" | "FIT" | "CROP" | "TILE";
  readonly imageHash: string | null;
  readonly imageTransform?: Transform; // setting for "CROP"
  readonly scalingFactor?: number; // setting for "TILE"
  readonly rotation?: number; // setting for "FILL" | "FIT" | "TILE"
  readonly filters?: ImageFilters;

  readonly visible?: boolean;
  readonly opacity?: number;
  readonly blendMode?: BlendMode;
}

type Paint = SolidPaint | GradientPaint | ImagePaint;

interface Guide {
  readonly axis: "X" | "Y";
  readonly offset: number;
}

interface RowsColsLayoutGrid {
  readonly pattern: "ROWS" | "COLUMNS";
  readonly alignment: "MIN" | "MAX" | "STRETCH" | "CENTER";
  readonly gutterSize: number;

  readonly count: number; // Infinity when "Auto" is set in the UI
  readonly sectionSize?: number; // Not set for alignment: "STRETCH"
  readonly offset?: number; // Not set for alignment: "CENTER"

  readonly visible?: boolean;
  readonly color?: RGBA;
}

interface GridLayoutGrid {
  readonly pattern: "GRID";
  readonly sectionSize: number;

  readonly visible?: boolean;
  readonly color?: RGBA;
}

type LayoutGrid = RowsColsLayoutGrid | GridLayoutGrid;

interface ExportSettingsConstraints {
  readonly type: "SCALE" | "WIDTH" | "HEIGHT";
  readonly value: number;
}

interface ExportSettingsImage {
  readonly format: "JPG" | "PNG";
  readonly contentsOnly?: boolean; // defaults to true
  readonly useAbsoluteBounds?: boolean; // defaults to false
  readonly suffix?: string;
  readonly constraint?: ExportSettingsConstraints;
}

interface ExportSettingsSVG {
  readonly format: "SVG";
  readonly contentsOnly?: boolean; // defaults to true
  readonly useAbsoluteBounds?: boolean; // defaults to false
  readonly suffix?: string;
  readonly svgOutlineText?: boolean; // defaults to true
  readonly svgIdAttribute?: boolean; // defaults to false
  readonly svgSimplifyStroke?: boolean; // defaults to true
}

interface ExportSettingsPDF {
  readonly format: "PDF";
  readonly contentsOnly?: boolean; // defaults to true
  readonly useAbsoluteBounds?: boolean; // defaults to false
  readonly suffix?: string;
}

type ExportSettings =
  | ExportSettingsImage
  | ExportSettingsSVG
  | ExportSettingsPDF;

type WindingRule = "NONZERO" | "EVENODD";

interface VectorVertex {
  readonly x: number;
  readonly y: number;
  readonly strokeCap?: StrokeCap;
  readonly strokeJoin?: StrokeJoin;
  readonly cornerRadius?: number;
  readonly handleMirroring?: HandleMirroring;
}

interface VectorSegment {
  readonly start: number;
  readonly end: number;
  readonly tangentStart?: Vector; // Defaults to { x: 0, y: 0 }
  readonly tangentEnd?: Vector; // Defaults to { x: 0, y: 0 }
}

interface VectorRegion {
  readonly windingRule: WindingRule;
  readonly loops: ReadonlyArray<ReadonlyArray<number>>;
  readonly fills?: ReadonlyArray<Paint>;
  readonly fillStyleId?: string;
}

interface VectorNetwork {
  readonly vertices: ReadonlyArray<VectorVertex>;
  readonly segments: ReadonlyArray<VectorSegment>;
  readonly regions?: ReadonlyArray<VectorRegion>; // Defaults to []
}

interface VectorPath {
  readonly windingRule: WindingRule | "NONE";
  readonly data: string;
}

type VectorPaths = ReadonlyArray<VectorPath>;

interface LetterSpacing {
  readonly value: number;
  readonly unit: "PIXELS" | "PERCENT";
}

type LineHeight =
  | {
      readonly value: number;
      readonly unit: "PIXELS" | "PERCENT";
    }
  | {
      readonly unit: "AUTO";
    };

type HyperlinkTarget = {
  type: "URL" | "NODE";
  value: string;
};

type TextListOptions = {
  type: "ORDERED" | "UNORDERED" | "NONE";
};

type BlendMode =
  | "PASS_THROUGH"
  | "NORMAL"
  | "DARKEN"
  | "MULTIPLY"
  | "LINEAR_BURN"
  | "COLOR_BURN"
  | "LIGHTEN"
  | "SCREEN"
  | "LINEAR_DODGE"
  | "COLOR_DODGE"
  | "OVERLAY"
  | "SOFT_LIGHT"
  | "HARD_LIGHT"
  | "DIFFERENCE"
  | "EXCLUSION"
  | "HUE"
  | "SATURATION"
  | "COLOR"
  | "LUMINOSITY";

interface Font {
  fontName: FontName;
}

interface StyledTextSegment {
  characters: string;
  start: number;
  end: number;
  fontSize: number;
  fontName: FontName;
  textDecoration: TextDecoration;
  textCase: TextCase;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  fills: Paint[];
  textStyleId: string;
  fillStyleId: string;
  listOptions: TextListOptions;
  indentation: number;
  hyperlink: HyperlinkTarget | null;
}

type Reaction = { action: Action | null; trigger: Trigger | null };

type Action =
  | { readonly type: "BACK" | "CLOSE" }
  | { readonly type: "URL"; url: string }
  | {
      readonly type: "NODE";
      readonly destinationId: string | null;
      readonly navigation: Navigation;
      readonly transition: Transition | null;
      readonly preserveScrollPosition: boolean;

      // Only present if navigation == "OVERLAY" and the destination uses
      // overlay position type "RELATIVE"
      readonly overlayRelativePosition?: Vector;
    };

interface SimpleTransition {
  readonly type: "DISSOLVE" | "SMART_ANIMATE" | "SCROLL_ANIMATE";
  readonly easing: Easing;
  readonly duration: number;
}

interface DirectionalTransition {
  readonly type: "MOVE_IN" | "MOVE_OUT" | "PUSH" | "SLIDE_IN" | "SLIDE_OUT";
  readonly direction: "LEFT" | "RIGHT" | "TOP" | "BOTTOM";
  readonly matchLayers: boolean;

  readonly easing: Easing;
  readonly duration: number;
}

type Transition = SimpleTransition | DirectionalTransition;

type Trigger =
  | { readonly type: "ON_CLICK" | "ON_HOVER" | "ON_PRESS" | "ON_DRAG" }
  | {
      readonly type: "AFTER_TIMEOUT";
      readonly timeout: number;
    }
  | {
      readonly type: "MOUSE_ENTER" | "MOUSE_LEAVE" | "MOUSE_UP" | "MOUSE_DOWN";
      readonly delay: number;
    }
  | {
      readonly type: "ON_KEY_DOWN";
      readonly device:
        | "KEYBOARD"
        | "XBOX_ONE"
        | "PS4"
        | "SWITCH_PRO"
        | "UNKNOWN_CONTROLLER";
      readonly keyCodes: ReadonlyArray<number>;
    };

type Navigation = "NAVIGATE" | "SWAP" | "OVERLAY" | "SCROLL_TO" | "CHANGE_TO";

interface Easing {
  readonly type:
    | "EASE_IN"
    | "EASE_OUT"
    | "EASE_IN_AND_OUT"
    | "LINEAR"
    | "EASE_IN_BACK"
    | "EASE_OUT_BACK"
    | "EASE_IN_AND_OUT_BACK"
    | "CUSTOM_CUBIC_BEZIER";
  readonly easingFunctionCubicBezier?: EasingFunctionBezier;
}

interface EasingFunctionBezier {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

type OverflowDirection = "NONE" | "HORIZONTAL" | "VERTICAL" | "BOTH";

type OverlayPositionType =
  | "CENTER"
  | "TOP_LEFT"
  | "TOP_CENTER"
  | "TOP_RIGHT"
  | "BOTTOM_LEFT"
  | "BOTTOM_CENTER"
  | "BOTTOM_RIGHT"
  | "MANUAL";

type OverlayBackground =
  | { readonly type: "NONE" }
  | { readonly type: "SOLID_COLOR"; readonly color: RGBA };

type OverlayBackgroundInteraction = "NONE" | "CLOSE_ON_CLICK_OUTSIDE";

type PublishStatus = "UNPUBLISHED" | "CURRENT" | "CHANGED";

interface ConnectorEndpointPosition {
  position: { x: number; y: number };
}

interface ConnectorEndpointPositionAndEndpointNodeId {
  position: { x: number; y: number };
  endpointNodeId: string;
}

interface ConnectorEndpointEndpointNodeIdAndMagnet {
  endpointNodeId: string;
  magnet: "NONE" | "AUTO" | "TOP" | "LEFT" | "BOTTOM" | "RIGHT";
}

type ConnectorEndpoint =
  | ConnectorEndpointPosition
  | ConnectorEndpointEndpointNodeIdAndMagnet
  | ConnectorEndpointPositionAndEndpointNodeId;

type ConnectorStrokeCap =
  | "NONE"
  | "ARROW_EQUILATERAL"
  | "ARROW_LINES"
  | "TRIANGLE_FILLED"
  | "DIAMOND_FILLED"
  | "CIRCLE_FILLED";

////////////////////////////////////////////////////////////////////////////////
// Mixins

interface BaseNodeMixin extends PluginDataMixin {
  readonly id: string;
  readonly parent: (BaseNode & ChildrenMixin) | null;
  name: string; // Note: setting this also sets `autoRename` to false on TextNodes
  readonly removed: boolean;
  toString(): string;
  remove(): void;

  setRelaunchData(data: { [command: string]: /* description */ string }): void;
  getRelaunchData(): { [command: string]: /* description */ string };
}

interface PluginDataMixin {
  getPluginData(key: string): string;
  setPluginData(key: string, value: string): void;
  getPluginDataKeys(): string[];

  // Namespace is a string that must be at least 3 alphanumeric characters, and should
  // be a name related to your plugin. Other plugins will be able to read this data.
  getSharedPluginData(namespace: string, key: string): string;
  setSharedPluginData(namespace: string, key: string, value: string): void;
  getSharedPluginDataKeys(namespace: string): string[];
}

interface SceneNodeMixin {
  visible: boolean;
  locked: boolean;
  readonly stuckNodes: SceneNode[];
  readonly attachedConnectors: ConnectorNode[];
  componentPropertyReferences:
    | {
        [nodeProperty in "visible" | "characters" | "mainComponent"]: string;
      }
    | null;
}

interface StickableMixin {
  stuckTo: SceneNode | null;
}

interface ChildrenMixin {
  readonly children: ReadonlyArray<SceneNode>;

  appendChild(child: SceneNode): void;
  insertChild(index: number, child: SceneNode): void;

  findChildren(callback?: (node: SceneNode) => boolean): SceneNode[];
  findChild(callback: (node: SceneNode) => boolean): SceneNode | null;

  /**
   * If you only need to search immediate children, it is much faster
   * to call node.children.filter(callback) or node.findChildren(callback)
   */
  findAll(callback?: (node: SceneNode) => boolean): SceneNode[];

  /**
   * If you only need to search immediate children, it is much faster
   * to call node.children.find(callback) or node.findChild(callback)
   */
  findOne(callback: (node: SceneNode) => boolean): SceneNode | null;

  findAllWithCriteria<T extends NodeType[]>(criteria: {
    types: T;
  }): Array<{ type: T[number] } & SceneNode>;

  findWidgetNodesByWidgetId(widgetId: string): Array<WidgetNode>;
}

interface ConstraintMixin {
  constraints: Constraints;
}

interface LayoutMixin {
  readonly absoluteTransform: Transform;
  relativeTransform: Transform;
  x: number;
  y: number;
  rotation: number; // In degrees

  readonly width: number;
  readonly height: number;
  readonly absoluteRenderBounds: Rect | null;
  readonly absoluteBoundingBox: Rect | null;
  constrainProportions: boolean;

  // applicable only inside auto-layout frames
  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";
  layoutGrow: number;
  layoutPositioning: "AUTO" | "ABSOLUTE";

  resize(width: number, height: number): void;
  resizeWithoutConstraints(width: number, height: number): void;
  rescale(scale: number): void;
}

interface BlendMixin extends MinimalBlendMixin {
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
}

interface ContainerMixin {
  expanded: boolean;
  backgrounds: ReadonlyArray<Paint>; // DEPRECATED: use 'fills' instead
  backgroundStyleId: string; // DEPRECATED: use 'fillStyleId' instead
}

type StrokeCap =
  | "NONE"
  | "ROUND"
  | "SQUARE"
  | "ARROW_LINES"
  | "ARROW_EQUILATERAL";
type StrokeJoin = "MITER" | "BEVEL" | "ROUND";
type HandleMirroring = "NONE" | "ANGLE" | "ANGLE_AND_LENGTH";

interface MinimalStrokesMixin {
  strokes: ReadonlyArray<Paint>;
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: StrokeJoin | typeof mixed;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  dashPattern: ReadonlyArray<number>;
  strokeGeometry: VectorPaths;
}

interface IndividualStrokesMixin {
  strokeTopWeight: number;
  strokeBottomWeight: number;
  strokeLeftWeight: number;
  strokeRightWeight: number;
}

interface MinimalFillsMixin {
  fills: ReadonlyArray<Paint> | typeof mixed;
  fillStyleId: string | typeof mixed;
}

interface GeometryMixin extends MinimalStrokesMixin, MinimalFillsMixin {
  strokeCap: StrokeCap | typeof mixed;
  strokeMiterLimit: number;
  outlineStroke(): VectorNode | null;
  fillGeometry: VectorPaths;
}

interface CornerMixin {
  cornerRadius: number | typeof mixed;
  cornerSmoothing: number;
}

interface RectangleCornerMixin {
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
}

interface ExportMixin {
  exportSettings: ReadonlyArray<ExportSettings>;
  exportAsync(settings?: ExportSettings): Promise<Uint8Array>; // Defaults to PNG format
}

interface FramePrototypingMixin {
  overflowDirection: OverflowDirection;
  numberOfFixedChildren: number;

  readonly overlayPositionType: OverlayPositionType;
  readonly overlayBackground: OverlayBackground;
  readonly overlayBackgroundInteraction: OverlayBackgroundInteraction;
}

interface VectorLikeMixin {
  vectorNetwork: VectorNetwork;
  vectorPaths: VectorPaths;
  handleMirroring: HandleMirroring | typeof mixed;
}
interface ReactionMixin {
  reactions: ReadonlyArray<Reaction>;
}

interface DocumentationLink {
  readonly uri: string;
}

interface PublishableMixin {
  description: string;
  documentationLinks: ReadonlyArray<DocumentationLink>;
  readonly remote: boolean;
  readonly key: string; // The key to use with "importComponentByKeyAsync", "importComponentSetByKeyAsync", and "importStyleByKeyAsync"
  getPublishStatusAsync(): Promise<PublishStatus>;
}

interface DefaultShapeMixin
  extends BaseNodeMixin,
    SceneNodeMixin,
    ReactionMixin,
    BlendMixin,
    GeometryMixin,
    LayoutMixin,
    ExportMixin {}

interface BaseFrameMixin
  extends BaseNodeMixin,
    SceneNodeMixin,
    ChildrenMixin,
    ContainerMixin,
    GeometryMixin,
    CornerMixin,
    RectangleCornerMixin,
    BlendMixin,
    ConstraintMixin,
    LayoutMixin,
    ExportMixin,
    IndividualStrokesMixin {
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO"; // applicable only if layoutMode != "NONE"
  counterAxisSizingMode: "FIXED" | "AUTO"; // applicable only if layoutMode != "NONE"

  primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN"; // applicable only if layoutMode != "NONE"
  counterAxisAlignItems: "MIN" | "MAX" | "CENTER" | "BASELINE"; // applicable only if layoutMode != "NONE"

  paddingLeft: number; // applicable only if layoutMode != "NONE"
  paddingRight: number; // applicable only if layoutMode != "NONE"
  paddingTop: number; // applicable only if layoutMode != "NONE"
  paddingBottom: number; // applicable only if layoutMode != "NONE"
  itemSpacing: number; // applicable only if layoutMode != "NONE"
  itemReverseZIndex: boolean; // applicable only if layoutMode != "NONE"
  strokesIncludedInLayout: boolean; // applicable only if layoutMode != "NONE"

  horizontalPadding: number; // DEPRECATED: use the individual paddings
  verticalPadding: number; // DEPRECATED: use the individual paddings

  layoutGrids: ReadonlyArray<LayoutGrid>;
  gridStyleId: string;
  clipsContent: boolean;
  guides: ReadonlyArray<Guide>;
}

interface DefaultFrameMixin
  extends BaseFrameMixin,
    FramePrototypingMixin,
    ReactionMixin {}

interface OpaqueNodeMixin extends BaseNodeMixin, SceneNodeMixin, ExportMixin {
  readonly absoluteTransform: Transform;
  relativeTransform: Transform;
  x: number;
  y: number;
  readonly width: number;
  readonly height: number;
}

interface MinimalBlendMixin {
  opacity: number;
  blendMode: BlendMode;
}

interface VariantMixin {
  readonly variantProperties: { [property: string]: string } | null;
}

interface ComponentPropertiesMixin {
  readonly componentPropertyDefinitions: ComponentPropertyDefinitions;
  addComponentProperty(
    propertyName: string,
    type: ComponentPropertyType,
    defaultValue: string | boolean
  ): string;
  editComponentProperty(
    propertyName: string,
    newValue: { name?: string; defaultValue?: string | boolean }
  ): string;
  deleteComponentProperty(propertyName: string): void;
}

interface TextSublayerNode extends MinimalFillsMixin {
  readonly hasMissingFont: boolean;

  paragraphIndent: number;
  paragraphSpacing: number;

  fontSize: number | typeof mixed;
  fontName: FontName | typeof mixed;
  textCase: TextCase | typeof mixed;
  textDecoration: TextDecoration | typeof mixed;
  letterSpacing: LetterSpacing | typeof mixed;
  lineHeight: LineHeight | typeof mixed;
  hyperlink: HyperlinkTarget | null | typeof mixed;

  characters: string;
  insertCharacters(
    start: number,
    characters: string,
    useStyle?: "BEFORE" | "AFTER"
  ): void;
  deleteCharacters(start: number, end: number): void;

  getRangeFontSize(start: number, end: number): number | typeof mixed;
  setRangeFontSize(start: number, end: number, value: number): void;
  getRangeFontName(start: number, end: number): FontName | typeof mixed;
  setRangeFontName(start: number, end: number, value: FontName): void;
  getRangeAllFontNames(start: number, end: number): FontName[];
  getRangeTextCase(start: number, end: number): TextCase | typeof mixed;
  setRangeTextCase(start: number, end: number, value: TextCase): void;
  getRangeTextDecoration(
    start: number,
    end: number
  ): TextDecoration | typeof mixed;
  setRangeTextDecoration(
    start: number,
    end: number,
    value: TextDecoration
  ): void;
  getRangeLetterSpacing(
    start: number,
    end: number
  ): LetterSpacing | typeof mixed;
  setRangeLetterSpacing(start: number, end: number, value: LetterSpacing): void;
  getRangeLineHeight(start: number, end: number): LineHeight | typeof mixed;
  setRangeLineHeight(start: number, end: number, value: LineHeight): void;
  getRangeHyperlink(
    start: number,
    end: number
  ): HyperlinkTarget | null | typeof mixed;
  setRangeHyperlink(
    start: number,
    end: number,
    value: HyperlinkTarget | null
  ): void;
  getRangeFills(start: number, end: number): Paint[] | typeof mixed;
  setRangeFills(start: number, end: number, value: Paint[]): void;
  getRangeTextStyleId(start: number, end: number): string | typeof mixed;
  setRangeTextStyleId(start: number, end: number, value: string): void;
  getRangeFillStyleId(start: number, end: number): string | typeof mixed;
  setRangeFillStyleId(start: number, end: number, value: string): void;
  getRangeListOptions(
    start: number,
    end: number
  ): TextListOptions | typeof mixed;
  setRangeListOptions(start: number, end: number, value: TextListOptions): void;
  getRangeIndentation(start: number, end: number): number | typeof mixed;
  setRangeIndentation(start: number, end: number, value: number): void;
  getStyledTextSegments<
    StyledTextSegmentFields extends (keyof Omit<
      StyledTextSegment,
      "characters" | "start" | "end"
    >)[]
  >(
    fields: StyledTextSegmentFields,
    start?: number,
    end?: number
  ): Array<
    Pick<
      StyledTextSegment,
      StyledTextSegmentFields[number] | "characters" | "start" | "end"
    >
  >;
}

////////////////////////////////////////////////////////////////////////////////
// Nodes

interface DocumentNode extends BaseNodeMixin {
  readonly type: "DOCUMENT";

  readonly children: ReadonlyArray<PageNode>;

  appendChild(child: PageNode): void;
  insertChild(index: number, child: PageNode): void;
  findChildren(callback?: (node: PageNode) => boolean): Array<PageNode>;
  findChild(callback: (node: PageNode) => boolean): PageNode | null;

  /**
   * If you only need to search immediate children, it is much faster
   * to call node.children.filter(callback) or node.findChildren(callback)
   */
  findAll(
    callback?: (node: PageNode | SceneNode) => boolean
  ): Array<PageNode | SceneNode>;

  /**
   * If you only need to search immediate children, it is much faster
   * to call node.children.find(callback) or node.findChild(callback)
   */
  findOne(
    callback: (node: PageNode | SceneNode) => boolean
  ): PageNode | SceneNode | null;

  findAllWithCriteria<T extends NodeType[]>(criteria: {
    types: T;
  }): Array<{ type: T[number] } & (PageNode | SceneNode)>;
}

interface PageNode extends BaseNodeMixin, ChildrenMixin, ExportMixin {
  readonly type: "PAGE";
  clone(): PageNode;

  guides: ReadonlyArray<Guide>;
  selection: ReadonlyArray<SceneNode>;
  selectedTextRange: { node: TextNode; start: number; end: number } | null;
  flowStartingPoints: ReadonlyArray<{ nodeId: string; name: string }>;

  backgrounds: ReadonlyArray<Paint>;

  prototypeBackgrounds: ReadonlyArray<Paint>;

  readonly prototypeStartNode:
    | FrameNode
    | GroupNode
    | ComponentNode
    | InstanceNode
    | null;
}

interface FrameNode extends DefaultFrameMixin {
  readonly type: "FRAME";
  clone(): FrameNode;
}

interface GroupNode
  extends BaseNodeMixin,
    SceneNodeMixin,
    ReactionMixin,
    ChildrenMixin,
    ContainerMixin,
    BlendMixin,
    LayoutMixin,
    ExportMixin {
  readonly type: "GROUP";
  clone(): GroupNode;
}

interface SliceNode
  extends BaseNodeMixin,
    SceneNodeMixin,
    LayoutMixin,
    ExportMixin {
  readonly type: "SLICE";
  clone(): SliceNode;
}

interface RectangleNode
  extends DefaultShapeMixin,
    ConstraintMixin,
    CornerMixin,
    RectangleCornerMixin,
    IndividualStrokesMixin {
  readonly type: "RECTANGLE";
  clone(): RectangleNode;
}

interface LineNode extends DefaultShapeMixin, ConstraintMixin {
  readonly type: "LINE";
  clone(): LineNode;
}

interface EllipseNode extends DefaultShapeMixin, ConstraintMixin, CornerMixin {
  readonly type: "ELLIPSE";
  clone(): EllipseNode;
  arcData: ArcData;
}

interface PolygonNode extends DefaultShapeMixin, ConstraintMixin, CornerMixin {
  readonly type: "POLYGON";
  clone(): PolygonNode;
  pointCount: number;
}

interface StarNode extends DefaultShapeMixin, ConstraintMixin, CornerMixin {
  readonly type: "STAR";
  clone(): StarNode;
  pointCount: number;
  innerRadius: number;
}

interface VectorNode
  extends DefaultShapeMixin,
    ConstraintMixin,
    CornerMixin,
    VectorLikeMixin {
  readonly type: "VECTOR";
  clone(): VectorNode;
}

interface TextNode
  extends DefaultShapeMixin,
    ConstraintMixin,
    TextSublayerNode {
  readonly type: "TEXT";
  clone(): TextNode;

  textAlignHorizontal: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  textAlignVertical: "TOP" | "CENTER" | "BOTTOM";
  textAutoResize: "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT" | "TRUNCATE";
  autoRename: boolean;

  textStyleId: string | typeof mixed;
}

type ComponentPropertyType = "BOOLEAN" | "TEXT" | "INSTANCE_SWAP" | "VARIANT";

type ComponentPropertyDefinitions = {
  [propertyName: string]: {
    type: ComponentPropertyType;
    defaultValue: string | boolean;
    variantOptions?: string[];
  };
};

interface ComponentSetNode
  extends BaseFrameMixin,
    PublishableMixin,
    ComponentPropertiesMixin {
  readonly type: "COMPONENT_SET";
  clone(): ComponentSetNode;
  readonly defaultVariant: ComponentNode;
  readonly variantGroupProperties: { [property: string]: { values: string[] } };
}

interface ComponentNode
  extends DefaultFrameMixin,
    PublishableMixin,
    VariantMixin,
    ComponentPropertiesMixin {
  readonly type: "COMPONENT";
  clone(): ComponentNode;
  createInstance(): InstanceNode;
}

type ComponentProperties = {
  [propertyName: string]: {
    type: ComponentPropertyType;
    value: string | boolean;
  };
};

interface InstanceNode extends DefaultFrameMixin, VariantMixin {
  readonly type: "INSTANCE";
  clone(): InstanceNode;
  mainComponent: ComponentNode | null;
  swapComponent(componentNode: ComponentNode): void;
  setProperties(properties: { [propertyName: string]: string | boolean }): void;
  readonly componentProperties: ComponentProperties;
  detachInstance(): FrameNode;
  scaleFactor: number;
}

interface BooleanOperationNode
  extends DefaultShapeMixin,
    ChildrenMixin,
    CornerMixin {
  readonly type: "BOOLEAN_OPERATION";
  clone(): BooleanOperationNode;
  booleanOperation: "UNION" | "INTERSECT" | "SUBTRACT" | "EXCLUDE";

  expanded: boolean;
}

interface StickyNode
  extends OpaqueNodeMixin,
    MinimalFillsMixin,
    MinimalBlendMixin {
  readonly type: "STICKY";
  readonly text: TextSublayerNode;
  authorVisible: boolean;
  authorName: string;
  clone(): StickyNode;
}

interface StampNode extends DefaultShapeMixin, ConstraintMixin, StickableMixin {
  readonly type: "STAMP";
  clone(): StampNode;
  getAuthorAsync(): Promise<BaseUser | null>;
}

interface HighlightNode
  extends DefaultShapeMixin,
    ConstraintMixin,
    CornerMixin,
    ReactionMixin,
    VectorLikeMixin,
    StickableMixin {
  readonly type: "HIGHLIGHT";
  clone(): HighlightNode;
}

interface WashiTapeNode extends DefaultShapeMixin, StickableMixin {
  readonly type: "WASHI_TAPE";
  clone(): WashiTapeNode;
}

interface ShapeWithTextNode
  extends OpaqueNodeMixin,
    MinimalFillsMixin,
    MinimalBlendMixin,
    MinimalStrokesMixin {
  readonly type: "SHAPE_WITH_TEXT";
  shapeType:
    | "SQUARE"
    | "ELLIPSE"
    | "ROUNDED_RECTANGLE"
    | "DIAMOND"
    | "TRIANGLE_UP"
    | "TRIANGLE_DOWN"
    | "PARALLELOGRAM_RIGHT"
    | "PARALLELOGRAM_LEFT"
    | "ENG_DATABASE"
    | "ENG_QUEUE"
    | "ENG_FILE"
    | "ENG_FOLDER";
  readonly text: TextSublayerNode;
  readonly cornerRadius?: number;
  rotation: number;

  resize(width: number, height: number): void;
  rescale(scale: number): void;
  clone(): ShapeWithTextNode;
}

interface CodeBlockNode extends OpaqueNodeMixin, MinimalBlendMixin {
  readonly type: "CODE_BLOCK";
  code: string;
  codeLanguage:
    | "TYPESCRIPT"
    | "CPP"
    | "RUBY"
    | "CSS"
    | "JAVASCRIPT"
    | "HTML"
    | "JSON"
    | "GRAPHQL"
    | "PYTHON"
    | "GO"
    | "SQL"
    | "SWIFT"
    | "KOTLIN"
    | "RUST";
  clone(): CodeBlockNode;
}

interface LabelSublayerNode {
  fills: Paint[] | typeof mixed;
}

interface ConnectorNode
  extends OpaqueNodeMixin,
    MinimalBlendMixin,
    MinimalStrokesMixin {
  readonly type: "CONNECTOR";
  readonly text: TextSublayerNode;
  readonly textBackground: LabelSublayerNode;
  readonly cornerRadius?: number;
  connectorLineType: "ELBOWED" | "STRAIGHT";
  connectorStart: ConnectorEndpoint;
  connectorEnd: ConnectorEndpoint;
  connectorStartStrokeCap: ConnectorStrokeCap;
  connectorEndStrokeCap: ConnectorStrokeCap;
  rotation: number;
  clone(): ConnectorNode;
}

interface WidgetNode extends OpaqueNodeMixin, StickableMixin {
  readonly type: "WIDGET";
  readonly widgetId: string;
  readonly widgetSyncedState: { [key: string]: any };
  clone(): WidgetNode;
  cloneWidget(
    syncedStateOverrides: { [name: string]: any },
    syncedMapOverrides?: { [mapName: string]: { [key: string]: any } }
  ): WidgetNode;

  setWidgetSyncedState(
    syncedState: { [name: string]: any },
    syncedMap?: { [mapName: string]: { [key: string]: any } }
  ): void;
}

interface EmbedData {
  srcUrl: string;
  canonicalUrl: string | null;
  title: string | null;
  description: string | null;
  provider: string | null;
}
interface EmbedNode extends OpaqueNodeMixin, SceneNodeMixin {
  readonly type: "EMBED";
  readonly embedData: EmbedData;
  clone(): EmbedNode;
}

interface LinkUnfurlData {
  url: string;
  title: string | null;
  description: string | null;
  provider: string | null;
}
interface LinkUnfurlNode extends OpaqueNodeMixin, SceneNodeMixin {
  readonly type: "LINK_UNFURL";
  readonly linkUnfurlData: LinkUnfurlData;
  clone(): LinkUnfurlNode;
}

interface MediaData {
  hash: string;
}
interface MediaNode extends OpaqueNodeMixin {
  readonly type: "MEDIA";
  readonly mediaData: MediaData;

  resize(width: number, height: number): void;
  resizeWithoutConstraints(width: number, height: number): void;
  clone(): MediaNode;
}

interface SectionNode
  extends ChildrenMixin,
    MinimalFillsMixin,
    OpaqueNodeMixin {
  readonly type: "SECTION";
  clone(): SectionNode;
  resizeWithoutConstraints(width: number, height: number): void;
}

type BaseNode = DocumentNode | PageNode | SceneNode;

type SceneNode =
  | SliceNode
  | FrameNode
  | GroupNode
  | ComponentSetNode
  | ComponentNode
  | InstanceNode
  | BooleanOperationNode
  | VectorNode
  | StarNode
  | LineNode
  | EllipseNode
  | PolygonNode
  | RectangleNode
  | TextNode
  | StickyNode
  | ConnectorNode
  | ShapeWithTextNode
  | CodeBlockNode
  | StampNode
  | WidgetNode
  | EmbedNode
  | LinkUnfurlNode
  | MediaNode
  | SectionNode
  | HighlightNode
  | WashiTapeNode;

type NodeType = BaseNode["type"];

////////////////////////////////////////////////////////////////////////////////
// Styles
type StyleType = "PAINT" | "TEXT" | "EFFECT" | "GRID";

interface BaseStyle extends PublishableMixin, PluginDataMixin {
  readonly id: string;
  readonly type: StyleType;
  name: string;
  remove(): void;
}

interface PaintStyle extends BaseStyle {
  type: "PAINT";
  paints: ReadonlyArray<Paint>;
}

interface TextStyle extends BaseStyle {
  type: "TEXT";
  fontSize: number;
  textDecoration: TextDecoration;
  fontName: FontName;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeight;
  paragraphIndent: number;
  paragraphSpacing: number;
  textCase: TextCase;
}

interface EffectStyle extends BaseStyle {
  type: "EFFECT";
  effects: ReadonlyArray<Effect>;
}

interface GridStyle extends BaseStyle {
  type: "GRID";
  layoutGrids: ReadonlyArray<LayoutGrid>;
}

////////////////////////////////////////////////////////////////////////////////
// Other

interface Image {
  readonly hash: string;
  getBytesAsync(): Promise<Uint8Array>;
}

interface BaseUser {
  readonly id: string | null;
  readonly name: string;
  readonly photoUrl: string | null;
}

export type {
  Transform,
  Rect,
  RGB,
  RGBA,
  FontName,
  TextCase,
  TextDecoration,
  ArcData,
  DropShadowEffect,
  InnerShadowEffect,
  BlurEffect,
  Effect,
  ConstraintType,
  Constraints,
  ColorStop,
  ImageFilters,
  SolidPaint,
  GradientPaint,
  ImagePaint,
  Paint,
  Guide,
  RowsColsLayoutGrid,
  GridLayoutGrid,
  LayoutGrid,
  ExportSettingsConstraints,
  ExportSettingsImage,
  ExportSettingsSVG,
  ExportSettingsPDF,
  ExportSettings,
  WindingRule,
  VectorVertex,
  VectorSegment,
  VectorRegion,
  VectorNetwork,
  VectorPath,
  VectorPaths,
  LetterSpacing,
  LineHeight,
  HyperlinkTarget,
  TextListOptions,
  BlendMode,
  Font,
  StyledTextSegment,
  Reaction,
  Action,
  SimpleTransition,
  DirectionalTransition,
  Transition,
  Trigger,
  Navigation,
  Easing,
  EasingFunctionBezier,
  OverflowDirection,
  OverlayPositionType,
  OverlayBackground,
  OverlayBackgroundInteraction,
  PublishStatus,
  ConnectorEndpointPosition,
  ConnectorEndpointPositionAndEndpointNodeId,
  ConnectorEndpointEndpointNodeIdAndMagnet,
  ConnectorEndpoint,
  ConnectorStrokeCap,
  //
  BaseNodeMixin,
  SceneNodeMixin,
  StickableMixin,
  ChildrenMixin,
  ConstraintMixin,
  LayoutMixin,
  BlendMixin,
  ContainerMixin,
  StrokeCap,
  StrokeJoin,
  HandleMirroring,
  MinimalStrokesMixin,
  IndividualStrokesMixin,
  MinimalFillsMixin,
  GeometryMixin,
  CornerMixin,
  RectangleCornerMixin,
  ExportMixin,
  FramePrototypingMixin,
  VectorLikeMixin,
  DocumentationLink,
  PublishableMixin,
  DefaultShapeMixin,
  BaseFrameMixin,
  DefaultFrameMixin,
  OpaqueNodeMixin,
  MinimalBlendMixin,
  VariantMixin,
  ComponentPropertiesMixin,
  TextSublayerNode,
  // nodes
  DocumentNode,
  PageNode,
  FrameNode,
  GroupNode,
  SliceNode,
  RectangleNode,
  LineNode,
  EllipseNode,
  PolygonNode,
  StarNode,
  VectorNode,
  TextNode,
  ComponentPropertyType,
  ComponentPropertyDefinitions,
  ComponentSetNode,
  ComponentNode,
  ComponentProperties,
  InstanceNode,
  BooleanOperationNode,
  StickyNode,
  StampNode,
  HighlightNode,
  WashiTapeNode,
  ShapeWithTextNode,
  CodeBlockNode,
  LabelSublayerNode,
  ConnectorNode,
  WidgetNode,
  EmbedData,
  EmbedNode,
  LinkUnfurlData,
  LinkUnfurlNode,
  MediaData,
  MediaNode,
  SectionNode,
  BaseNode,
  SceneNode,
  // styles
  StyleType,
  BaseStyle,
  PaintStyle,
  TextStyle,
  EffectStyle,
  GridStyle,
  // other
  Image,
  BaseUser,
};
