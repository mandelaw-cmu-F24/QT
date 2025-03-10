import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Audit } from '../../common/utils/audit.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Url extends Audit {
  @Column({ nullable: false })
  originalUrl: string;

  @Index('idx_short_url') // applied explicit index for better query planning
  @Column({ nullable: false, unique: true })
  shortUrl: string;

  @Column({ default: 0 })
  visits: number;

  @Index('idx_user_id') // applied index on foreign key for faster joins
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.urls, {
    onDelete: 'CASCADE', // all URLS will be deleted related to user if user is deleted
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
