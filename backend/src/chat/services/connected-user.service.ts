import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/users/model/user/user.interface';
import { DeleteResult, Repository } from 'typeorm';
import { ConnectedUser } from '../model/connected-user/connected-user.entity';
import { IConnectedUser } from '../model/connected-user/connected-user.interface';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUser)
    private readonly connetedUserRepository: Repository<ConnectedUser>,
  ) {}

  async create(connectedUser: IConnectedUser): Promise<ConnectedUser> {
    const newConnectedUser = this.connetedUserRepository.create(connectedUser);
    return this.connetedUserRepository.save(newConnectedUser);
  }

  async findByUser(user: IUser): Promise<ConnectedUser> {
    return this.connetedUserRepository
      .createQueryBuilder('connected')
      .leftJoinAndSelect('connected.user', 'user')
      .where('user.id = :id', { id: user.id })
      .getOne();
  }

  async getAll() {
    return this.connetedUserRepository.createQueryBuilder().getMany();
  }

  async deleteByUser(user: IUser): Promise<DeleteResult> {
    return this.connetedUserRepository
      .createQueryBuilder('connected')
      .leftJoinAndSelect('connected.user', 'user')
      .where('user.id = :id', { id: user.id })
      .delete()
      .execute();
  }

  async deleteBySocketId(socketId: string): Promise<any> {
    return this.connetedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connetedUserRepository.createQueryBuilder().delete().execute();
  }
}
