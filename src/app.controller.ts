import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from './common/interfaces/api-response.interface';
// Removed: import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getWelcomeMessage(): ApiResponse<string> {
    const results = this.appService.getWelcomeMessage();
    return { message: 'Root API calls successfully', data: results };
  }
}
