import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/users/model/user/user.interface';
import { DeleteResult, Repository } from 'typeorm';
import { ConnectedUser } from '../model/connected-user/connected-user.entity';
import { IConnectedUser } from '../model/connected-user/connected-user.interface';
import { Mode } from '../model/connected-user/mode.enum';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUser)
    private readonly connetedUserRepository: Repository<ConnectedUser>,
  ) {}

  async create(connectedUser: IConnectedUser): Promise<ConnectedUser> {
    if (connectedUser) {
      const newConnectedUser =
        this.connetedUserRepository.create(connectedUser);
      return this.connetedUserRepository.save(newConnectedUser);
    }
  }

  async findByUserAndMode(user: IUser, mode: Mode): Promise<ConnectedUser> {
    if (user) {
      return this.connetedUserRepository
        .createQueryBuilder('connected')
        .leftJoinAndSelect('connected.user', 'user')
        .where('user.id = :id', { id: user.id })
        .andWhere('connected.mode = :mode', { mode })
        .orderBy('connected.created_at', 'DESC')
        .limit(1)
        .getOne();
    }
  }

  async allConnectedUser(): Promise<ConnectedUser[]> {
    return this.connetedUserRepository
      .createQueryBuilder('connected')
      .leftJoinAndSelect('connected.user', 'user')
      .getMany();
  }

  async getAll() {
    return this.connetedUserRepository.createQueryBuilder().getMany();
  }

  async deleteByUser(user: IUser): Promise<DeleteResult> {
    if (user) {
      return this.connetedUserRepository
        .createQueryBuilder('connected')
        .leftJoinAndSelect('connected.user', 'user')
        .where('user.id = :id', { id: user.id })
        .delete()
        .execute();
    }
  }

  async deleteBySocketId(socketId: string): Promise<any> {
    if (socketId) {
      return this.connetedUserRepository.delete({ socketId });
    }
  }

  async deleteAll() {
    await this.connetedUserRepository.createQueryBuilder().delete().execute();
  }
}
