import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  messages: string | object;

  constructor(response: string | string[]) {
    super(response, HttpStatus.BAD_REQUEST);
    this.messages = response;
  }
}
