import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
    },
    { message: 'Please provide a valid URL with http or https protocol' },
  )
  @Matches(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, {
    message: 'The URL format is invalid',
  })
  originalUrl: string;
}
