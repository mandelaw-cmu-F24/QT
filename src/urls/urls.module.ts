import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.contoller';
import { RedirectController } from './redirect.controller';
import { Url } from './entities/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlsController, RedirectController],
  providers: [UrlsService],
})
export class UrlsModule {}
