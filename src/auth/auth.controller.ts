import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { Token } from './interfaces/token.interface';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userInfo: CreateUserDto): Promise<ApiResponse<User>> {
    const payload = await this.authService.register(userInfo);
    return { message: 'Registered successfully', data: payload };
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<Token>> {
    const payload = await this.authService.login(loginDto);
    return { message: 'Login successfully', data: payload };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request): Promise<ApiResponse<null>> {
    await this.authService.logout((req.user as User).id);
    return { message: 'Logged out successfully', data: null };
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.OK)
  googleLogin() {
    return { message: 'Successfully logged in with google' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.OK)
  googleCallback() {
    return { message: 'OK' };
  }
}
