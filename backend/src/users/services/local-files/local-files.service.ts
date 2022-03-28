import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalFileDto } from 'src/users/dtos/local-file.dto';
import { LocalFile } from 'src/users/entities/localFile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFilesRepository: Repository<LocalFile>,
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
}
