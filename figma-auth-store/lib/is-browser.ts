/**
 * process.browser is for nextjs / webpack - refer: https://github.com/vercel/next.js/issues/2177
 */
export const isBrowser: boolean = (('browser' in process) && ((process as any).browser as boolean)) || typeof window !== 'undefined';
