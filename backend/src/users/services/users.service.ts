import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../dtos/user.dto';
import { User, State } from '../entities/user.entity';
import { Friends } from '../../friends/entities/friends.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
  ) {}

  async findUser(id: number): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  // ATTENTION -> https://typeorm.io/#/repository-api
  // Todo: check chaque appel de findOne si on envoie null ou undefined (+ de précision sur la doc)

  /**
   *	Create a User and a Friends table + link
   *
   * @param userDetails Partial<User>
   * @returns Promise<User>
   */
  async createUser(userDetails: UserDto): Promise<User> {
    const friends = this.friendsRepository.create({
      id: userDetails.id,
      friends: [],
    });
    await this.friendsRepository.save(friends);
    const user = this.usersRepository.create(userDetails);
    return this.usersRepository.save(user);
  }

  async updateUser(user: User, attrs: Partial<User>): Promise<User> {
    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  async deleteUser(user: User): Promise<void> {
    await this.usersRepository.delete({ id: user.id });
  }

  async login(user: User): Promise<User> {
    user.state = State.online;
    return this.usersRepository.save(user);
  }

  async logout(user: User): Promise<User> {
    user.state = State.offline;
    return this.usersRepository.save(user);
  }
}
