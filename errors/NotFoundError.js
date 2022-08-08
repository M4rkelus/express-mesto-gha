const ApplicationError = require('./ApplicationError');

class NotFoundError extends ApplicationError {
  constructor(message) {
    super(404);
    this.message = message;
  }
}

module.exports = NotFoundError;
