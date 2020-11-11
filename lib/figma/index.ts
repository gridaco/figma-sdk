
export * from "./text-style.figma"

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