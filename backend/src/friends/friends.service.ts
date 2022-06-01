import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockList } from 'net';
import { User } from 'src/users/model/user/user.entity';
import { Repository } from 'typeorm';
import { FriendsRequest } from './model/friends-request.entity';
import { Friends } from './model/friends.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
    @InjectRepository(FriendsRequest)
    private readonly friendsRequestRepository: Repository<FriendsRequest>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getFriendsRequest(id: number): Promise<FriendsRequest[]> {
    if (id !== undefined && id !== null) {
      return this.friendsRequestRepository
        .createQueryBuilder('friends')
        .where('friends.target = :id', { id })
        .leftJoinAndSelect('friends.userInfo', 'user_info')
        .getMany();
    }
  }

  RemoveFriendOnFriendsList(user: Friends, target: number): void {
    for (let i = 0; user.friends && i < user.friends.length; i++) {
      if (user.friends[i].id === target) {
        user.friends.splice(i, 1);
        return;
      }
    }
  }

  async blockFriend(userId: number, target: number) {
    
    const friend = await this.friendsRepository.findOne(userId);
    if (!friend)
      throw new BadRequestException('');
    if (this.isAlreadyOnFriendList(friend, target)) {
      const user = await this.usersRepository.findOne(userId);
      if (!user)
        throw new BadRequestException('');
      this.deleteFriendship(user, target);
    }
  }

  async deleteFriendsRequest(user: number, target: number) {
    await this.friendsRequestRepository.delete({ user, target });
  }

  async deleteFriendship(user: User, target: number): Promise<Friends> {
    const friendsUser = await this.friendsRepository.findOne({ id: user.id });
    const friendsTarget = await this.friendsRepository.findOne({ id: target });
    if (!friendsTarget || !friendsUser)
      throw new BadRequestException('you are not friends');
    this.RemoveFriendOnFriendsList(friendsUser, target);
    this.RemoveFriendOnFriendsList(friendsTarget, user.id);
    await this.friendsRepository.save(friendsTarget);
    return this.friendsRepository.save(friendsUser);
  }

  async getFriendsList(id: number): Promise<Friends> {
    if (id !== undefined && id !== null) {
      return this.friendsRepository.findOne({ id });
    }
    return { id: 0, friends: [] };
  }

  isAlreadyOnFriendList(user: Friends, target: number): boolean {
    for (let i = 0; user.friends && i < user.friends.length; i++) {
      if (user.friends[i].id === target) {
        return true;
      }
    }
    return false;
  }

  async addFriendOnList(user: Friends, target: User): Promise<Friends> {
    if (!user.friends) {
      throw new InternalServerErrorException(
        "Array friends in friends table doesn't exist",
      );
    }
    user.friends.push(target);
    return this.friendsRepository.save(user);
  }

  async findFriends(id: number) {
    const friends = await this.friendsRepository.findOne({ id });
    if (!friends) {
      throw new NotFoundException('Friends table for user not found');
    }
    return friends;
  }

  async findFriendsRequest(user: number, target: number) {
    return this.friendsRequestRepository.findOne({
      user,
      target,
    });
  }

  async createFriendRequest(
    user: User,
    target: string,
  ): Promise<FriendsRequest | Friends> {
    if (user.username === target) {
      throw new BadRequestException("can't add yourself");
    }
    user.blockedUsers.map((index) => {
      if (index.username === target) {
        throw new BadRequestException("you can't add a blocked user");
      }
    })
    const targetUser = await this.usersRepository.findOne({ username: target }, { relations: ['blockedUsers'] });
    if (!targetUser) {
      throw new NotFoundException('user not found');
    }
    targetUser.blockedUsers.map((index) => {
      if (index.username === user.username) {
        throw new BadRequestException("this user blocked you");
      }
    })
    const friendsUser = await this.findFriends(user.id);

    if (this.isAlreadyOnFriendList(friendsUser, targetUser.id) === true) {
      throw new BadRequestException('Friends already exist on friends list');
    }
    const requestExist = await this.findFriendsRequest(user.id, targetUser.id);

    if (!requestExist) {
      const targetRequest = await this.findFriendsRequest(
        targetUser.id,
        user.id,
      );

      if (!targetRequest) {
        const request = this.friendsRequestRepository.create({
          user: user.id,
          userInfo: user,
          target: targetUser.id,
        });
        return this.friendsRequestRepository.save(request);
      } else {
        await this.friendsRequestRepository.delete({
          user: targetUser.id,
          target: user.id,
        });
        const friendsTarget = await this.findFriends(targetUser.id);

        await this.addFriendOnList(friendsTarget, user);
        return this.addFriendOnList(friendsUser, targetUser);
      }
    } else {
      throw new BadRequestException('Friends request already exist');
    }
  }
}
