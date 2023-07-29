import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidationException extends BadRequestException {}

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (typeof value !== 'object') {
            return value;
        }

        const klass: any = plainToInstance(metadata.metatype, value);
        const errors = await validate(klass);
        if (!errors.length) {
            return value;
        }

        const exceptionMeta: Record<any, any> = {};
        for (const error of errors) {
            exceptionMeta[error.property] = Object.values(error.constraints);
        }
        throw new ValidationException(exceptionMeta);
    }
}
