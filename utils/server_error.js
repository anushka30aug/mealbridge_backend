class ServerError extends Error {
  constructor(message, statusCode, meta = {}) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.meta = meta;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ServerError;
