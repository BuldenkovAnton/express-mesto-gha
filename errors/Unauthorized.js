const UNAUTHORIZED_ERROR_CODE = 401;

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
  }
}

module.exports = {
  UnauthorizedError,
  UNAUTHORIZED_ERROR_CODE,
};
