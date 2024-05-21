const winston = require('winston');
const { Loggly } = require('winston-loggly-bulk');


// Set up Winston logger with Loggly transport
winston.add(
  new Loggly({
    token: '70f496fc-d445-475e-9280-68f53e1d38fb',
    subdomain: 'subdomain',
    tags: ['Node.js', 'ConsoleLogs'],
    json: true,
  })
);

const consoleTransport = new winston.transports.Console();
winston.add(consoleTransport);

const logger = winston;
exports.logger = logger;

exports.captureConsoleMethods = () =>{
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;
  const originalConsoleDebug = console.debug;

  console.log = function (...args) {
    handleConsoleLogging('info', args);
    originalConsoleLog.apply(console, args);
  };

  console.error = function (...args) {
    handleConsoleLogging('error', args);
    originalConsoleError.apply(console, args);
  };

  console.warn = function (...args) {
    handleConsoleLogging('warn', args);
    originalConsoleWarn.apply(console, args);
  };

  console.info = function (...args) {
    handleConsoleLogging('info', args);
    originalConsoleInfo.apply(console, args);
  };

  console.debug = function (...args) {
    handleConsoleLogging('debug', args);
    originalConsoleDebug.apply(console, args);
  };
}

function handleConsoleLogging(level, args) {
    const logData = args;
    if (level === 'info') {
      logger.info(JSON.stringify(logData));
    } else if (level === 'error') {
      logger.error(JSON.stringify(logData));
    } else if (level === 'warn') {
      logger.warn(JSON.stringify(logData));
    } else if (level === 'debug') {
      logger.debug(JSON.stringify(logData));
    }
}
