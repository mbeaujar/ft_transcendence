import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findUser(id: number): Promise<User> {
    return this.repo.findOne({ id });
  }

  async createUser(userDetails: UserDto): Promise<User> {
    const user = this.repo.create(userDetails);
    return this.repo.save(user);
  }

  async updateUser(user: User, attrs: Partial<User>): Promise<User> {
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async deleteUser(user: User): Promise<void> {
    await this.repo.delete({ id: user.id });
  }
}
