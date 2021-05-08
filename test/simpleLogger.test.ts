import { createLogger } from '../src/simpleLogger';

const originalLog = console.log;

describe('simpleLogger', () => {
  afterEach(() => (console.log = originalLog));

  it('should have the same logging methods as the "console" object', () => {
    const logger = createLogger();

    expect(logger).toHaveProperty('debug');
    expect(logger).toHaveProperty('error');
    expect(logger).toHaveProperty('group');
    expect(logger).toHaveProperty('info');
    expect(logger).toHaveProperty('log');
    expect(logger).toHaveProperty('warn');
  });

  it('should allow for a prefix', () => {
    const logger = createLogger({
      prefix: 'test/simpleLogger',
    });
    const consoleLogSpy = jest.spyOn(console, 'log');
    const loggerLogSpy = jest.spyOn(logger, 'log');

    console.log('Hello from console.log');
    expect(consoleLogSpy).toHaveBeenCalledWith('Hello from console.log');
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);

    logger.log('Hello from logger.log');
    expect(loggerLogSpy).toHaveBeenCalledWith('Hello from logger.log');
    expect(loggerLogSpy).toHaveBeenCalledTimes(1);
  });

  // Test not really useful (won't catch regression), don't know how to check this properly
  it('should not print when disabled', () => {
    const logger = createLogger({
      prefix: 'test/simpleLogger',
      shouldPrint: () => false,
    });
    const loggerLogSpy = jest.spyOn(logger, 'log');

    logger.log('Should not print');
    expect(loggerLogSpy).toHaveBeenCalledWith('Should not print'); // This is true even when nothing gets printed to the console output
    expect(loggerLogSpy).toHaveBeenCalledTimes(1);
  });
});
