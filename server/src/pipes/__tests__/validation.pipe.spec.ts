import { ArgumentMetadata } from '@nestjs/common';

import { ValidationException } from 'src/exceptions/validation.exception';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';

import { ValidationPipe } from '../validation.pipe';

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  const dtoMetadata: ArgumentMetadata = {
    type: 'body',
    metatype: CreateTrackDto,
  };

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  it('returns the value unchanged when metatype is not provided', async () => {
    const value = { anything: true };

    await expect(pipe.transform(value, { type: 'body' })).resolves.toBe(value);
  });

  it('returns the value unchanged when metatype is a primitive type', async () => {
    const value = 'hello';

    await expect(
      pipe.transform(value, { type: 'param', metatype: String }),
    ).resolves.toBe(value);
  });

  it('returns the value unchanged when a valid DTO is passed', async () => {
    const value = { name: 'Test', artist: 'A', text: 'T' };

    await expect(pipe.transform(value, dtoMetadata)).resolves.toBe(value);
  });

  it('throws ValidationException when the DTO fails validation', async () => {
    const value = { name: '', artist: 'A', text: 'T' };

    await expect(pipe.transform(value, dtoMetadata)).rejects.toThrow(
      ValidationException,
    );
  });

  it('formats error messages as "property - constraint messages"', async () => {
    const value = { name: '', artist: 'A', text: 'T' };

    try {
      await pipe.transform(value, dtoMetadata);
      fail('expected pipe.transform to throw');
    } catch (error) {
      const exception = error as ValidationException;
      expect(exception.messages).toEqual(
        expect.arrayContaining([expect.stringMatching(/^name - /)]),
      );
    }
  });

  it('returns the value unchanged when metatype has no name', async () => {
    const anonymousClass: new () => unknown = (() => class {})();
    const value = { anything: true };

    await expect(
      pipe.transform(value, { type: 'body', metatype: anonymousClass }),
    ).resolves.toBe(value);
  });
});
