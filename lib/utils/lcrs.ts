import { ReflectSceneNode } from "../nodes";


export type LCRS = "Left" | "Center" | "Right" | "Stretch" | "Scale" | "Mixed"


export function getNodeLCRS(node: ReflectSceneNode): LCRS {
    if (node.type == "INSTANCE" || node.type == "COMPONENT" || node.type == "FRAME" || node.type == "RECTANGLE") {
        return X_ALIGN_FIGMA_TO_REFLECT.get(node.constraints.horizontal)
    } else if (node.type == "GROUP") {
        return getGroupLCRS(node);
    }
}

/**
 * check group's constraint
 * https://github.com/figma/plugin-typings/issues/9
 * @param node 
 */
export function getGroupLCRS(node: ReflectSceneNode): LCRS {
    let lastLCRS: LCRS;
    if (node.type == "GROUP") {
        for (const c of node.children) {
            const lcrs = getGroupLCRS(c)
            if (lastLCRS) {
                if (lastLCRS === lcrs) {
                    // do nothing if lcrs matches
                } else {
                    // return mixed, if last lcrs does not match current one.
                    return "Mixed"
                }
            } else {
                lastLCRS = lcrs
            }
        }
        return lastLCRS
    } else {
        return getNodeLCRS(node)
    }
}

const X_ALIGN_FIGMA_TO_REFLECT: Map<ConstraintType, LCRS> = new Map([
    ["MIN", "Left"],
    ["MAX", "Right"],
    ["CENTER", "Center"],
    ["STRETCH", "Stretch"],
    ["SCALE", "Scale"]
])


const SAFE_DAMPING_PX = 0.5
/**
 * calculate the position element in X plane of givven container
 * 
 * |L--------|
 * 
 * |----C----|
 * 
 * |--------R|
 * 
 * the safe margin in non even numbers of PXs are dampped with @const SAFE_DAMPING_PX
 * @param containerWidth 
 * @param centerPosition 
 */
export function getLCRS(args: {
    containerWidth: number, centerPosition: number, startPosition: number, width: number
}): LCRS {
    const { containerWidth, centerPosition, startPosition, width } = args

    // stretch inspection
    // if the size of child is same as parent, and start point is starting from 0, inspect it as "Stretch"
    if (containerWidth == width && startPosition == 0) {
        return "Stretch"
    }



    const isContainerWidthEven = containerWidth % 2 == 0
    const isCenterPositionEven = centerPosition % 2 == 0

    /** if one of the givven parameter is not a even number, than apply damping rule with @const SAFE_DAMPING_PX */
    const damp = isContainerWidthEven && isCenterPositionEven ? 0 : SAFE_DAMPING_PX

    const centerDiff = Math.abs((containerWidth / 2) - centerPosition)
    if (centerDiff + damp < 0) {
        // this is visually on the left side
        return "Left"
    } else if (centerDiff - damp > 0) {
        // this is visually on the right side
        return "Right"
    }
    // this is visually on the center
    return "Center"
}