import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TwoFactorAuthenticationDto } from 'src/auth/2fa.dto';
import { LocalFileDto } from 'src/users/dtos/local-file.dto';
import { LocalFile } from 'src/users/model/localFile.entity';
import { User } from 'src/users/model/user/user.entity';
import { IUser } from 'src/users/model/user/user.interface';
import { Like, Repository } from 'typeorm';
import { Friends } from '../friends/model/friends.entity';
import { State } from './model/state.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFilesRepository: Repository<LocalFile>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
  ) {}

  async getFileById(fileId: number) {
    if (fileId) {
      return this.localFilesRepository.findOne(fileId);
    }
  }

  async deleteFileById(fileId: number) {
    if (fileId) {
      return this.localFilesRepository.delete(fileId);
    }
  }

  async saveLocalFileData(fileData: LocalFileDto) {
    if (fileData) {
      const newFile = this.localFilesRepository.create(fileData);
      await this.localFilesRepository.save(newFile);
      return newFile;
    }
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    if (userId !== undefined && userId !== null) {
      return this.usersRepository.update(userId, {
        isTwoFactorEnabled: true,
      });
    }
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    if (userId !== undefined && userId !== null) {
      return this.usersRepository.update(userId, {
        isTwoFactorEnabled: false,
        twoFactorAuthenticationSecret: null,
      });
    }
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    if (userId !== undefined && userId !== null) {
      return this.usersRepository.update(userId, {
        twoFactorAuthenticationSecret: secret,
      });
    }
  }

  async findSecret(id: number): Promise<User> {
    return this.usersRepository.findOne(id, { select: ['twoFactorAuthenticationSecret']});
  }

  async findUser(id: number): Promise<User> {
    if (id !== undefined && id !== null) {
      return this.usersRepository.findOne(id, {
        relations: ['blockedUsers'],
      });
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  async findUserALIKEWithUsername(username: string) {
    if (username) {
      return this.usersRepository.find({
        where: [
          {
            username: Like(`${username}%`),
          },
        ],
      });
    }
  }

  async changeSensitivity(sensitivity: number, id: number) {
    if (id && sensitivity) {
      return this.usersRepository.update(id, { sensitivity });
    }
  }

  async leaderboard(): Promise<User[]> {
    return this.usersRepository.find({
      order: {
        elo: 'ASC',
      },
    });
  }

  async ranking(elo: number): Promise<User[]> {
    if (elo) {
      return this.usersRepository
        .createQueryBuilder('user')
        .where('user.elo > :elo', { elo })
        .orderBy('user.elo', 'DESC')
        .getMany();
    }
  }

  async createUser(userDetails: IUser): Promise<User> {
    if (userDetails) {
      const friends = this.friendsRepository.create({
        id: userDetails.id,
        friends: [],
      });
      await this.friendsRepository.save(friends);
      if (userDetails.blockedUsers === undefined) {
        userDetails.blockedUsers = [];
      }
      const user = this.usersRepository.create(userDetails);
      return this.login(user);
    }
  }

  async updateUser(user: IUser, attrs: Partial<User>): Promise<User> {
    if (user) {
      Object.assign(user, attrs);
      return this.usersRepository.save(user);
    }
  }

  async saveUser(user: IUser): Promise<User> {
    if (user) {
      return this.usersRepository.save(user);
    }
  }

  async deleteUser(user: IUser): Promise<any> {
    if (user) {
      return this.usersRepository.delete({ id: user.id });
    }
  }

  async login(user: IUser): Promise<User> {
    if (user) {
      user.state = State.online;
      return this.usersRepository.save(user);
    }
  }

  async logout(user: IUser): Promise<User> {
    if (user) {
      user.state = State.offline;
      return this.usersRepository.save(user);
    }
  }
}
