import chalk from 'chalk';
import noop from 'lodash.noop';

export type SimpleLogger = {
  debug: any;
  error: any;
  group: any;
  info: any;
  log: any;
  warn: any;
};

export type PrintMode = 'log' | 'info' | 'debug' | 'warn' | 'error' | 'group';

export type SimpleLoggerOptions = {
  prefix?: string;
  shouldPrint?: ShouldPrint;
  disableAutoWrapPrefix?: boolean;
  showTime?: boolean;
  timeFormat?: TimeFormat;
};

export type ShouldPrint = (mode: PrintMode) => boolean;
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
const colorize = (mode: PrintMode, prefixes: string[]): any[] => {
  const debug = chalk.hex('#FFA500');

  if (typeof window === 'undefined') {
    switch (mode) {
      case 'debug':
        return prefixes.map((prefix: string) => debug(prefix));
      case 'error':
        return prefixes.map((prefix: string) => chalk.red(prefix));
      case 'group':
        return prefixes.map((prefix: string) => chalk.blue(prefix));
      case 'info':
        return prefixes.map((prefix: string) => chalk.blue(prefix));
      case 'log':
        return prefixes.map((prefix: string) => chalk.blue(prefix));
      case 'warn':
        return prefixes.map((prefix: string) => chalk.blue(prefix));
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
  const { prefix, shouldPrint = shouldPrintFallback, disableAutoWrapPrefix = false, showTime = shouldShowTimeFallback(), timeFormat = timeFormatFallback } =
    options || {};
  const _prefix: string | undefined = disableAutoWrapPrefix || !prefix?.length ? prefix : `[${prefix}]`;
  const prefixes: string[] = []; // Contains an array of prefixes (tags, time, etc.)

  if (showTime) {
    prefixes.push(timeFormat());
  }

  if (_prefix) {
    prefixes.push(_prefix);
  }

  return {
    debug: shouldPrint('debug') ? console.debug.bind(console, ...colorize('debug', prefixes)) : noop,
    error: shouldPrint('error') ? console.error.bind(console, ...colorize('error', prefixes)) : noop,
    group: shouldPrint('group') ? console.group.bind(console, ...colorize('group', prefixes)) : noop,
    info: shouldPrint('info') ? console.info.bind(console, ...colorize('info', prefixes)) : noop,
    log: shouldPrint('log') ? console.log.bind(console, ...colorize('log', prefixes)) : noop,
    warn: shouldPrint('warn') ? console.warn.bind(console, ...colorize('warn', prefixes)) : noop,
  };
};
