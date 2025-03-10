import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Url } from './entities/url.entity';

@ApiTags('URLs')
@ApiBearerAuth()
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: Request,
  ): Promise<ApiResponse<Url>> {
    const user = req.user as User;
    const url = await this.urlsService.create(createUrlDto, user);
    return {
      message: 'URL shortened successfully',
      data: url,
    };
  }

  @Get('urls')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request): Promise<ApiResponse<Url[]>> {
    const user = req.user as User;
    const urls = await this.urlsService.findAllByUser(user.id);
    return {
      message: 'URLs retrieved successfully',
      data: urls,
    };
  }

  @Get('analytics/:shortUrl')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAnalytics(
    @Param('shortUrl') shortUrl: string,
    @Req() req: Request,
  ): Promise<ApiResponse<Url>> {
    const user = req.user as User;
    const analytics = await this.urlsService.getAnalytics(shortUrl, user.id);
    return {
      message: 'URL analytics retrieved successfully',
      data: analytics,
    };
  }

  // Keep the update and delete endpoints
  @Patch('urls/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Req() req: Request,
  ): Promise<ApiResponse<Url>> {
    const user = req.user as User;
    const updatedUrl = await this.urlsService.update(
      +id,
      updateUrlDto,
      user.id,
    );
    return {
      message: 'URL updated successfully',
      data: updatedUrl,
    };
  }

  @Delete('urls/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<ApiResponse<null>> {
    const user = req.user as User;
    await this.urlsService.remove(+id, user.id);
    return {
      message: 'URL deleted successfully',
      data: null,
    };
  }
}
