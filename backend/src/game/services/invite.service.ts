import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Invite } from '../model/invite/invite.entity';
import { IInvite } from '../model/invite/invite.interface';
import { User } from '../../users/model/user/user.entity';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
  ) {}

  async create(inviteDetails: IInvite): Promise<Invite> {
    const invite = this.inviteRepository.create(inviteDetails);
    return this.inviteRepository.save(invite);
  }

  async findInvite(ownerId: number, targetId: number): Promise<Invite> {
    return this.inviteRepository
      .createQueryBuilder('invite')
      .leftJoinAndSelect('invite.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .leftJoinAndSelect('invite.target', 'target')
      .andWhere('target.id = :targetId', { targetId })
      .getOne();
  }

  async findByUser(userId: number): Promise<Invite[]> {
    return this.inviteRepository
      .createQueryBuilder('invite')
      .leftJoinAndSelect('invite.owner', 'owner')
      .leftJoinAndSelect('invite.target', 'target')
      .where('target.id = :userId', { userId })
      .getMany();
  }

  async find(id: number): Promise<Invite> {
    return this.inviteRepository.findOne(id, {
      relations: ['owner', 'target'],
    });
  }

  async update(invite: IInvite, attrs: Partial<Invite>): Promise<Invite> {
    Object.assign(invite, attrs);
    return this.inviteRepository.save(invite);
  }

  async deleteInvite(id: number): Promise<DeleteResult> {
    return this.inviteRepository.delete(id);
  }

  async delete(ownerId: number, targetId: number): Promise<DeleteResult> {
    return this.inviteRepository
      .createQueryBuilder('invite')
      .leftJoinAndSelect('invite.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .leftJoinAndSelect('invite.target', 'target')
      .andWhere('target.id = :targetId', { targetId })
      .delete()
      .execute();
  }
}
