import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // console.log(value, metadata);
    try {
      const parsed = this.schema.parse(value);
      return parsed;
    } catch (error) {
      throw new BadRequestException(`Validation failed: ${error}`);
    }
  }
}
