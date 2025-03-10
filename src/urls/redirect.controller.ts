import { Controller, Get, Param, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Response } from 'express';

@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ): Promise<void> {
    const originalUrl =
      await this.urlsService.trackVisitAndGetOriginalUrl(shortCode);
    res.redirect(originalUrl);
  }
}
