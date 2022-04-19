import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    if (!fileId) return;
    return this.localFilesRepository.findOne(fileId);
  }

  async deleteFileById(fileId: number) {
    return this.localFilesRepository.delete(fileId);
  }

  async saveLocalFileData(fileData: LocalFileDto) {
    const newFile = this.localFilesRepository.create(fileData);
    await this.localFilesRepository.save(newFile);
    return newFile;
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorEnabled: true,
    });
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorEnabled: false,
      twoFactorAuthenticationSecret: null,
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async findUser(id: number): Promise<User> {
    return this.usersRepository.findOne(id, {
      relations: ['blockedUsers'],
    });
  }

  async findUserALIKEWithUsername(username: string) {
    return this.usersRepository.find({
      where: [
        {
          username: Like(`${username}%`),
        },
      ],
    });
  }

  async changeSensitivity(sensitivity: number, id: number) {
    return this.usersRepository.update(id, {
      sensitivity,
    });
  }

  // ATTENTION -> https://typeorm.io/#/repository-api
  // Todo: check chaque appel de findOne si on envoie null ou undefined (+ de precision sur la doc)

  async createUser(userDetails: IUser): Promise<User> {
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

  async updateUser(user: IUser, attrs: Partial<User>): Promise<User> {
    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  async saveUser(user: IUser): Promise<User> {
    return this.usersRepository.save(user);
  }

  async deleteUser(user: IUser): Promise<any> {
    return this.usersRepository.delete({ id: user.id });
  }

  async login(user: IUser): Promise<User> {
    user.state = State.online;
    return this.usersRepository.save(user);
  }

  async logout(user: IUser): Promise<User> {
    user.state = State.offline;
    return this.usersRepository.save(user);
  }
}
