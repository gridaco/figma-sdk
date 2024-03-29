import type {
  Axis,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisAlignment,
  BoxShadowManifest,
} from "@reflect-ui/core";
import type { ReflectSceneNode } from "./node-type-alias";
import { ReflectSceneNodeType } from "./node-type";
import { array } from "@reflect-ui/uiutils";
// FIXME - need migration
import type { FigmaFileKey } from "@design-sdk/figma-core";
import {
  hasImage,
  checkIfRoot,
  retrieveImageFills,
  retrievePrimaryImageFill,
  retrieveFill,
  retrievePrimaryColor,
  filterFills,
  mapGrandchildren,
} from "@design-sdk/figma-utils";
import { IReflectLayoutMixin } from "./mixins/layout.mixin";
import { IReflectBlendMixin } from "./mixins/blend.mixin";
import {
  IReflectNodeBasicReference,
  IReflectNodeBaseReference,
  makeReference,
} from "./reflect-node-reference";
import { types } from "@reflect-ui/uiutils";
import type { BlendMode } from "@reflect-ui/cg";
import type {
  ChildrenMixin,
  Effect,
  FigmaLayoutGrow,
  FigmaLayoutAlign,
  InstanceNode,
  Paint,
  SceneNode,
  Image,
} from "@design-sdk/figma-types";
import { plugin } from "@design-sdk/figma-types";

type Transform = types.Transform;
type RGBAF = types.RGBAF;

export class ReflectBaseNode
  implements IReflectNodeBaseReference, IReflectLayoutMixin, IReflectBlendMixin
{
  readonly $schema: string = "reflect-ui.com";
  readonly filekey: FigmaFileKey;
  readonly id: string;
  readonly name: string;
  readonly type: ReflectSceneNodeType;
  readonly absoluteTransform: Transform;
  origin: ReflectSceneNodeType;
  originRaw: string;
  originParentId: string | null;
  parentId: string | null;
  hierachyIndex: number = 0;

  constructor(props: {
    readonly id: string;
    readonly filekey: FigmaFileKey;
    name: string;
    parent: ReflectSceneNode | null;
    origin: string;
    originParentId: string;
    absoluteTransform: Transform;
    childrenCount: number;
  }) {
    this.id = props.id;
    this.filekey = props.filekey;
    this.originParentId = props.originParentId;
    this.name = props.name;
    this.parent = props.parent;
    this.parentId = props.parent?.id;
    this.origin = figma_node_type_to_reflect_type(props.origin);
    this.originRaw = props.origin;
    this.absoluteTransform = props.absoluteTransform;
    this.childrenCount = props.childrenCount;
    this.isRoot = checkIfRoot(this as any);

    if (!this.originParentId) {
      this.hierachyIndex = 0;
    } else {
      // TODO - fix this hierachy calculation to rely on origin nodes 100% or change the child initiallizing process.
      const parentHierachyIndex = !Number.isNaN(this.parent.hierachyIndex)
        ? this.parent.hierachyIndex
        : 0;
      let hierachyOnParent = this.getHierachyIndexOnParent();
      hierachyOnParent = !Number.isNaN(hierachyOnParent) ? hierachyOnParent : 0;
      this.hierachyIndex = parentHierachyIndex + hierachyOnParent + 1;
    }
  }

  readonly isRoot: boolean;

  getHierachyIndexOnParent(): number {
    if (this.originParentNode) {
      const children = (this.originParentNode as ChildrenMixin)?.children;
      if (children) {
        for (let childIndex = 0; childIndex < children.length; childIndex++) {
          if (children[childIndex].id === this.id) {
            return childIndex;
          }
        }
      }
    }
    return 0;
  }

  locked: boolean;
  parent: ReflectSceneNode | null;
  mainComponent?: IReflectNodeBasicReference | null;
  mainComponentId?: string;
  variantProperties?: { [property: string]: string } | null;

  // region children related
  readonly children: Array<ReflectSceneNode> = [];
  readonly childrenCount: number = 0;
  get hasChildren(): boolean {
    return this.childrenCount > 0;
  }
  // endregion children related

  readonly pluginData: { [key: string]: string };
  getPluginData(key: string): string {
    return this.originNode.getPluginData(key);
  }
  setPluginData(key: string, value: string): void {
    return this.originNode.setPluginData(key, value);
  }

  get originParentNode(): SceneNode {
    return plugin?.getNodeById(this.originParentId) as SceneNode;
  }
  get originNode(): SceneNode {
    try {
      console.log("figma.getNodeById(this.id)", plugin?.getNodeById(this.id));
      return plugin?.getNodeById(this.id) as SceneNode;
    } catch (e) {
      console.error("error while getting origin node", e);
    }
  }

  /**
   * if this has a valid design parent. (not a document parent)
   */
  get hasParent(): boolean {
    return (
      this.parent !== null &&
      this.parent !== undefined &&
      /**
       * we add this because parent can be anonymously set to a figma typed page node or so. so we double check that parent is reflect typed, and not a page or some abstract node
       */
      this.parent instanceof ReflectBaseNode
    );
  }

  // Namespace is a string that must be at least 3 alphanumeric characters, and should
  // be a name related to your plugin. Other plugins will be able to read this data.
  getSharedPluginData(namespace: string, key: string): string {
    return this.originNode.getSharedPluginData(namespace, key);
  }
  setSharedPluginData(namespace: string, key: string, value: string): void {
    return this.originNode.setSharedPluginData(namespace, key, value);
  }

  // layout related
  x: number;
  y: number;
  get absoluteX(): number {
    try {
      // x point on affine space
      return this.absoluteTransform[0][2];
    } catch (_) {
      // TODO: prevent this in a higher level. absoulte transform must be a valid value while initilaizing
      return this.x;
    }
  }

  get absoluteY(): number {
    try {
      // y point on affine space
      return this.absoluteTransform[1][2];
    } catch (_) {
      // TODO: prevent this in a higher level. absoulte transform must be a valid value while initilaizing
      return this.y;
    }
  }

  rotation: number; // In degrees
  width: number;
  height: number;
  layoutAlign: FigmaLayoutAlign;
  layoutGrow: FigmaLayoutGrow;
  fills?: ReadonlyArray<Paint>;
  strokes?: ReadonlyArray<Paint>;

  /**
   * layoutMode is only available for frame node
   */
  layoutMode?: Axis | undefined;

  /**
   * figma: this property is only available when layoutMode != "NONE"
   */
  // region
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  mainAxisAlignment: MainAxisAlignment;
  crossAxisAlignment: CrossAxisAlignment;
  // endregion

  padding: EdgeInsets;

  // blend related
  opacity: number;
  blendMode: "PASS_THROUGH" | BlendMode;
  isMask: boolean;
  effects: ReadonlyArray<Effect>;
  effectStyleId: string;
  visible: boolean;
  radius: number;
  //

  get shadows(): ReadonlyArray<BoxShadowManifest> {
    return this.effects
      .map((s) => {
        if (!s.visible) return;
        if (s.type === "DROP_SHADOW" || s.type === "INNER_SHADOW") {
          return {
            spreadRadius: s.spread,
            blurRadius: s.radius,
            color: s.color,
            offset: {
              dx: s.offset.x,
              dy: s.offset.y,
            },
          };
        }
      })
      .filter((e) => e !== undefined);
  }

  /**
   * visible, and the top shadow set by designer
   */
  get primaryShadow(): BoxShadowManifest | undefined {
    try {
      if (this.shadows && this.shadows.length > 0) {
        return this.shadows[0];
      } else {
        return undefined;
      }
    } catch (_) {
      console.error(
        `error while fetching primary shadow on ${this.toString()}`,
        _
      );
      return undefined;
    }
  }

  /**
   * is this node on of component, instance or variant?
   */
  get isComponent(): boolean {
    return [
      ReflectSceneNodeType.component,
      ReflectSceneNodeType.instance,
      ReflectSceneNodeType.variant_set,
    ].includes(this.type);
  }

  get isVariant(): boolean {
    return (
      this.parent.origin == ReflectSceneNodeType.variant_set &&
      this.isMasterComponent
    );
  }

  get hasVariant(): boolean {
    return this.variants.length > 0;
  }

  get variants(): string[] {
    try {
      if (this.isVariant) {
        const variants = this.parent.children;
        return variants.map((v) => v.name);
      }
    } catch (_) {
      return [];
    }
  }

  get isInstance(): boolean {
    return this.type === "INSTANCE";
  }

  get isMasterComponent(): boolean {
    return this.type == "COMPONENT";
  }

  toString(): string {
    return `"${this.name}"`;
  }

  /**
   * retrieves interface, json exportable node reference data. (containing essensial data only) Mostly used for debugging, logging purpose.
   */
  copyAsSnippet(): IReflectNodeBasicReference {
    return makeReference(this);
  }

  /**
   * returns true if "this" fill contains image. does not looks through its children.
   */
  get hasImage(): boolean {
    return hasImage(this.fills);
  }

  /**
   * check if "this" node is exportable as svg. if one of the children contains image, this will return false.
   */
  get vectorExportable(): boolean {
    if ("children" in this) {
      const hasimage = this.children.every((c) => !c.hasImage);
      if (hasimage) {
        return false;
      }
    }
    return !this.hasImage;
  }

  get images(): Array<Image> | undefined {
    if (Array.isArray(this.fills)) {
      return retrieveImageFills(this.fills).map((i) =>
        plugin?.getImageByHash(i.imageHash)
      );
    }
  }

  get primaryImage(): Image {
    try {
      if (Array.isArray(this.fills)) {
        return plugin?.getImageByHash(
          retrievePrimaryImageFill(this.fills).imageHash
        );
      }
    } catch (_) {
      return;
    }
  }

  get hasFills(): boolean {
    if (Array.isArray(this.fills)) {
      return this.fills.length > 0;
    }

    return false;
  }

  get hasVisibleFills(): boolean {
    return this.visibleFills?.length > 0;
  }

  get visibleFills(): ReadonlyArray<Paint> | undefined {
    try {
      return filterFills((this as any).fills as Paint[], {
        visibleOnly: true,
      });
    } catch (_) {
      console.log(
        `tried to filter fills, but no fills found. ${this.toString()}`,
        this
      );
    }
  }

  get primaryFill(): Paint {
    return retrieveFill(this.fills);
  }

  get mostUsedFill(): Paint {
    if (this.hasChildren) {
      const availableNodes = this.getGrandchildren({
        includeThis: true,
      });

      let fillsMap = availableNodes
        .map((n) => n.visibleFills)
        .filter((n) => array.filters.notEmpty(n));
      const fills = [].concat.apply([], fillsMap);
      return retrieveFill(fills);
    }
    return this.primaryFill;
  }

  get primaryColor(): RGBAF {
    try {
      return retrievePrimaryColor(this.fills as Paint[]);
    } catch (_) {
      // console.error(
      //   `error while fetching primarycolor from ${this.toString()}`
      // );
    }
  }

  get grandchildren(): ReadonlyArray<ReflectSceneNode> {
    return this.getGrandchildren();
  }

  /**
   * fetches the children's children including all under this node.
   * *NOTE* this can also be used on non-parent node. if includeThis option is provided, this will return array in shape of `[this]`
   * @param options
   */
  getGrandchildren(options?: {
    includeThis: boolean;
  }): ReadonlyArray<ReflectSceneNode> | undefined {
    if (this.hasChildren) {
      return mapGrandchildren(this as any, null, options);
    } else {
      // if include this option is set to yes, then, return this even if this is not a children-containing node.
      if (options?.includeThis) {
        return [this as any];
      }
    }
  }
}

function figma_node_type_to_reflect_type(type: string): ReflectSceneNodeType {
  if (type in ReflectSceneNodeType) {
    return ReflectSceneNodeType[type];
  }

  switch (type) {
    case "GROUP":
      return ReflectSceneNodeType.group;
    case "FRAME":
      return ReflectSceneNodeType.frame;
    case "VECTOR":
      return ReflectSceneNodeType.vector;
    case "COMPONENT":
      return ReflectSceneNodeType.component;
    case "TEXT":
      return ReflectSceneNodeType.text;
    case "INSTANCE":
      return ReflectSceneNodeType.instance;
    case "RECTANGLE":
      return ReflectSceneNodeType.rectangle;
    case "LINE":
      return ReflectSceneNodeType.line;
    case "ELLIPSE":
      return;
    case "COMPONENT_SET":
      return ReflectSceneNodeType.variant_set;
    default:
      return ReflectSceneNodeType.unknown;
  }
}
