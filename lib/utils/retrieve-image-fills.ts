import { isImage } from "./has-image"

export function retrieveImageFills(fills: ReadonlyArray<Paint>): Array<Image> {
    const images: Array<Image> = []
    if (Array.isArray(fills)) {
        const imagePaints: Array<ImagePaint> = fills
        for (const fill of imagePaints) {
            if (isImage(fill)) {
                const image = retrieveImageFill(fill)
                images.push(image)
            }
        }
    }
    return images
}


export function retrieveImageFill(fill: ImagePaint): Image {
    return figma.getImageByHash(fill.imageHash)
}

export function retrievePrimaryImageFill(fills: ReadonlyArray<Paint>): Image {
    const images = retrieveImageFills(fills)
    if (images && images.length > 0) {
        return images[0]
    } else {
        throw `no image available in fills`
    }
}