/**
 * process.browser is for nextjs / webpack - refer: https://github.com/vercel/next.js/issues/2177
 */
const isBrowser: boolean = (('browser' in process) && ((process as any).browser as boolean)) || typeof window !== 'undefined';

export function figmaPersonalAccessToken(): string {
    // todo - add local storage handling
    if (process.env.FIGMA_PERSONAL_ACCESS_TOKEN) {
        return process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
    }

    const _local = _getFigmaPersonalAccessToken_LocalDev();
    if (_local) {
        return _local;
    }

    throw "no valid figma accesstoken configuration found. please set it on /_development/access-tokens";
}

export function figmaPersonalAccessToken_safe(): string | undefined {
    try {
        return figmaPersonalAccessToken();
    } catch (_) { }
    return undefined;
}

const __FIGMA_PERSONAL_ACCESS_TOKEN_DANGER_LOCAL_DEV =
    "__NOT_SECURE_FIGMA_PERSONAL_ACCESS_TOKEN_DANGER_LOCAL_DEV";
export function setFigmaPersonalAccessToken_LocalDev(token: string) {
    if (isBrowser) {
        window.localStorage.setItem(
            __FIGMA_PERSONAL_ACCESS_TOKEN_DANGER_LOCAL_DEV,
            token
        );
    }
}

export function clearToken() {
    if (isBrowser) {
        window.localStorage.removeItem(
            __FIGMA_PERSONAL_ACCESS_TOKEN_DANGER_LOCAL_DEV
        );
    }
}

function _getFigmaPersonalAccessToken_LocalDev() {
    if (isBrowser) {
        return window.localStorage.getItem(
            __FIGMA_PERSONAL_ACCESS_TOKEN_DANGER_LOCAL_DEV
        );
    }
}
