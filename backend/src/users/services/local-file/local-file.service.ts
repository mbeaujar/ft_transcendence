import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalFileDto } from 'src/users/dtos/local-file.dto';
import { LocalFile } from 'src/users/entities/localFile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalFileService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFilesRepository: Repository<LocalFile>,
  ) {}

  async getFileById(fileId: number) {
    return this.localFilesRepository.findOne(fileId);
  }

  async getAvatarById(fileId: number) {
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
}
