import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { Status } from '../enums/status.enum';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter
  implements ExceptionFilter<QueryFailedError>
{
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message.replace(/\n/g, '');

    Logger.error(`${request.url} ${request.method}`, exception.stack);

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      status: Status.Error,
      message: message,
      error: 'Database error',
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}
