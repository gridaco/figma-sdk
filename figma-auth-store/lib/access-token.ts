import { personal } from "./access-token-personal"
import { oauth } from "./access-token-oauth"

export function getAccessToken(): string {
    const accesstokenany = oauth.get() || personal.get()
    if (accesstokenany) {
        return accesstokenany;
    }
    throw new Error("No access token found")
}

export function getAccessToken_safe(): string | null {
    try {
        return getAccessToken()
    } catch (e) {
        return null
    }
}