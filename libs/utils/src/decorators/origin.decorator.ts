import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Origin = Reflector.createDecorator<string[]>();
// export const Origin = (origins: string[]) => SetMetadata('origins', origins);
