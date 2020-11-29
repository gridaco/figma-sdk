import { MainAxisAlignment } from "@reflect.bridged.xyz/core/lib";
import { FigmaMainAxisAlignment } from "../types";

export function convertPrimaryAxisAlignItemsToMainAxisAlignment(origin: FigmaMainAxisAlignment): MainAxisAlignment {
    switch (origin) {
        case "CENTER":
            return MainAxisAlignment.center
        case "MAX":
            return MainAxisAlignment.end
        case "MIN":
            return MainAxisAlignment.start
        case "SPACE_BETWEEN":
            return MainAxisAlignment.spaceBetween
    }
}