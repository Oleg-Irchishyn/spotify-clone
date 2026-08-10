import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<
  unknown,
  Promise<unknown>
> {
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
