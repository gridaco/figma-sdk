import { ReflectGroupNode, ReflectSceneNode } from "../nodes";


export type LCRS = "Left" | "Center" | "Right" | "Stretch" | "Scale" | "Mixed"


export function getNodeLCRS(node: ReflectSceneNode): LCRS {
    if (node instanceof ReflectGroupNode) {
        return getGroupLCRS(node);
    }
    else {
        try {
            return X_ALIGN_FIGMA_TO_REFLECT.get(node.constraints.horizontal)
        } catch (e) { /* ignore */ }
    }
}

/**
 * check group's constraint
 * https://github.com/figma/plugin-typings/issues/9
 * @param node 
 */
export function getGroupLCRS(node: ReflectGroupNode): LCRS {
    let lastChildLCRS: LCRS;
    for (const c of node.children) {
        const childLCRS = getNodeLCRS(c)
        console.warn(c, childLCRS)
        if (lastChildLCRS) {
            if (lastChildLCRS === childLCRS) {
                // do nothing if lcrs matches
            } else {
                // return mixed, if last lcrs does not match current one.
                return "Mixed"
            }
        } else {
            lastChildLCRS = childLCRS
        }
    }
    return lastChildLCRS
}


/**
 * 
 * @param target the target node a.k.a current node
 * @param reletiveTo the parent node of target node in generatl.
 */
export function getReletiveLCRS(target: ReflectSceneNode, reletiveTo: ReflectSceneNode): LCRS {

    // FIXME rel does not work with group as expected.
    const relX = target.x
    const relXCenter = relX + (target.width / 2)
    const relY = target.y
    const relYCenter = relY + (target.height / 2)

    const lcrs = calculateLCRS({
        centerPosition: relXCenter,
        startPosition: target.x,
        containerWidth: reletiveTo.width,
        width: target.width
    })

    return lcrs
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
export function calculateLCRS(args: {
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