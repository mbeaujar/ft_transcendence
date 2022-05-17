import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Invite } from '../model/invite/invite.entity';
import { IInvite } from '../model/invite/invite.interface';

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

  async findInvite(owner: number, target: number): Promise<Invite> {
    return this.inviteRepository
      .createQueryBuilder('invite')
      .where('invite.owner = :owner', { owner })
      .andWhere('invite.target = :target', { target })
      .getOne();
  }

  async findByUser(id: number): Promise<Invite[]> {
    return this.inviteRepository.find({ target: id });
  }

  async find(id: number): Promise<Invite> {
    return this.inviteRepository.findOne(id);
  }

  async update(invite: IInvite, attrs: Partial<Invite>): Promise<Invite> {
    Object.assign(invite, attrs);
    return this.inviteRepository.save(invite);
  }

  async delete(owner: number, target: number): Promise<DeleteResult> {
    return this.inviteRepository
      .createQueryBuilder('invite')
      .where('invite.owner = :owner', { owner })
      .andWhere('invite.target = :target', { target })
      .delete()
      .execute();
  }
}
