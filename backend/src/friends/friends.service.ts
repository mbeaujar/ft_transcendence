import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { FriendsTicket } from './entities/friends.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendsTicket) private repo: Repository<FriendsTicket>,
  ) {}

  async createTicket(user: User, cibleId: number): Promise<FriendsTicket> {
    const ticket: FriendsTicket = this.repo.create({
      ownerId: user.id,
      cibleId,
    });
    return this.repo.save(ticket);
  }

  async findTicket(ownerId: number, cibleId: number): Promise<FriendsTicket[]> {
    return this.repo.find({ ownerId, cibleId });
  }

  async deleteTicket(ownerId: number, cibleId: number): Promise<any> {
    return this.repo.delete({ ownerId, cibleId });
  }

  async sendFriendsRequest(
    user: User,
    cibleId: number,
  ): Promise<FriendsTicket> {
    if (user.id === cibleId) {
      throw new BadRequestException(
        "User can't send a friend request at himself",
      );
    }
    const ticket: FriendsTicket[] = await this.findTicket(user.id, cibleId);
    if (!ticket || ticket.length === 0) {
      return this.createTicket(user, cibleId);
    }
  }

  async getAllFriends(user: User) {
    const userTicker = await this.repo.find({ ownerId: user.id });
    const listFriends = await Promise.all(
      userTicker.map(async (ticket) => {
        const friends = await this.repo.find({
          ownerId: ticket.cibleId,
          cibleId: user.id,
        });
        if (friends && friends.length > 0) {
          // console.log('f:', friends);
          // console.log('f+:', friends[0]);
          return friends[0].ownerId;
        }
      }),
    );
    // console.log('final:', listFriends);
    return listFriends;
  }
}
