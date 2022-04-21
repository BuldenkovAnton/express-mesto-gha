const VALIDATION_ERROR_CODE = 400;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = VALIDATION_ERROR_CODE;
  }
}

module.exports = {
  ValidationError,
  VALIDATION_ERROR_CODE,
};
