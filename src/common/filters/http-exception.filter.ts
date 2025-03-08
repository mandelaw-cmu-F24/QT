import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Status } from '../enums/status.enum';
import { isArray } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as Record<string, unknown>);
    Logger.error(`${request.url} ${request.method}`, exception.stack);
    if (exception instanceof HttpException) {
      response.status(status).json({
        status: Status.Error,
        ...this.reconstructError(error),
        timestamp: new Date().toISOString(),
      });
    } else {
      response.status(status).json({
        status: Status.Error,
        message: 'Something went wrong on the servers try again!',
        error: 'Internal Server Error',
        statusCode: status,
        timestamp: new Date().toISOString(),
      });
    }
  }

  reconstructError(error: string | Record<string, unknown> | any): any {
    if (error.message && !isArray(error.message)) {
      error.message = [error.message];
    }
    return error;
  }
}
