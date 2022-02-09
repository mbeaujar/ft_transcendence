import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/users/interface/user.interface';
import { Repository } from 'typeorm';
import { ConnectedUser } from '../../entities/connected-user.entity';
import { IConnectedUser } from '../../interface/connected-user.interface';

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

  async findByUser(user: IUser): Promise<ConnectedUser[]> {
    return this.connetedUserRepository.find({ user });
  }

  async getAll() {
    return this.connetedUserRepository.createQueryBuilder().getMany();
  }

  async deleteBySocketId(socketId: string): Promise<any> {
    return this.connetedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connetedUserRepository.createQueryBuilder().delete().execute();
  }
}
