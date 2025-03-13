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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Url } from './entities/url.entity';

@ApiTags('URL Shortener')
@ApiBearerAuth('access-token')
@Controller('api')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Shorten a URL',
    description: 'Creates a shortened version of the provided URL',
  })
  @ApiBody({
    type: CreateUrlDto,
    description: 'URL to be shortened',
  })
  @ApiCreatedResponse({
    description: 'URL shortened successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'URL shortened successfully' },
        data: { $ref: '#/components/schemas/Url' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
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
  @ApiOperation({
    summary: 'Get all URLs',
    description:
      'Retrieves all shortened URLs created by the authenticated user',
  })
  @ApiOkResponse({
    description: 'URLs retrieved successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'URLs retrieved successfully' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Url' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
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
  @ApiOperation({
    summary: 'Get URL analytics',
    description: 'Retrieves analytics for a specific shortened URL',
  })
  @ApiParam({
    name: 'shortUrl',
    description: 'The short code or full shortened URL',
    example: '3e259b48',
  })
  @ApiOkResponse({
    description: 'Analytics retrieved successfully',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'URL analytics retrieved successfully',
        },
        data: { $ref: '#/components/schemas/Url' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'URL not found' })
  @ApiUnauthorizedResponse({ description: 'Not authorized to view this URL' })
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

  @Patch('urls/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update URL',
    description: 'Updates an existing shortened URL',
  })
  @ApiParam({
    name: 'id',
    description: 'URL ID',
    example: '1',
  })
  @ApiBody({
    type: UpdateUrlDto,
    description: 'Updated URL information',
  })
  @ApiOkResponse({
    description: 'URL updated successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'URL updated successfully' },
        data: { $ref: '#/components/schemas/Url' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'URL not found' })
  @ApiUnauthorizedResponse({ description: 'Not authorized to update this URL' })
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
  @ApiOperation({
    summary: 'Delete URL',
    description: 'Deletes a shortened URL',
  })
  @ApiParam({
    name: 'id',
    description: 'URL ID',
    example: '1',
  })
  @ApiOkResponse({
    description: 'URL deleted successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'URL deleted successfully' },
        data: { type: 'null', example: null },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'URL not found' })
  @ApiUnauthorizedResponse({ description: 'Not authorized to delete this URL' })
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
