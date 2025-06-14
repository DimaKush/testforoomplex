interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const CURRENT_LEVEL = process.env['NODE_ENV'] === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;

function shouldLog(level: number): boolean {
  return level <= CURRENT_LEVEL;
}

function formatMessage(level: string, message: string, ...args: unknown[]): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  
  if (args.length > 0) {
    console.log(prefix, message, ...args);
  } else {
    console.log(prefix, message);
  }
}

export const logger = {
  error(message: string, ...args: unknown[]): void {
    if (shouldLog(LOG_LEVELS.ERROR)) {
      formatMessage('ERROR', message, ...args);
    }
  },

  warn(message: string, ...args: unknown[]): void {
    if (shouldLog(LOG_LEVELS.WARN)) {
      formatMessage('WARN', message, ...args);
    }
  },

  info(message: string, ...args: unknown[]): void {
    if (shouldLog(LOG_LEVELS.INFO)) {
      formatMessage('INFO', message, ...args);
    }
  },

  debug(message: string, ...args: unknown[]): void {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      formatMessage('DEBUG', message, ...args);
    }
  },
}; 