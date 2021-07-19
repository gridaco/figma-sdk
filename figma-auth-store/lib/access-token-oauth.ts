import { FigmaAuthStore } from "./figma-auth-store";
import { isBrowser } from "./is-browser";
import { _dev_env_var_figma_personal_access_token, __FIGMA_OAUTH_ACCESS_TOKEN_DANGER_LOCAL_DEV } from "./keys";

const ___key = __FIGMA_OAUTH_ACCESS_TOKEN_DANGER_LOCAL_DEV
const key = () => {
    return FigmaAuthStore.makekey(___key)
}

export function setOAuthAccessToken(figmaToken: string) {
    if (isBrowser) {
        window.localStorage.setItem(key(), figmaToken);
    }
}

export function getOAuthAccessToken(): string | undefined {
    if (isBrowser) {
        const stored = window.localStorage.getItem(key()) as string;
        return stored || _dev_env_var_figma_personal_access_token;
    }
}

export function clearOAuthAccessToken() {
    if (isBrowser) {
        window.localStorage.removeItem(
            key()
        );
    }
}

export function refreshFigmaToken() {
    throw 'refresh token not implemented.'
}

export const oauth = {
    get: getOAuthAccessToken,
    set: setOAuthAccessToken,
    clear: clearOAuthAccessToken
}