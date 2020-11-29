import { Axis } from "@reflect.bridged.xyz/core/lib";
import { FigmaLayoutMode } from "../types/layout-mode";

export function convertLayoutModeToAxis(origin: FigmaLayoutMode): Axis {
    switch (origin) {
        case "NONE":
            return undefined
        case "HORIZONTAL":
            return Axis.horizontal
        case "VERTICAL":
            return Axis.vertical
    }
}