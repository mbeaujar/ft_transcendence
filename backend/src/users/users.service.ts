import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { User, State } from './entities/user.entity';
import { Friends } from 'src/friends/entities/friends.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Friends) private friendsRepo: Repository<Friends>,
  ) {}

  async findUser(id: number): Promise<User> {
    return this.usersRepo.findOne({ id });
  }

  /**
   *	Create a User and a Friends table + link
   *
   * @param userDetails Partial<User>
   * @returns Promise<User>
   */
  async createUser(userDetails: UserDto): Promise<User> {
    const friends = this.friendsRepo.create({
      id: userDetails.id,
      friends: [],
    });
    await this.friendsRepo.save(friends);
    const user = this.usersRepo.create(userDetails);
    return this.usersRepo.save(user);
  }

  async updateUser(user: User, attrs: Partial<User>): Promise<User> {
    Object.assign(user, attrs);
    return this.usersRepo.save(user);
  }

  async deleteUser(user: User): Promise<void> {
    await this.usersRepo.delete({ id: user.id });
  }

  async login(user: User): Promise<User> {
    user.state = State.online;
    return this.usersRepo.save(user);
  }

  async logout(user: User): Promise<User> {
    user.state = State.offline;
    return this.usersRepo.save(user);
  }
}
