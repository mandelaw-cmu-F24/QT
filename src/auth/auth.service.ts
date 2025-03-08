import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { BcryptService } from '../common/services/bcrypt.service';
import { TokenPayload } from './interfaces/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/enums/role.enum';
import { Token } from './interfaces/token.interface';
import { SendGrindService } from '../common/services/sendgrid.service';
import { emailVerificationTemplate } from '../common/template/email-verification.template';
import { ConfigService } from '@nestjs/config';
import { UserDetail } from './interfaces/user-detaill.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sendGridService: SendGrindService,
  ) {}

  async register(userInfo: CreateUserDto): Promise<any> {
    userInfo.password = await this.bcryptService.hash(userInfo.password);
    const createdUser = await this.userService.create(userInfo);
    const verificationEmail = {
      to: createdUser.email,
      subject: 'Confirm email',
      from: this.configService.get<string>('SEND_GRID_FROM'),
      text: `Confirm email`,
      html: emailVerificationTemplate({
        link: '',
        code: 10000,
      }),
    };
    await this.sendGridService.send(verificationEmail);
    return createdUser;
  }

  async login(loginDto: LoginDto): Promise<Token> {
    const user = await this.userService.findOne(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Unvalid credentials, Please try again');
    } else {
      const isValidPassword = await this.bcryptService.compare(
        loginDto.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException(
          'Unvalid credentials! Please try again',
        );
      } else {
        const tokens = {
          accessToken: await this.generateJwtAccessToken(user.id, user.role),
          refreshToken: await this.generateJwtRefreshToken(user.id, user.role),
        };
        await this.userService.setActiveRefreshToken(
          user.id,
          await this.bcryptService.hash(tokens.refreshToken),
        );
        return tokens;
      }
    }
  }

  async logout(userId: number): Promise<void> {
    // Clearing the refresh token in the database
    await this.userService.setActiveRefreshToken(userId, null);
  }

  async validateGoogleUser(user: UserDetail): Promise<User> {
    console.log(user);
    const userExist = await this.userService.findOne(user.email);
    if (userExist) return userExist;
    const createdUser = await this.userService.create({
      email: user.email,
      name: user.name,
      password: 'no password',
    });
    return createdUser;
  }

  async generateJwtAccessToken(
    userId: number,
    role: UserRole,
  ): Promise<string> {
    const payload: TokenPayload = { id: userId, role: role };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
      algorithm: 'RS256',
    });
    return token;
  }

  async generateJwtRefreshToken(
    userId: number,
    role: UserRole,
  ): Promise<string> {
    const payload: TokenPayload = { id: userId, role: role };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
      algorithm: 'RS256',
    });
    return token;
  }
}
