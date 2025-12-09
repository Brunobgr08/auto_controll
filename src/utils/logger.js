// Verificar se estamos em ambiente de teste
const isTestEnv = process.env.NODE_ENV === 'test';

const logger = {
  info: (message, data = {}) => {
    if (!isTestEnv) {
      console.log(
        `[INFO] ${new Date().toISOString()} - ${message}`,
        Object.keys(data).length ? JSON.stringify(data, null, 2) : ''
      );
    }
  },

  error: (message, error = {}) => {
    if (!isTestEnv) {
      const errorMessage = error.message || error;
      console.error(
        `[ERROR] ${new Date().toISOString()} - ${message}`,
        errorMessage
      );

      if (error.stack && process.env.NODE_ENV === 'development') {
        console.error('Stack:', error.stack);
      }
    }
  },

  warn: (message, data = {}) => {
    if (!isTestEnv) {
      console.warn(
        `[WARN] ${new Date().toISOString()} - ${message}`,
        Object.keys(data).length ? JSON.stringify(data, null, 2) : ''
      );
    }
  },

  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `[DEBUG] ${new Date().toISOString()} - ${message}`,
        Object.keys(data).length ? JSON.stringify(data, null, 2) : ''
      );
    }
  },
};

module.exports = logger;
