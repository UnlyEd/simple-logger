import chalk from 'chalk';
import noop from 'lodash.noop';

export type SimpleLogger = {
  debug: any;
  error: any;
  group: any;
  groupEnd: any;
  info: any;
  log: any;
  warn: any;
};

export type PrintMode = 'debug' | 'error' | 'group' | 'groupEnd' | 'info' | 'log' | 'warn';

export type SimpleLoggerOptions = {
  prefix?: string;
  disableAutoWrapPrefix?: boolean;
  colorize?: Colorize;
  shouldPrint?: ShouldPrint;
  shouldShowTime?: ShouldShowTime;
  timeFormat?: TimeFormat;
};

export type Colorize = (mode: PrintMode, prefixes: string[]) => string[];
export type ShouldPrint = (mode: PrintMode) => boolean;
export type ShouldShowTime = () => boolean;
export type TimeFormat = () => string;

/**
 * By default, printing is only enabled in non-production environments.
 */
export const shouldPrintFallback: ShouldPrint = () => process?.env?.NODE_ENV !== 'production';

/**
 * By default, displays the time as a Date ISO string.
 */
export const timeFormatFallback: TimeFormat = () => new Date().toISOString();

/**
 * By default, show time unless SIMPLE_LOGGER_SHOULD_SHOW_TIME has been explicitly set to "false".
 */
const shouldShowTimeFallback = (): boolean => process?.env?.SIMPLE_LOGGER_SHOULD_SHOW_TIME !== 'false';

/**
 * Colorize output.
 *
 * Only colorize on the server, not on the browser
 * (keep native behavior, to avoid messing with colors and complicated browser API which is different for each browser).
 *
 * @param mode
 * @param prefixes
 */
const colorizeFallback: Colorize = (mode: Omit<PrintMode, 'groupEnd'>, prefixes: string[]): any[] => {
  const orange = chalk.hex('#FFA500');

  if (typeof window === 'undefined') {
    switch (mode) {
      case 'debug':
        return prefixes.map((prefix: string) => chalk.yellow(prefix));
      case 'error':
        return prefixes.map((prefix: string) => chalk.red(prefix));
      case 'group':
        return prefixes.map((prefix: string) => chalk.bgGray(prefix));
      case 'info':
        return prefixes.map((prefix: string) => chalk.blue(prefix));
      case 'log':
        return prefixes.map((prefix: string) => chalk.grey(prefix));
      case 'warn':
        return prefixes.map((prefix: string) => orange(prefix));
    }
  }

  return prefixes;
};

/**
 * Creates a logger object containing the same "print" API as the console object.
 *
 * Compatible with server and browser. (universal)
 *
 * @param options
 */
export const createLogger = (options?: SimpleLoggerOptions): SimpleLogger => {
  const {
    prefix,
    shouldPrint = shouldPrintFallback,
    disableAutoWrapPrefix = false,
    shouldShowTime = shouldShowTimeFallback,
    timeFormat = timeFormatFallback,
    colorize = colorizeFallback,
  } = options || {};
  const _prefix: string | undefined = disableAutoWrapPrefix || !prefix?.length ? prefix : `[${prefix}]`;
  const prefixes: string[] = []; // Contains an array of prefixes (tags, time, etc.)

  if (shouldShowTime()) {
    prefixes.push(timeFormat());
  }

  if (_prefix) {
    prefixes.push(_prefix);
  }

  return {
    debug: shouldPrint('debug') ? console.debug.bind(console, ...colorize('debug', prefixes)) : noop,
    error: shouldPrint('error') ? console.error.bind(console, ...colorize('error', prefixes)) : noop,
    group: shouldPrint('group') ? console.group.bind(console, ...colorize('group', prefixes)) : noop,
    groupEnd: shouldPrint('groupEnd') ? console.groupEnd.bind(console) : noop,
    info: shouldPrint('info') ? console.info.bind(console, ...colorize('info', prefixes)) : noop,
    log: shouldPrint('log') ? console.log.bind(console, ...colorize('log', prefixes)) : noop,
    warn: shouldPrint('warn') ? console.warn.bind(console, ...colorize('warn', prefixes)) : noop,
  };
};
