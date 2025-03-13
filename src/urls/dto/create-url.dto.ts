import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://example.com/very/long/path/to/shorten',
  })
  @IsNotEmpty({ message: 'Original URL is required' })
  @IsString({ message: 'Original URL must be a string' })
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
    },
    { message: 'Please provide a valid URL with http or https protocol' },
  )
  originalUrl: string;

  @ApiProperty({
    description: 'Custom alias for the short URL (optional)',
    example: 'my-custom-link',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Custom alias must be a string' })
  customAlias?: string;

  @ApiProperty({
    description: 'Title for the URL (optional)',
    example: 'My Important Link',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiProperty({
    description: 'Tags for the URL (optional)',
    example: ['work', 'important'],
    required: false,
    type: [String],
  })
  @IsOptional()
  tags?: string[];
}
