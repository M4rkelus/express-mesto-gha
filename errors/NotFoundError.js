class NotFoundError extends Error {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.message = message;
  }
}

module.exports = NotFoundError;
