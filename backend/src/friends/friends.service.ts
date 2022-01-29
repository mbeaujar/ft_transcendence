import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { identity } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { FriendsRequest } from './entities/friends-request.entity';
import { Friends } from './entities/friends.entity';

// ---------------------
// a want to be friends
// b want to be friends +
// a and b are friends
// ---------------------

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends) private friendsRepo: Repository<Friends>,
    @InjectRepository(FriendsRequest)
    private friendsRequestRepo: Repository<FriendsRequest>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async deleteFriendship(user: User, target: number) {
    // const friends = await this.friendsRepo.findOne({ id: user.friendsId });
  }

  async getFriendsList(id: number): Promise<Friends> {
    return this.friendsRepo.findOne({ id });
  }

  isAlreadyOnFriendList(user: Friends, target: number): boolean {
    for (let i = 0; user.friends && i < user.friends.length; i++) {
      if (user.friends[i].id === target) {
        return true;
      }
    }
    return false;
  }

  async addFriendOnList(user: Friends, target: User) {
    if (!user) {
      throw new NotFoundException('Friends table for user not found');
    }
    if (!user.friends) {
      throw new InternalServerErrorException(
        "Array friends in friends table doesn't exist",
      );
    }
    user.friends.push(target);
    return this.friendsRepo.save(user);
  }

  async createFriendRequest(
    user: User,
    target: number,
  ): Promise<FriendsRequest | Friends> {
    // Check if he is not already on Friends list
    const friendsUser = await this.friendsRepo.findOne({
      id: user.friendsId,
    });
    if (this.isAlreadyOnFriendList(friendsUser, target) === true) {
      throw new BadRequestException('Friends already exist on friends list');
    }
    const requestExist = await this.friendsRequestRepo.findOne({
      user: user.id,
      target,
    });
    if (!requestExist) {
      /** friends request doesn't exist */
      const targetRequest = await this.friendsRequestRepo.findOne({
        user: target,
        target: user.id,
      });
      if (!targetRequest) {
        /** target did not send us a friend request */
        const request = this.friendsRequestRepo.create({
          user: user.id,
          target,
        });
        return this.friendsRequestRepo.save(request);
      } else {
        /** tagret has already sent a friend request -> create friendship */
        await this.friendsRequestRepo.delete({ user: target, target: user.id }); // delete tagret request

        const targetUser = await this.usersRepo.findOne({ id: target });
        const friendsTarget = await this.friendsRepo.findOne({
          id: targetUser.friendsId,
        });

        await this.addFriendOnList(friendsTarget, user);
        return this.addFriendOnList(friendsUser, targetUser);
      }
    } else {
      throw new BadRequestException('Friends request already exist');
    }
  }
}
