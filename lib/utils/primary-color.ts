import { retrieveFill } from "./retrieve-fill"

export function retrievePrimaryColor(fills: ReadonlyArray<Paint>): RGBA {
    const solid = retrieveFill<SolidPaint>(fills, {
        onlySolid: true
    })
    return {
        r: solid.color.r,
        g: solid.color.g,
        b: solid.color.b,
        a: solid.opacity
    }
}