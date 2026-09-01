import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationException } from './validation.exception';

// The api-gateway is where all external input gets validated — auth-service
// and catalog-service trust whatever the gateway forwards to them and don't
// re-validate. Copied from server/src/pipes/validation.pipe.ts unchanged.
@Injectable()
export class ValidationPipe implements PipeTransform<unknown, Promise<unknown>> {
  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const obj = plainToInstance<object, unknown>(metadata.metatype, value, {
      enableImplicitConversion: true,
    });

    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map((err) => {
        const constraints = err.constraints || {};
        return `${err.property} - ${Object.values(constraints).join(', ')}`;
      });

      throw new ValidationException(messages);
    }

    return value;
  }

  private toValidate(metatype: Type<unknown>): boolean {
    const types: Type<unknown>[] = [String, Boolean, Number, Array, Object];

    if (types.includes(metatype) || !metatype.name) {
      return false;
    }

    return metatype.name !== 'Object';
  }
}
