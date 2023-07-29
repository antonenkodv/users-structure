import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error } from 'sequelize';

export const errorsMap: Map<HttpStatus, string> = new Map([
    [HttpStatus.NOT_FOUND, 'The requested resource could not be found'],
    [HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong, please try again'],
]);

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    private logger = new Logger('MyExceptionFilter');

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status = this.responseStatus(exception);

        const responseData: any = {
            code: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        if (exception instanceof NotFoundException) {
            responseData.message = errorsMap.get(HttpStatus.NOT_FOUND);
        } else if (exception instanceof HttpException) {
            responseData.message = exception.message;
        } else {
            responseData.message = errorsMap.get(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        this.logger.error(exception);

        response.status(status).json(responseData);
    }

    private responseStatus(exception: any): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        } else {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}
