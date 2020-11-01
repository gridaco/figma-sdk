import { ReflectBaseNode, ReflectSceneNodeType, ReflectSceneNode } from ".";
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


