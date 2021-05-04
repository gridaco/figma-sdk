
export type FigmaColor = FigmaRGBA | FigmaRGB

export enum FigmaColorFormat {
    rgb = 'figma.rgb',
    rgba = 'figma.rgba'
}

/**
 * figma rgb format. the r,g,b channels' value is devided by 255. the max value is 1. min is 0.
 */
export interface FigmaRGB {
    r: number
    g: number
    b: number
}

/**
 * figma rgb, alpha channel extended.
 */
export interface FigmaRGBA {
    r: number
    g: number
    b: number
    a: number
}