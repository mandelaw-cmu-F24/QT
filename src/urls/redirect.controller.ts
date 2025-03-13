import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller()
export class RedirectController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ): Promise<void> {
    const nextJsPaths = ['success', 'auth', 'dashboard', 'login', 'register'];

    for (const path of nextJsPaths) {
      if (shortCode === path || shortCode.startsWith(`${path}/`)) {
        const frontendUrl =
          this.configService.get<string>('FRONTEND_URL') ||
          'http://localhost:3001';
        const queryString = Object.keys(res.req.query).length
          ? `?${new URLSearchParams(
              res.req.query as Record<string, string>,
            ).toString()}`
          : '';

        return res.redirect(`${frontendUrl}/${shortCode}${queryString}`);
      }
    }

    try {
      // If not a Next.js path, treat as a shortened URL
      const originalUrl =
        await this.urlsService.trackVisitAndGetOriginalUrl(shortCode);
      return res.redirect(originalUrl);
    } catch (error) {
      throw new NotFoundException(`URL with code ${shortCode} not found`);
    }
  }
}
