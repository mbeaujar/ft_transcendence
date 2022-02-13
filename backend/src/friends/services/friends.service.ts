import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { FriendsRequest } from '../entities/friends-request.entity';
import { Friends } from '../entities/friends.entity';

// ---------------------
// a want to be friends
// b want to be friends +
// a and b are friends
// ---------------------

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
    return this.friendsRequestRepository.find({ target: id });
  }

  RemoveFriendOnFriendsList(user: Friends, target: number): void {
    for (let i = 0; user.friends && i < user.friends.length; i++) {
      if (user.friends[i].id === target) {
        user.friends.splice(i, 1);
        return;
      }
    }
  }

  async deleteFriendsRequest(user: number, target: number) {
    await this.friendsRequestRepository.delete({ user, target });
  }

  /** No check it can be called if users are not friends */
  async deleteFriendship(user: User, target: number): Promise<Friends> {
    const friendsUser = await this.friendsRepository.findOne({ id: user.id });
    const friendsTarget = await this.friendsRepository.findOne({ id: target });
    this.RemoveFriendOnFriendsList(friendsUser, target);
    this.RemoveFriendOnFriendsList(friendsTarget, user.id);
    await this.friendsRepository.save(friendsTarget);
    return this.friendsRepository.save(friendsUser);
  }

  async getFriendsList(id: number): Promise<Friends> {
    return this.friendsRepository.findOne({ id });
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
    target: number,
  ): Promise<FriendsRequest | Friends> {
    if (user.id === target) {
      throw new BadRequestException("can't add yourself");
    }
    const friendsUser = await this.findFriends(user.id);
    const targetUser = await this.usersRepository.findOne({ id: target });

    if (!targetUser) {
      throw new NotFoundException('user not found');
    }

    if (this.isAlreadyOnFriendList(friendsUser, target) === true) {
      throw new BadRequestException('Friends already exist on friends list');
    }
    const requestExist = await this.findFriendsRequest(user.id, target);

    if (!requestExist) {
      /** friends request doesn't exist */
      const targetRequest = await this.findFriendsRequest(target, user.id);

      if (!targetRequest) {
        /** target did not send us a friend request */
        const request = this.friendsRequestRepository.create({
          user: user.id,
          target,
        });
        return this.friendsRequestRepository.save(request);
      } else {
        /** tagret has already sent a friend request -> create friendship */
        await this.friendsRequestRepository.delete({
          user: target,
          target: user.id,
        }); // delete tagret request
        const friendsTarget = await this.findFriends(target);

        await this.addFriendOnList(friendsTarget, user);
        return this.addFriendOnList(friendsUser, targetUser);
      }
    } else {
      throw new BadRequestException('Friends request already exist');
    }
  }
}
