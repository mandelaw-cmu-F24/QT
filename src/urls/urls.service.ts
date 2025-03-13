import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class UrlsService {
  private baseUrl: string;

  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    private configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get('BASE_URL') || 'http://localhost:3000/';
    if (!this.baseUrl.endsWith('/')) {
      this.baseUrl += '/';
    }
  }

  // Generate a short code for our URLs
  private generateShortCode(): string {
    return crypto.randomBytes(4).toString('hex');
  }

  // Try to shorten URLs for known services using their native formats
  private tryDirectShortening(originalUrl: string): string | null {
    try {
      const urlObj = new URL(originalUrl);

      // YouTube: convert youtube.com/watch?v=abc123 to youtu.be/abc123
      if (
        urlObj.hostname.includes('youtube.com') &&
        urlObj.pathname === '/watch'
      ) {
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          return `https://youtu.be/${videoId}`;
        }
      }
      // Twitter: convert twitter.com to x.com
      else if (urlObj.hostname.includes('twitter.com')) {
        return originalUrl.replace('twitter.com', 'x.com');
      }
      // Amazon: extract product ID for shorter URL
      else if (urlObj.hostname.includes('amazon')) {
        const asin = originalUrl.match(/\/([A-Z0-9]{10})(?:\/|\?|$)/);
        if (asin && asin[1]) {
          const domain = urlObj.hostname.split('.amazon.')[1] || 'com';
          return `https://amzn.${domain}/dp/${asin[1]}`;
        }
      }
      // LinkedIn: shorten article URLs
      else if (
        urlObj.hostname.includes('linkedin.com') &&
        urlObj.pathname.includes('/pulse/')
      ) {
        const pulseId = urlObj.pathname.split('/pulse/')[1]?.split('-').pop();
        if (pulseId) {
          return `https://www.linkedin.com/pulse/${pulseId}`;
        }
      }

      // No direct shortening rule found
      return null;
    } catch (error) {
      return null;
    }
  }

  // Main method to shorten URLs with hybrid approach
  private shortenUrl(originalUrl: string): string {
    // First try direct shortening for known services
    const directShortUrl = this.tryDirectShortening(originalUrl);
    if (directShortUrl) {
      return directShortUrl;
    }

    // For all other URLs, use our redirect service
    const shortCode = this.generateShortCode();
    return `${this.baseUrl}${shortCode}`;
  }

  // Create a new shortened URL
  async create(createUrlDto: CreateUrlDto, user: User): Promise<Url> {
    const shortUrl = this.shortenUrl(createUrlDto.originalUrl);

    const newUrl = this.urlRepository.create({
      originalUrl: createUrlDto.originalUrl,
      shortUrl,
      userId: user.id,
    });

    return this.urlRepository.save(newUrl);
  }

  // Find all URLs for a specific user
  async findAllByUser(userId: number): Promise<Url[]> {
    return this.urlRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Find a URL by its short code for redirection
  async findByShortCode(shortCode: string): Promise<Url> {
    // Construct the full shortUrl
    const fullUrl = `${this.baseUrl}${shortCode}`;

    const url = await this.urlRepository.findOne({
      where: { shortUrl: fullUrl },
    });

    if (!url) {
      throw new NotFoundException(`URL with code ${shortCode} not found`);
    }

    return url;
  }

  // Track a visit and get original URL for redirection
  async trackVisitAndGetOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.findByShortCode(shortCode);

    // Increment the visit count
    url.visits += 1;
    await this.urlRepository.save(url);

    return url.originalUrl;
  }

  // Get analytics for a specific URL
  async getAnalytics(shortUrl: string, userId: number): Promise<Url> {
    // If shortUrl doesn't start with http, assume it's a shortCode
    if (!shortUrl.startsWith('http')) {
      shortUrl = `${this.baseUrl}${shortUrl}`;
    }

    const url = await this.urlRepository.findOne({
      where: { shortUrl },
    });

    if (!url) {
      throw new NotFoundException(`URL ${shortUrl} not found`);
    }

    // Authorization check
    if (url.userId !== userId) {
      throw new UnauthorizedException(
        'You can only access analytics for your own URLs',
      );
    }

    return url;
  }

  // Update a URL
  async update(
    id: number,
    updateUrlDto: UpdateUrlDto,
    userId: number,
  ): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { id } });

    if (!url) {
      throw new NotFoundException(`URL with ID ${id} not found`);
    }

    if (url.userId !== userId) {
      throw new UnauthorizedException('You can only update your own URLs');
    }

    // Created separate update object
    const updateData: Partial<Url> = { ...updateUrlDto };

    // If originalUrl is being updated, generate a new shortUrl
    if (
      updateUrlDto.originalUrl &&
      updateUrlDto.originalUrl !== url.originalUrl
    ) {
      updateData.shortUrl = this.shortenUrl(updateUrlDto.originalUrl);
    }

    await this.urlRepository.update(id, updateUrlDto);
    return this.urlRepository.findOne({ where: { id } });
  }

  // Delete a URL
  async remove(id: number, userId: number): Promise<void> {
    const url = await this.urlRepository.findOne({ where: { id } });

    if (!url) {
      throw new NotFoundException(`URL with ID ${id} not found`);
    }

    if (url.userId !== userId) {
      throw new UnauthorizedException('You can only delete your own URLs');
    }

    await this.urlRepository.delete(id);
  }
}
