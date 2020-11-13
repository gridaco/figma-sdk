import { IgnoreKeys } from "./keys"
export * from "./keys"


interface IgnoreResult {
    ignored: boolean,
    reason?: string[]
}

export function shouldIgnoreNode(name: string): IgnoreResult {
    const ignored = name.includes(IgnoreKeys.KEY_IGNORE_ALL)

    return {
        ignored: ignored,
        reason: ignored ? [`ignored since it contains key ${IgnoreKeys.KEY_IGNORE_ALL}`] : []
    }
}