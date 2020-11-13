import { ReflectBaseNode, ReflectSceneNodeType, ReflectSceneNode, mixed } from ".";
import { filterFills, mapGrandchildren, retrieveFill, retrievePrimaryColor } from "../../utils";
import { hasImage, isImage } from "../../utils/has-image";
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
        return filterFills(this.fills as Paint[], { visibleOnly: true })
    }

    get primaryFill(): Paint {
        return retrieveFill(this.fills)
    }

    get primaryColor(): RGBA {
        return retrievePrimaryColor(this.fills as Paint[])
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


