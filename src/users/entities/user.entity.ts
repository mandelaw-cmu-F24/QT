import { Column, Entity, Unique, OneToMany } from 'typeorm';
import { UserRole } from '../enums/role.enum';
import { Audit } from '../../common/utils/audit.entity';
import { Exclude } from 'class-transformer';
import { AuthType } from '../../common/enums/authtype.enum';
import { Url } from '../../urls/entities/url.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity()
@Unique(['email'])
export class User extends Audit {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    description: 'User email address (unique)',
    example: 'john@example.com',
  })
  @Column({ nullable: false })
  email: string;

  @ApiHideProperty()
  @Column({ nullable: false })
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    default: true,
  })
  @Column({ default: true, type: 'boolean', nullable: false })
  isActive: boolean;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: 'user',
    default: 'user',
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
    nullable: false,
  })
  role: UserRole;

  @ApiHideProperty()
  @Column({
    type: 'enum',
    enum: AuthType,
    default: AuthType.httpbasic,
    nullable: false,
  })
  @Exclude()
  authType: AuthType;

  @ApiHideProperty()
  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @ApiProperty({
    description: 'URLs created by this user',
    type: () => [Url],
  })
  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];
}
