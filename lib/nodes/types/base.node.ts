import { mixed, ReflectSceneNode, ReflectSceneNodeType } from ".";
import { filterFills, hasImage, mapGrandchildren, notEmpty, rawTypeToReflectType, retrieveFill, retrievePrimaryColor } from "../../utils";
import { checkIfRoot } from "../../utils/check-if-root";
// import { ReflectLayoutMixin, ReflectBlendMixin, ReflectChildrenMixin, ReflectDefaultShapeMixin } from "./mixins";

export interface IReflectNodeReference {
    readonly type: ReflectSceneNodeType
    name: string;
    id: string;
    parentReference?: IReflectNodeReference
}


export class ReflectBaseNode implements IReflectNodeReference, ReflectLayoutMixin, ReflectBlendMixin {
    readonly type: ReflectSceneNodeType
    origin: ReflectSceneNodeType
    originRaw: string
    originParentId: string
    hierachyIndex: number = 0


    constructor(props: {
        readonly id: string,
        name: string,
        parent: (ReflectSceneNode & ReflectChildrenMixin) | null
        origin: string,
        originParentId: string,
        absoluteTransform: Transform
        childrenCount?: number
    }) {
        this.id = props.id
        this.originParentId = props.originParentId
        this.name = props.name
        this.parent = props.parent
        this.origin = rawTypeToReflectType(props.origin)
        this.originRaw = props.origin
        this.absoluteTransform = props.absoluteTransform
        this.childrenCount = props.childrenCount

        if (!this.originParentId) {
            this.hierachyIndex = 0
        } else {
            // TODO - fix this hierachy calculation to rely on origin nodes 100% or change the child initiallizing process.
            const parentHierachyIndex = !Number.isNaN(this.parent.hierachyIndex) ? this.parent.hierachyIndex : 0
            let hierachyOnParent = this.getHierachyIndexOnParent()
            hierachyOnParent = !Number.isNaN(hierachyOnParent) ? hierachyOnParent : 0
            this.hierachyIndex = parentHierachyIndex + hierachyOnParent + 1
        }
    }

    getHierachyIndexOnParent(): number {
        if (this.originParentNode) {
            const children = (this.originParentNode as ChildrenMixin)?.children
            if (children) {
                for (let childIndex = 0; childIndex < children.length; childIndex++) {
                    if (children[childIndex].id === this.id) {
                        return childIndex
                    }
                }
            }
        }
        return 0
    }

    locked: boolean
    readonly id: string;
    readonly absoluteTransform: Transform
    parent: (ReflectSceneNode & ReflectChildrenMixin) | null;
    readonly children: Array<ReflectSceneNode> = []
    readonly childrenCount: number = 0
    readonly name: string;
    readonly pluginData: { [key: string]: string };
    getPluginData(key: string): string {
        return this.originNode.getPluginData(key)
    }
    setPluginData(key: string, value: string): void {
        return this.originNode.setPluginData(key, value)
    }

    get originParentNode(): SceneNode {
        return figma.getNodeById(this.originParentId) as SceneNode
    }
    get originNode(): SceneNode {
        try {
            console.log('figma.getNodeById(this.id)', figma.getNodeById(this.id))
            return figma.getNodeById(this.id) as SceneNode
        } catch (e) {
            console.error('error while getting origin node', e)
        }
    }


    get hasParent(): boolean {
        return this.parent !== null && this.parent !== undefined
    }

    // Namespace is a string that must be at least 3 alphanumeric characters, and should
    // be a name related to your plugin. Other plugins will be able to read this data.
    getSharedPluginData(namespace: string, key: string): string {
        return this.originNode.getSharedPluginData(namespace, key)
    }
    setSharedPluginData(namespace: string, key: string, value: string): void {
        return this.originNode.setSharedPluginData(namespace, key, value)
    }

    // layout related
    x: number;
    y: number;
    get absoluteX(): number {
        // x point on affine space
        return this.absoluteTransform[0][2]
    }

    get absoluteY(): number {
        // y point on affine space
        return this.absoluteTransform[1][2]
    }


    rotation: number; // In degrees
    width: number;
    height: number;
    layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";
    layoutGrow: number


    /**
     * layoutMode is only available for frame node
     */
    layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";

    /**
     * figma: this property is only available when layoutMode != "NONE"
     */
    // region
    primaryAxisSizingMode: "FIXED" | "AUTO";
    counterAxisSizingMode: "FIXED" | "AUTO";
    primaryAxisAlignItems: FigmaMainAxisAlignment;
    counterAxisAlignItems: FigmaCrossAxisAligment;
    // endregion

    paddingRight: number;
    paddingLeft: number;
    paddingTop: number;
    paddingBottom: number;


    // blend related
    opacity: number;
    blendMode: "PASS_THROUGH" | BlendMode;
    isMask: boolean;
    effects: ReadonlyArray<Effect>;
    effectStyleId: string;
    visible: boolean;
    radius: number;
    //

    get isComponent(): boolean {
        return [ReflectSceneNodeType.component, ReflectSceneNodeType.instance, ReflectSceneNodeType.variant].includes(this.type)
    }

    get isInstance(): boolean {
        return this.type === "INSTANCE"
    }

    get isMasterComponent(): boolean {
        return this.type == "COMPONENT";
    }

    get isRoot(): boolean {
        // DANGEROUS
        return checkIfRoot(this as any)
    }

    toString(): string {
        return `"${this.name}"`
    }

    copyAsSnippet(): IReflectNodeReference {
        return <IReflectNodeReference>{
            id: this.id,
            name: this.name,
            type: this.type,
            parentReference: {
                id: this.parent.id,
                name: this.parent.name,
                type: this.parent.type,
            }
        }
    }


    /**
     * returns true if "this" fill contains image. does not looks through its children.
     */
    get hasImage(): boolean {
        if (this instanceof ReflectDefaultShapeMixin) {
            return hasImage(this.fills)
        }
    }

    /**
     * check if "this" node is exportable as svg. if one of the children contains image, this will return false.
     */
    get vectorExportable(): boolean {
        if ('children' in this) {
            const hasimage = this.children.every((c) => !c.hasImage)
            if (hasimage) {
                return false
            }
        }
        return !this.hasImage
    }

    get images(): Array<Image> | undefined {
        if (this instanceof ReflectDefaultShapeMixin) {
            if (Array.isArray(this.fills)) {
                return retrieveImageFills(this.fills);
            }
        }
    }

    get primaryImage(): Image {
        if (this instanceof ReflectDefaultShapeMixin) {
            if (Array.isArray(this.fills)) {
                return retrievePrimaryImageFill(this.fills)
            }
        }
    }


    get hasFills(): boolean {
        if (this instanceof ReflectDefaultShapeMixin) {
            if (Array.isArray(this.fills)) {
                return this.fills.length > 0
            }
        }

        return false
    }

    get hasVisibleFills(): boolean {
        return this.visibleFills?.length > 0
    }

    get visibleFills(): ReadonlyArray<Paint> | undefined {
        try {
            return filterFills((this as any as ReflectDefaultShapeMixin).fills as Paint[], { visibleOnly: true })
        } catch (_) {
            console.log(`tried to filter fills, but no fills found. ${this.toString()}`, this)
        }
    }

    get primaryFill(): Paint {
        if (this instanceof ReflectChildrenMixin) {
            const availableNodes = this.getGrandchildren({
                includeThis: true
            })

            let fillsMap = availableNodes.map((n) => n.visibleFills).filter((n) => notEmpty(n))
            const fills = [].concat.apply([], fillsMap);
            return retrieveFill(fills)
        }
        if (this instanceof ReflectDefaultShapeMixin) {
            return retrieveFill(this.fills)
        }
    }

    get primaryColor(): RGBA {
        try {
            if (this instanceof ReflectDefaultShapeMixin) {
                return retrievePrimaryColor(this.fills as Paint[])
            }
        } catch (_) {
            console.log(`error while fetching primarycolor from ${this.toString()}`)
        }
    }

    get grandchildren(): ReadonlyArray<ReflectSceneNode> {
        return this.getGrandchildren()
    }

    getGrandchildren(options?: { includeThis: boolean }): ReadonlyArray<ReflectSceneNode> | undefined {
        if (this instanceof ReflectChildrenMixin) {
            return mapGrandchildren(this, options)
        }
    }
}


import { LCRS, getNodeActualLCRS, getReletiveLCRS } from "../../utils/lcrs";
import { retrieveImageFills, retrievePrimaryImageFill } from "../../utils/retrieve-image-fills";
import { FigmaCrossAxisAligment, FigmaMainAxisAlignment } from "./property-types";

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
    absoluteTransform: Transform
    x: number;
    y: number;
    rotation: number; // In degrees

    width: number;
    height: number;

    /**
     * fimgma: this property is only applicable when frame is auto-layout frame.
     */
    layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";
    layoutGrow: number
}



export class ReflectConstraintMixin extends ReflectBaseNode {
    // @ts-ignore
    get type() {
        return ReflectSceneNodeType.constraint
    }
    constraints: Constraints

    /**
     * the current node's constraint LCRS positioning. as is.
     */
    get constraintLcrs(): LCRS {
        return getNodeActualLCRS(this)
    }

    /**
     * the cureent node's visual LCRS positioning actually relative to parent.
     */
    get relativeLcrs(): LCRS {
        return getReletiveLCRS(this, this.parent);
    }

    getRelativeToLcrs(to: ReflectSceneNode) {
        // TODO add validation if 'to' node is somewhere on the parent tree of this node
        return getReletiveLCRS(this, to);
    }
}


export interface ReflectGeometryMixin {
    fills: ReadonlyArray<Paint> | undefined
    strokes: ReadonlyArray<Paint>;
    strokeWeight: number;
    strokeMiterLimit: number;
    strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
    strokeCap: StrokeCap | undefined
    strokeJoin: StrokeJoin | undefined
    dashPattern: ReadonlyArray<number>;
    fillStyleId: string | undefined
    strokeStyleId: string;
}

export interface ReflectCornerMixin {
    cornerRadius: number | typeof mixed
    cornerSmoothing: number;
}

export interface ReflectRectangleCornerMixin {
    topLeftRadius: number;
    topRightRadius: number;
    bottomLeftRadius: number;
    bottomRightRadius: number;
}


export class ReflectDefaultShapeMixin
    extends ReflectConstraintMixin implements
    ReflectGeometryMixin,
    ReflectRectangleCornerMixin,
    ReflectCornerMixin,
    ReflectLayoutMixin {
    layoutGrow: number;
    opacity: number;
    blendMode: "PASS_THROUGH" | BlendMode;
    isMask: boolean;
    effects: ReadonlyArray<Effect>;
    effectStyleId: string;
    visible: boolean;
    radius: number;

    fills: ReadonlyArray<Paint> | undefined
    strokes: ReadonlyArray<Paint>;
    strokeWeight: number;
    strokeMiterLimit: number;
    strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
    strokeCap: StrokeCap | undefined
    strokeJoin: StrokeJoin | undefined
    dashPattern: ReadonlyArray<number>;
    fillStyleId: string | undefined
    strokeStyleId: string;

    topLeftRadius: number;
    topRightRadius: number;
    bottomLeftRadius: number;
    bottomRightRadius: number;

    cornerRadius: number | typeof mixed
    cornerSmoothing: number;


    x: number;
    y: number;
    rotation: number;
    width: number;
    height: number;
    layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";


}



export abstract class ReflectChildrenMixin extends ReflectConstraintMixin {

    children: Array<ReflectSceneNode>;
    get constraintableChildren(): Array<ReflectConstraintMixin> {
        return filterConstraintableChildren(this)
    }
    isRelative?: boolean


    get mostUsedColor(): ReadonlyArray<RGBA> {
        throw 'not implemented'
    }
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


