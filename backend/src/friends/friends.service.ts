import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { FriendsTicket } from './entities/friends.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendsTicket) private repo: Repository<FriendsTicket>,
  ) {}

  async createTicket(user: User, cibleId: number) {
    const ticket = this.repo.create({ ownerId: user.id, cibleId });
    return this.repo.save(ticket);
  }

  async findTicket(ownerId: number, cibleId: number) {
    return this.repo.find({ ownerId, cibleId });
  }

  async deleteTicket(ownerId: number, cibleId: number) {
    return this.repo.delete({ ownerId, cibleId });
  }

  async sendFriendRequest(user: User, cible: User) {
    const ticket = await this.findTicket(user.id, cible.id);
    /**
     * if ticket user -> cible don't exist
     */
    if (!ticket) {
      const ticketReceive = await this.findTicket(cible.id, user.id);
      /**
       * if ticket cible -> user don't exist
       */
      if (!ticketReceive) {
        return this.createTicket(user, cible.id);
      }
      /**
       * else create friendship
       */
      await this.deleteTicket(user.id, cible.id);

      if (cible.friends.includes(user.id) === false) {
        cible.friends.push(user.id);
        user.friends.push(cible.id);
      }
    }
  }
}
