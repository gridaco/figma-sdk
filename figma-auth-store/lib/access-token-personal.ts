import { FigmaAuthStore } from "./figma-auth-store";
import { isBrowser } from "./is-browser";
import { _dev_env_var_figma_personal_access_token, __FIGMA_OAUTH_ACCESS_TOKEN_DANGER_LOCAL_DEV } from "./keys";

const ___key = __FIGMA_OAUTH_ACCESS_TOKEN_DANGER_LOCAL_DEV
const key = () => {
    return FigmaAuthStore.makekey(___key)
}

export function getPersonalAccessToken(): string {
    // todo - add local storage handling
    if (_dev_env_var_figma_personal_access_token) {
        return _dev_env_var_figma_personal_access_token;
    }

    const _local = _getFigmaPersonalAccessToken_LocalDev();
    if (_local) {
        return _local;
    }

    throw "no valid figma accesstoken configuration found. please set it on /_development/access-tokens";
}

export function getPersonalAccessToken_safe(): string | undefined {
    try {
        return getPersonalAccessToken();
    } catch (_) { }
    return undefined;
}


export function setPersonalAccessToken_localdev(token: string) {
    if (isBrowser) {
        window.localStorage.setItem(
            key(),
            token
        );
    }
}

export function clearPersonalAccessToken() {
    if (isBrowser) {
        window.localStorage.removeItem(
            key()
        );
    }
}

function _getFigmaPersonalAccessToken_LocalDev() {
    if (isBrowser) {
        return window.localStorage.getItem(
            key()
        );
    }
}

export const personal = {
    get: getPersonalAccessToken,
    get_safe: getPersonalAccessToken_safe,
    set: setPersonalAccessToken_localdev,
    clear: clearPersonalAccessToken
}