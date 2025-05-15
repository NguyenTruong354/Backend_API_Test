const winston = require('winston');
const path = require('path');

/**
 * Configures and initializes the Winston logger instance.
 * @module logger
 * @description Provides logging functionality with console and file transports for info, warn, and error levels.
 */
const logger = winston.createLogger({
  // Define log format with timestamp, level, and message
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  // Configure transports for logging to console and files
  transports: [
    // Console transport for all log levels
    new winston.transports.Console({
      level: 'info', // Log info and above (info, warn, error)
    }),
    // File transport for info logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/info.log'),
      level: 'info',
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
    }),
  ],
});

/**
 * Logs an info-level message.
 * @param {string} message - The message to log.
 * @returns {void}
 */
logger.info = (message) => {
  logger.log({ level: 'info', message });
};

/**
 * Logs a warn-level message.
 * @param {string} message - The message to log.
 * @returns {void}
 */
logger.warn = (message) => {
  logger.log({ level: 'warn', message });
};

/**
 * Logs an error-level message.
 * @param {string} message - The message to log.
 * @returns {void}
 */
logger.error = (message) => {
  logger.log({ level: 'error', message });
};

// Export the logger instance for use in other modules
module.exports = logger;