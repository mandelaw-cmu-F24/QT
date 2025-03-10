import { Column, Entity, Unique, OneToMany } from 'typeorm';
import { UserRole } from '../enums/role.enum';
import { Audit } from '../../common/utils/audit.entity';
import { Exclude } from 'class-transformer';
import { AuthType } from '../../common/enums/authtype.enum';
import { Url } from '../../urls/entities/url.entity';

@Entity()
@Unique(['email'])
export class User extends Audit {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ default: true, type: 'boolean', nullable: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
    nullable: false,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: AuthType,
    default: AuthType.httpbasic,
    nullable: false,
  })
  @Exclude()
  authType: AuthType;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];
}
