const ApplicationError = require('./ApplicationError');

class BadRequestError extends ApplicationError {
  constructor(message) {
    super(400);
    this.message = message;
  }
}

module.exports = BadRequestError;
