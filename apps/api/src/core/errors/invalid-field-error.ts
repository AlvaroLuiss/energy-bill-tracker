import { ServiceError } from './service-error';

export class InvalidFieldError extends Error implements ServiceError {
  constructor() {
    super('Invalid field');
  }
}
