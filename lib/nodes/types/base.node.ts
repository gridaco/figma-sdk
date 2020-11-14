import { mixed, ReflectSceneNode, ReflectSceneNodeType } from ".";
import { filterFills, hasImage, mapGrandchildren, rawTypeToReflectType, retrieveFill, retrievePrimaryColor } from "../../utils";
import { checkIfRoot } from "../../utils/check-if-root";
// import { ReflectLayoutMixin, ReflectBlendMixin, ReflectChildrenMixin, ReflectDefaultShapeMixin } from "./mixins";

export interface IReflectNodeReference {
    readonly type: ReflectSceneNodeType
    name: string;
    id: string;
    parentReference?: IReflectNodeReference
}

// export type LayoutAlign = VerticalAlign | HorizontalAlign
// export enum VerticalAlign {
//     top = "MIN",
//     center = "CENTER",
//     bottom = "MAX",
//     topAndBottom = "STRETCH"
// }

// export enum HorizontalAlign {
//     left = "MIN",
//     center = "CENTER",
//     right = "MAX",
//     leftAndRight = "STRETCH"
// }

export class ReflectBaseNode implements IReflectNodeReference, ReflectLayoutMixin, ReflectBlendMixin {
    readonly type: ReflectSceneNodeType
    origin: ReflectSceneNodeType
    originRaw: string
    hierachyIndex: number


    constructor(props: {
        id: string,
        name: string,
        parent?: (ReflectSceneNode & ReflectChildrenMixin) | null
        origin: string,
        absoluteTransform: Transform
    }) {
        this.id = props.id
        this.name = props.name
        this.parent = props.parent
        this.origin = rawTypeToReflectType(props.origin)
        this.originRaw = props.origin
        this.absoluteTransform = props.absoluteTransform
    }

    locked: boolean
    id: string;
    absoluteTransform: Transform
    parent: (ReflectSceneNode & ReflectChildrenMixin) | null;
    name: string;
    readonly pluginData: { [key: string]: string };
    getPluginData(key: string): string {
        return this.originNode.getPluginData(key)
    }
    setPluginData(key: string, value: string): void {
        return this.originNode.setPluginData(key, value)
    }
    get originNode(): SceneNode {
        return figma.getNodeById(this.id) as SceneNode
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


    get hasImage(): boolean {
        if (this instanceof ReflectDefaultShapeMixin) {
            return hasImage(this.fills)
        }
    }

    get images(): Array<Image> {
        throw 'get: images not implemented for frame node'
    }

    get primaryImage(): Image {
        throw 'get: primaryImage not implemented for frame node'
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
        if (this instanceof ReflectDefaultShapeMixin) {
            return filterFills(this.fills as Paint[], { visibleOnly: true })
        }
    }

    get primaryFill(): Paint {
        if (this instanceof ReflectDefaultShapeMixin) {
            return retrieveFill(this.fills)
        }
    }

    get primaryColor(): RGBA {
        if (this instanceof ReflectDefaultShapeMixin) {
            return retrievePrimaryColor(this.fills as Paint[])
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

    layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH"; // applicable only inside auto-layout frames
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
    layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH";

    get hasImage(): boolean {
        return hasImage(this.fills)
    }

    get images(): Array<Image> {
        if (Array.isArray(this.fills)) {
            return retrieveImageFills(this.fills);
        }
    }

    get primaryImage(): Image {
        if (Array.isArray(this.fills)) {
            return retrievePrimaryImageFill(this.fills)
        }
    }

    get hasFills(): boolean {
        if (Array.isArray(this.fills)) {
            return this.fills.length > 0
        }
        return false
    }

    get hasVisibleFills(): boolean {
        return this.visibleFills.length > 0
    }

    get visibleFills(): ReadonlyArray<Paint> {
        return filterFills(this.fills, { visibleOnly: true })
    }

    get primaryFill(): Paint {
        return retrieveFill(this.fills)
    }

    get primaryColor(): RGBA {
        return retrievePrimaryColor(this.fills)
    }

}



export abstract class ReflectChildrenMixin extends ReflectConstraintMixin {

    children: Array<ReflectSceneNode>;
    get constraintableChildren(): Array<ReflectConstraintMixin> {
        return filterConstraintableChildren(this)
    }
    isRelative?: boolean;

    get grandchildren(): ReadonlyArray<ReflectSceneNode> {
        return this.getGrandchildren()
    }

    getGrandchildren(options?: { includeThis: boolean }) {
        return mapGrandchildren(this, options)
    }

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


