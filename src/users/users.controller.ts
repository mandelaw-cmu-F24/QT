import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create user',
    description: 'Creates a new user (admin only)',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation information',
  })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiConflictResponse({ description: 'Email already exists' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves all users (admin only)',
  })
  @ApiOkResponse({ description: 'Returns all users' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates an existing user',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '1',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update information',
  })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes a user',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '1',
  })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
