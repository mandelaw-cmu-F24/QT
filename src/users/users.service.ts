import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthType } from '../common/enums/authtype.enum';
import { UserRole } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOne(createUserDto.email);
    if (userExist) {
      throw new ConflictException('User with this email already exist 😔');
    } else {
      const user = await this.usersRepository.save({
        ...createUserDto,
        isActive: false,
        authType: AuthType.httpbasic,
        role: UserRole.user,
      });
      return user;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email: email } });
  }

  async setActiveRefreshToken(userId: number, token: string) {
    await this.usersRepository.update({ id: userId }, { refreshToken: token });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
