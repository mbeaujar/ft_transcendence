import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findUser(userId: number) {
    return this.repo.findOne({ userId });
  }

  async createUser(userDetails: UserDto) {
    const user = this.repo.create(userDetails);
    return this.repo.save(user);
  }
}
