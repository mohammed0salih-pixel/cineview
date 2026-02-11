type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext extends Record<string, unknown> {
  userId?: string;
  projectId?: string;
  analysisRunId?: string;
  endpoint?: string;
  method?: string;
  duration?: number;
  statusCode?: number;
  errorCode?: string;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const isProd = process.env.NODE_ENV === 'production';

function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return String(obj);
  }
}

function formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (context && Object.keys(context).length > 0) {
    entry.context = { ...context, env: isProd ? 'production' : 'development' };
  }

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: isProd ? undefined : error.stack,
    };
  }

  return entry;
}

function write(entry: LogEntry): void {
  const output = isProd ? JSON.stringify(entry) : prettyFormat(entry);
  
  switch (entry.level) {
    case 'error':
      console.error(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    case 'debug':
      if (!isProd) console.debug(output);
      break;
    default:
      console.log(output);
  }
}

function prettyFormat(entry: LogEntry): string {
  const { timestamp, level, message, context, error } = entry;
  const parts = [
    `[${timestamp}]`,
    `[${level.toUpperCase()}]`,
    message,
  ];

  if (context) {
    parts.push(`| ${safeStringify(context)}`);
  }

  if (error) {
    parts.push(`| ${error.name}: ${error.message}`);
    if (error.stack) parts.push(`\n${error.stack}`);
  }

  return parts.join(' ');
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    write(formatLog('debug', message, context));
  },

  info: (message: string, context?: LogContext) => {
    write(formatLog('info', message, context));
  },

  warn: (message: string, context?: LogContext, error?: Error) => {
    write(formatLog('warn', message, context, error));
  },

  error: (message: string, context?: LogContext, error?: Error) => {
    write(formatLog('error', message, context, error));
  },

  // Helper for request/response logging
  logRequest: (method: string, endpoint: string, userId?: string) => {
    logger.info('API Request', { method, endpoint, userId });
  },

  logResponse: (method: string, endpoint: string, statusCode: number, duration: number, userId?: string) => {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    logger[level]('API Response', { method, endpoint, statusCode, duration, userId });
  },
};

// Measure async function execution time
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    logger.debug(`${name} completed`, { ...context, duration });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`${name} failed`, { ...context, duration }, error as Error);
    throw error;
  }
}

export default logger;
