/**
 * Development-only logging utility
 * 
 * In production builds, these functions are no-ops.
 * In development builds, they pass through to console methods.
 */

const isDev = import.meta.env.DEV;

export const logger = {
    log: (...args: unknown[]): void => {
        if (isDev) console.log(...args);
    },
    error: (...args: unknown[]): void => {
        if (isDev) console.error(...args);
    },
    warn: (...args: unknown[]): void => {
        if (isDev) console.warn(...args);
    },
    debug: (...args: unknown[]): void => {
        if (isDev) console.debug(...args);
    },
    info: (...args: unknown[]): void => {
        if (isDev) console.info(...args);
    },
    group: (label: string): void => {
        if (isDev) console.group(label);
    },
    groupEnd: (): void => {
        if (isDev) console.groupEnd();
    },
    table: (data: unknown): void => {
        if (isDev) console.table(data);
    },
};

export default logger;
