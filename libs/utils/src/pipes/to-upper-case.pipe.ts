import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ToUpperCasePipe implements PipeTransform {
  constructor(private target: string) {}

  transform(value: any, metadata: ArgumentMetadata) {
    value[this.target] = value[this.target].toUpperCase();
    return value;
  }
}
