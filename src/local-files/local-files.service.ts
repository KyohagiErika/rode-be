import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalFile } from './entities/local-file.entity';

@Injectable()
export class LocalFilesService {
    constructor(
        @InjectRepository(LocalFile)
        private readonly localFileRepository: Repository<LocalFile>,
    ) {}

    async createMany(files: Express.Multer.File[]) {
        const localFiles = await this.localFileRepository.save(files.map((file) => ({
            path: file.path,
        })));
        return [localFiles, null];
    }

    async findOneById(id: string): Promise<[LocalFile, any]> {
        const localFile = await this.localFileRepository.findOne({
            where: {
                id: id,
            }
        });
        if (!localFile) {
            return [null, 'File not found'];
        }
        return [localFile, null];
    }
}
