import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Audit } from '../../common/utils/audit.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Url extends Audit {
  @ApiProperty({
    description: 'Original long URL that was shortened',
    example:
      'https://www.example.com/very/long/path/with/many/parameters?query=value',
  })
  @Column({ nullable: false })
  originalUrl: string;

  @ApiProperty({
    description: 'Shortened URL or direct shortening result',
    example: 'http://localhost:3000/abc123',
  })
  @Index('idx_short_url')
  @Column({ nullable: false, unique: true })
  shortUrl: string;

  @ApiProperty({
    description: 'Number of times the shortened URL has been visited',
    example: 42,
  })
  @Column({ default: 0 })
  visits: number;

  @ApiProperty({
    description: 'ID of the user who created this shortened URL',
    example: 1,
  })
  @Index('idx_user_id')
  @Column({ nullable: false })
  userId: number;

  @ApiProperty({
    description: 'User who created this shortened URL',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.urls, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
