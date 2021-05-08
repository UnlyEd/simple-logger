const createLogger = require('../dist/index').default;

const logger = createLogger({
  prefix: null
});
logger.log('Logger "log" test');

const loggerWithPrefix = createLogger({
  prefix: 'Awesome logger'
});
loggerWithPrefix.log('Logger "log" test');

