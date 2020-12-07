import { mixed } from "../../nodes/types/mixed";

export interface FigmaCornerRadius {
    cornerRadius: number | typeof mixed
    topLeftRadius: number;
    topRightRadius: number;
    bottomLeftRadius: number;
    bottomRightRadius: number;
}