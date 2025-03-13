import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiResponse as APIRESPONSE } from '../common/interfaces/api-response.interface';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { Token } from './interfaces/token.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { TokenResponseDto } from './dto/token-response.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided credentials',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration information',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'Registered successfully' },
        data: { $ref: '#/components/schemas/User' },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userInfo: CreateUserDto): Promise<APIRESPONSE<User>> {
    const payload = await this.authService.register(userInfo);
    return { message: 'Registered successfully', data: payload };
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and provides JWT tokens',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
  })
  @ApiCreatedResponse({
    description: 'Login successful',
    schema: {
      properties: {
        message: { type: 'string', example: 'Login successfully' },
        data: { $ref: '#/components/schemas/TokenResponseDto' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDto: LoginDto): Promise<APIRESPONSE<Token>> {
    const payload = await this.authService.login(loginDto);
    return { message: 'Login successfully', data: payload };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Invalidates user refresh token',
  })
  @ApiOkResponse({
    description: 'Logout successful',
    schema: {
      properties: {
        message: { type: 'string', example: 'Logged out successfully' },
        data: { type: 'null', example: null },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
  })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request): Promise<APIRESPONSE<null>> {
    await this.authService.logout((req.user as User).id);
    return { message: 'Logged out successfully', data: null };
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth login',
    description: 'Initiates Google OAuth authentication flow',
  })
  @ApiOkResponse({
    description: 'Redirects to Google authentication',
  })
  @HttpCode(HttpStatus.OK)
  googleLogin() {
    return { message: 'Successfully logged in with google' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth callback',
    description: 'Handles the callback from Google OAuth authentication',
  })
  @ApiOkResponse({
    description: 'Authentication successful, redirects to frontend dashboard',
  })
  @HttpCode(HttpStatus.OK)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    // Get the user from the request (populated by GoogleAuthGuard)
    const user = req.user as User;

    // Use the method in AuthService to create and save tokens
    const tokens = await this.authService.createTokensForUser(user);

    // Get frontend URL from config
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';

    // Redirect to a dedicated success page that will store tokens and then redirect to dashboard
    return res.redirect(
      `${frontendUrl}/success/oauth-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }
}
