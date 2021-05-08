const createLogger = require('../dist/index').default;

const logger = createLogger({
  prefix: null
});
logger.log('Logger "log" test');

const loggerWithPrefix = createLogger({
  prefix: 'Awesome logger'
});
loggerWithPrefix.debug('Logger "debug" test');
loggerWithPrefix.error('Logger "error" test');
loggerWithPrefix.group('Logger "group" test');
loggerWithPrefix.groupEnd('Logger "groupEnd" test');
loggerWithPrefix.info('Logger "info" test');
loggerWithPrefix.log('Logger "log" test');
loggerWithPrefix.warn('Logger "warn" test');

