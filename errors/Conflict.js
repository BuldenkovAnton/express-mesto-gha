const CONFLICT_ERROR_CODE = 409;

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = CONFLICT_ERROR_CODE;
  }
}

module.exports = {
  ConflictError,
  CONFLICT_ERROR_CODE,
};
