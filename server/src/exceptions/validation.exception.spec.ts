import { HttpStatus } from '@nestjs/common';

import { ValidationException } from './validation.exception';

describe('ValidationException', () => {
  it('sets the HTTP status to 400 Bad Request', () => {
    const exception = new ValidationException(['error']);

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('stores the given messages on the messages property', () => {
    const messages = ['name - Name cannot be empty'];

    const exception = new ValidationException(messages);

    expect(exception.messages).toBe(messages);
  });

  it('accepts a single string message as well as an array', () => {
    const exception = new ValidationException('single error');

    expect(exception.messages).toBe('single error');
  });
});
