import { ReflectSceneNodeType, ReflectSceneNode } from ".";
import { filterFills, retrieveFill, retrievePrimaryColor } from "../../utils";
import { hasImage } from "../../utils/has-image";
import { ReflectChildrenMixin, ReflectGeometryMixin, ReflectCornerMixin, ReflectRectangleCornerMixin, ReflectBlendMixin, ReflectLayoutMixin } from "./mixins";

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


export class ReflectFrameNode
    extends ReflectChildrenMixin implements ReflectFrameMixin,
    ReflectGeometryMixin,
    ReflectCornerMixin,
    ReflectRectangleCornerMixin,
    ReflectBlendMixin,
    ReflectLayoutMixin {

    get hasImage(): boolean {
        return hasImage(this.fills)
    }

    get images(): Array<Image> {
        throw 'get: images not implemented for frame node'
    }

    get primaryImage(): Image {
        throw 'get: primaryImage not implemented for frame node'
    }

    get type() {
        return ReflectSceneNodeType.frame;
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
