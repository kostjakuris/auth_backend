import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const {metatype} = metadata;
    if (metatype) {
      const obj = plainToInstance(metatype, value);
      const errors = await validate(obj);
      
      if (errors.length) {
        let messages = errors.map((error) => {
          if (error.constraints) {
            return `${error.property} - ${Object.values(error.constraints).join(', ')}`;
          }
        });
        throw new BadRequestException(messages);
      }
      return value;
    }
  }
}