const FORBIDDEN_ERROR_CODE = 403;

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = FORBIDDEN_ERROR_CODE;
  }
}

module.exports = {
  ForbiddenError,
  FORBIDDEN_ERROR_CODE,
};
