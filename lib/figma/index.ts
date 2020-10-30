
export function getTextStyleById(id: string): TextStyle {
    if (id === undefined || id === null) {
        throw `the parameter id of ${id} is not valid. maybe your text does not have a assiged textstyle`;
    }
    for (const s of figma.getLocalTextStyles()) {
        if (id === s.id) {
            return s;
        }
    }
    throw `text style of id "${id}" is not found by api`;
}

const EK_NOTIFY = "NOTIFY";

/**
 * holder interface for displaying notice on screen. (figma native api.)
 */
interface INotifyEvent {
    // message to display
    message: string,
    // in seconds
    duration: number
}

export function handleNotify(e: any) {
    if (e.type == EK_NOTIFY) {
        const data = e.data as INotifyEvent
        figma.notify(data.message, {
            timeout: data.duration ?? 1
        })
    }
}

// duration in seconds
export function notify(window: Window, message: string, duration?: number) {
    window.postMessage({
        pluginMessage: {
            type: EK_NOTIFY, data: <INotifyEvent>{
                message: message,
                duration: duration
            }
        }
    }, '*')
}