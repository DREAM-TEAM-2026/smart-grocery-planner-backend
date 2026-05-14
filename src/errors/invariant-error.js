import ClientError from '../errors/client-error.js';

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

export default InvariantError;
